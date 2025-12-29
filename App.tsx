
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InterviewSetup } from './components/InterviewSetup';
import { LiveInterview } from './components/LiveInterview';
import { FeedbackReport } from './components/FeedbackReport';
import { ProfilePage } from './components/ProfilePage';
import { AuthPage } from './components/AuthPage';
import { InterviewStatus, InterviewSession, User } from './types';
import { analyzeInterview } from './services/geminiService';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [session, setSession] = useState<Partial<InterviewSession>>({});
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const history = await authService.getInterviewHistory();
        setHistory(history);
      }
    };
    init();
  }, []);

  const startInterview = (config: Partial<InterviewSession>) => {
    if (!currentUser) {
      setStatus(InterviewStatus.AUTH);
      return;
    }
    setSession({
      ...config,
      id: 'sess_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setStatus(InterviewStatus.INTERVIEWING);
  };

  const endInterview = async (transcript: string[]) => {
    setLoading(true);
    setStatus(InterviewStatus.REVIEWING);
    try {
      const feedback = await analyzeInterview(transcript);
      const fullSession: InterviewSession = {
        ...(session as InterviewSession),
        transcription: transcript,
        feedback
      };
      await authService.saveInterviewSession(fullSession);
      setSession(fullSession);
      const history = await authService.getInterviewHistory();
      setHistory(history);
      setStatus(InterviewStatus.COMPLETED);
    } catch (error) {
      console.error("Feedback analysis failed:", error);
      setStatus(InterviewStatus.COMPLETED);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.signOut();
    setCurrentUser(null);
    setStatus(InterviewStatus.IDLE);
  };

  return (
    <Layout
      user={currentUser}
      onAuthClick={() => setStatus(InterviewStatus.AUTH)}
      onLogout={handleLogout}
      onProfileClick={() => setStatus(InterviewStatus.PROFILE)}
      onDashboardClick={() => setStatus(InterviewStatus.IDLE)}
      hideNav={status === InterviewStatus.INTERVIEWING}
    >
      {status === InterviewStatus.AUTH && (
        <AuthPage
          onSuccess={async (user) => {
            setCurrentUser(user);
            const history = await authService.getInterviewHistory();
            setHistory(history);
            setStatus(InterviewStatus.IDLE);
          }}
          onBack={() => setStatus(InterviewStatus.IDLE)}
        />
      )}

      {status === InterviewStatus.IDLE && (
        <>
          {!currentUser ? (
            <div className="space-y-32 py-10 animate-in fade-in duration-1000 px-4">
              {/* HERO SECTION */}
              <section className="text-center max-w-5xl mx-auto space-y-12">
                <div className="inline-block px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                  SkillSpeak Intelligent Neural Link
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-[var(--text)] leading-[0.95] tracking-tighter">
                  Master your path to <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500"> greatness.</span>
                </h1>
                <p className="text-xl md:text-2xl text-[var(--muted)] font-medium max-w-3xl mx-auto leading-relaxed">
                  The only AI platform that analyzes your presence, technical depth, and cognitive performance in real-time.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                  <button
                    onClick={() => setStatus(InterviewStatus.AUTH)}
                    className="btn-primary w-full sm:w-auto px-16 py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl"
                  >
                    Establish Link
                  </button>
                  <button className="w-full sm:w-auto px-16 py-6 rounded-3xl font-black text-xl hover:bg-[var(--accent)] transition-all border-2 border-[var(--border)] bg-transparent text-[var(--text)] uppercase tracking-widest">
                    Methodology
                  </button>
                </div>
              </section>

              {/* FEATURES GRID */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[
                  { title: 'Neural Proctoring', desc: 'Real-time eye-tracking and behavioral analysis ensures peak interview performance.', icon: '👁️' },
                  { title: 'Semantic scoring', desc: 'Advanced LLMs analyze the technical depth and structural clarity of your delivery.', icon: '🧠' },
                  { title: 'Performance metrics', desc: 'Deep analytics on every session. Watch your cognitive readiness evolve.', icon: '🚀' }
                ].map((feature, i) => (
                  <div key={i} className="glass-card p-10 rounded-[40px] hover:border-indigo-500/50 transition-all group cursor-default">
                    <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                    <h3 className="font-black text-2xl text-[var(--text)] mb-4 uppercase tracking-tight">{feature.title}</h3>
                    <p className="text-[var(--muted)] leading-relaxed text-lg">{feature.desc}</p>
                  </div>
                ))}
              </section>

              {/* HOW IT WORKS */}
              <section className="bg-[var(--accent)] rounded-[60px] p-12 md:p-24 border border-[var(--border)] relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="relative z-10 max-w-4xl">
                  <h2 className="text-4xl md:text-6xl font-black text-[var(--text)] mb-20 leading-tight tracking-tighter">Your Journey to <br /><span className="text-indigo-500">Mastery</span></h2>
                  <div className="space-y-16">
                    {[
                      { step: '01', title: 'Contextual Calibration', text: 'Define your role and company target. Our AI generates a custom assessment profile.' },
                      { step: '02', title: 'Multimodal Simulation', text: 'Engage in a live voice conversation with real-time video proctoring analysis.' },
                      { step: '03', title: 'Cognitive Report', text: 'Receive a detailed breakdown of your technical and behavioral performance.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-10 items-start">
                        <span className="text-5xl font-black text-indigo-500/20">{item.step}</span>
                        <div>
                          <h4 className="text-2xl font-black text-[var(--text)] mb-3 uppercase tracking-tight">{item.title}</h4>
                          <p className="text-[var(--muted)] text-lg leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
              <div className="lg:col-span-8">
                <InterviewSetup onStart={startInterview} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="glass-card rounded-[40px] p-8 h-full">
                  <h3 className="font-black text-2xl text-[var(--text)] mb-8 flex justify-between items-center tracking-tight">
                    <span>Recent History</span>
                    <span className="text-[10px] bg-[var(--accent)] border border-[var(--border)] text-[var(--muted)] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{history.length} Sessions</span>
                  </h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {history.length === 0 ? (
                      <div className="py-24 text-center opacity-20 italic font-medium uppercase tracking-[0.2em] text-[10px] text-[var(--text)]">Waiting for your first simulation...</div>
                    ) : (
                      history.map(sess => (
                        <div
                          key={sess.id}
                          className="flex items-center p-5 rounded-3xl border border-[var(--border)] bg-[var(--accent)] hover:border-indigo-500/30 cursor-pointer transition-all group"
                          onClick={() => { setSelectedSession(sess); setStatus(InterviewStatus.COMPLETED); }}
                        >
                          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mr-5 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">🎤</div>
                          <div className="flex-1">
                            <div className="font-black text-[var(--text)] tracking-tight leading-none mb-1">{sess.role}</div>
                            <div className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2">{sess.company} • {sess.date}</div>
                            <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase text-white ${sess.feedback!.overallScore > 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                              Analysis Score: {sess.feedback?.overallScore}%
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {status === InterviewStatus.PROFILE && currentUser && (
        <ProfilePage user={currentUser} onUpdate={(u) => { setCurrentUser(u); setStatus(InterviewStatus.IDLE); }} />
      )}

      {status === InterviewStatus.INTERVIEWING && (
        <LiveInterview session={session} onEnd={endInterview} />
      )}

      {status === InterviewStatus.REVIEWING && (
        <div className="flex flex-col items-center justify-center min-h-[600px] space-y-12 px-4 text-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-8 border-[var(--border)] rounded-full"></div>
            <div className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-[var(--text)] tracking-tighter mb-4">Neural Analytics in Progress</h2>
            <p className="text-[var(--muted)] text-xl font-medium max-w-md mx-auto">The engine is parsing your vocal semantics and behavioral markers.</p>
          </div>
        </div>
      )}

      {status === InterviewStatus.COMPLETED && (selectedSession?.feedback || session.feedback) && (
        <FeedbackReport
          feedback={selectedSession?.feedback || session.feedback!}
          transcription={selectedSession?.transcription || session.transcription}
          onRestart={() => { setSession({}); setSelectedSession(null); setStatus(InterviewStatus.IDLE); }}
        />
      )}
    </Layout>
  );
};

export default App;
