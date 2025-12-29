
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import * as faceapi from '@vladmandic/face-api';
import { MODELS, SYSTEM_PROMPTS } from '../constants';
import { InterviewSession } from '../types';
import { createAudioBlob, decode, decodeAudioData } from '../services/audioService';

interface LiveInterviewProps {
  session: Partial<InterviewSession>;
  onEnd: (transcript: string[]) => void;
}



export const LiveInterview: React.FC<LiveInterviewProps> = ({ session, onEnd }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const transcriptRef = useRef<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [proctorWarning, setProctorWarning] = useState<{ message: string, type: string, severity: 'warning' | 'critical' } | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  // Proctoring Throttling
  const lastProctorAlertTime = useRef<number>(0);

  const loadFaceModels = async () => {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (e) {
      console.error("Face models failed to load", e);
    }
  };

  const cleanup = useCallback(() => {
    if (sessionRef.current) sessionRef.current.close?.();
    sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) { } });
    sourcesRef.current.clear();
    if (audioContextRef.current) audioContextRef.current.close().catch(() => { });
    if (outputAudioContextRef.current) outputAudioContextRef.current.close().catch(() => { });
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const triggerProctorAlert = (type: string, message: string, severity: 'warning' | 'critical' = 'warning') => {
    const now = Date.now();
    if (now - lastProctorAlertTime.current < 5000) return; // Debounce alerts

    setProctorWarning({ type, message, severity });
    lastProctorAlertTime.current = now;

    setTimeout(() => setProctorWarning(null), 5000);
  };

  const runNeuralProctoring = async () => {
    if (!videoRef.current || !overlayCanvasRef.current || !modelsLoaded || !session.proctoringEnabled) return;

    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    if (displaySize.width === 0) return;

    faceapi.matchDimensions(overlayCanvasRef.current, displaySize);

    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const ctx = overlayCanvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, displaySize.width, displaySize.height);
      resizedDetections.forEach(det => {
        const landmarks = det.landmarks;
        ctx.fillStyle = '#6366f1';
        ctx.globalAlpha = 0.5;
        landmarks.positions.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    }

    if (detections.length > 1) {
      triggerProctorAlert(
        "MULTIPLE_PEOPLE",
        "Multiple faces detected! Only the candidate should be visible in the camera.",
        'critical'
      );
    } else if (detections.length === 1) {
      const landmarks = detections[0].landmarks;
      const nose = landmarks.getNose()[3];
      const leftEye = landmarks.getLeftEye()[0];
      const rightEye = landmarks.getRightEye()[3];

      const horizontalRatio = (nose.x - leftEye.x) / (rightEye.x - leftEye.x);
      if (horizontalRatio < 0.3 || horizontalRatio > 0.7) {
        triggerProctorAlert(
          "LOOKING_AWAY",
          "Please look at the screen. Your gaze appears to be directed away from the camera.",
          'warning'
        );
      }
    } else if (detections.length === 0) {
      triggerProctorAlert(
        "NO_FACE_DETECTED",
        "No face detected! Please ensure you are visible in the camera frame.",
        'critical'
      );
    }

    requestAnimationFrame(runNeuralProctoring);
  };



  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: session.proctoringEnabled ? { width: 640, height: 480 } : false
      });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: MODELS.LIVE,
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createAudioBlob(inputData);
              sessionPromise.then((s: any) => {
                s.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            // INITIAL TRIGGER: Force the AI to start the conversation
            sessionPromise.then((s: any) => {
              s.sendRealtimeInput({
                text: "Session started. Please introduce yourself and start the interview."
              });
            });
          },
          onmessage: async (message: LiveServerMessage) => {

            if (message.serverContent?.outputTranscription) {
              currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const u = currentInputTranscriptionRef.current.trim();
              const b = currentOutputTranscriptionRef.current.trim();
              if (u) transcriptRef.current.push(`Candidate: ${u}`);
              if (b) transcriptRef.current.push(`Interviewer: ${b}`);
              setTranscription([...transcriptRef.current]);
              currentInputTranscriptionRef.current = '';
              currentOutputTranscriptionRef.current = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsBotSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsBotSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: SYSTEM_PROMPTS.INTERVIEWER(session.role!, session.level!, session.company!, session.description!),
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  useEffect(() => {
    loadFaceModels();
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);

    const handleBlur = () => {
      triggerProctorAlert(
        "TAB_SWITCH",
        "Tab/window switch detected! Please stay on this interview tab at all times.",
        'critical'
      );
    };
    window.addEventListener('blur', handleBlur);

    return () => {
      cleanup();
      clearInterval(timer);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startSession();
    }
  }, [modelsLoaded]);

  useEffect(() => {
    if (!isConnecting && videoRef.current && streamRef.current && session.proctoringEnabled) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.onloadedmetadata = () => {
        runNeuralProctoring();
      };
    }
  }, [isConnecting, session.proctoringEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-[var(--bg)] flex flex-col items-center justify-center text-[var(--text)] z-[1000]">
        <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 animate-pulse">Initializing Neural Mesh...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-hidden z-[1000]">
      <header className="h-20 bg-[var(--accent)] border-b border-[var(--border)] flex items-center justify-between px-10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text)] leading-none mb-1">{session.role} INTERVIEW</span>
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">{session.company}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-[var(--border)] hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-[9px] font-black uppercase text-[var(--muted)] tracking-tighter">Session Timer</span>
            <span className="text-sm font-mono text-indigo-400 font-bold">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <button
          onClick={() => onEnd(transcriptRef.current)}
          className="bg-[var(--surface)] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 text-[var(--text)] border border-[var(--border)] px-8 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 uppercase tracking-widest"
        >
          End Session
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {proctorWarning && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-top-4">
            <div className={`${proctorWarning.severity === 'critical'
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-yellow-500/20 border-yellow-500/50'
              } border backdrop-blur-xl px-8 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 min-w-[400px]`}>
              <div className={`w-10 h-10 rounded-full ${proctorWarning.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                } flex items-center justify-center font-black text-white text-lg shrink-0`}>
                {proctorWarning.severity === 'critical' ? '⚠' : '!'}
              </div>
              <div className="flex-1">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${proctorWarning.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                  {proctorWarning.severity === 'critical' ? '🚨 CRITICAL VIOLATION' : '⚡ WARNING'} - {proctorWarning.type.replace(/_/g, ' ')}
                </p>
                <p className="font-bold text-sm text-white leading-relaxed">{proctorWarning.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-visible">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05),transparent_70%)]"></div>

          <div className="w-full max-w-4xl relative z-10">
            <div className="glass-card aspect-video rounded-[48px] flex flex-col items-center justify-center p-8 relative border border-[var(--border)] shadow-3xl">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-2 transition-all duration-700 flex items-center justify-center ${isBotSpeaking ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_80px_rgba(99,102,241,0.3)]' : 'border-[var(--border)] bg-[var(--accent)]'}`}>
                <div className="relative">
                  {isBotSpeaking && (
                    <div className="absolute inset-[-20px] rounded-full border border-indigo-500/30 animate-ping"></div>
                  )}
                  <svg className={`w-20 h-20 md:w-28 md:h-28 transition-colors duration-500 ${isBotSpeaking ? 'text-indigo-400' : 'text-[var(--muted)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>

              <div className="mt-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${isBotSpeaking ? 'bg-indigo-500 shadow-[0_0_10px_var(--primary)] animate-pulse' : 'bg-slate-600'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 opacity-80">
                    {isBotSpeaking ? 'AI Speaking' : 'AI Listening'}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[var(--text)] tracking-tighter uppercase">Neural Recruiter v2.5</h3>
              </div>

              <div className="absolute -right-6 -bottom-6 md:-right-12 md:-bottom-12 w-40 h-40 md:w-60 md:h-60 z-30 group">
                <div className={`w-full h-full rounded-full border-4 transition-all duration-500 overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-black ${proctorWarning ? 'pulse-border-red border-red-500' : 'border-[var(--surface)] hover:border-indigo-500/50'}`}>
                  {session.proctoringEnabled ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror opacity-90 group-hover:opacity-100 transition-opacity" />
                      <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full object-cover mirror pointer-events-none" />
                      <div className="proctor-scan opacity-40 group-hover:opacity-100 transition-opacity"></div>

                      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                          <div className="w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                        </div>
                        <div className="flex justify-center mb-2">
                          <div className="bg-indigo-500/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Candidate</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                          <div className="w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                      <svg className="w-8 h-8 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <span className="text-[8px] font-black text-slate-600 uppercase">Track Disabled</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-2 bg-[var(--accent)] px-4 py-2 rounded-2xl border border-[var(--border)]">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_var(--primary)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Neural Audio Sync</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[400px] bg-[var(--accent)] border-l border-[var(--border)] backdrop-blur-3xl flex flex-col shrink-0 relative z-20">
          <div className="p-8 border-b border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">Analysis Feed</h4>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-[var(--muted)] rounded-full"></div>
                <div className="w-1 h-1 bg-[var(--muted)] rounded-full"></div>
                <div className="w-1 h-1 bg-[var(--muted)] rounded-full"></div>
              </div>
            </div>
            <p className="text-[10px] font-medium text-[var(--muted)] italic uppercase">Parsing semantic markers...</p>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {transcription.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-10">
                <div className="w-10 h-10 border-2 border-indigo-400 rounded-full animate-spin mb-6 border-t-transparent"></div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Establishing neural link...</p>
              </div>
            )}
            {transcription.map((line, i) => {
              const isUser = line.startsWith('Candidate');
              return (
                <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} fade-in`}>
                  <span className="text-[9px] font-black uppercase tracking-widest mb-2 text-[var(--muted)]">{isUser ? 'Candidate Response' : 'Interviewer Probe'}</span>
                  <div className={`max-w-[90%] px-5 py-4 rounded-[24px] text-xs leading-relaxed font-medium ${isUser ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-900/20' : 'bg-[var(--surface)] text-[var(--text)] rounded-tl-none border border-[var(--border)]'}`}>
                    {line.split(': ')[1]}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};
