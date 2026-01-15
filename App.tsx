
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InterviewSetup } from './components/InterviewSetup';
import { LiveInterview } from './components/LiveInterview';
import { FeedbackReport } from './components/FeedbackReport';
import { ProfilePage } from './components/ProfilePage';
import { AuthPage } from './components/AuthPage';
import { HomePage } from './components/HomePage';
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
            <HomePage onStart={() => setStatus(InterviewStatus.AUTH)} />
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
