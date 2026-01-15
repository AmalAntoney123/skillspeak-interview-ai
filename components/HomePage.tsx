
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Wand2,
    LineChart,
    Trophy,
    Eye,
    Shield,
    Sparkles,
    ChevronRight,
    Plus,
    Play,
    Quote,
    Target,
    Zap,
    Lock
} from 'lucide-react';
import heroImg from '../assets/hero.png';
import proctoringImg from '../assets/proctoring.png';

interface HomePageProps {
    onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const testimonials = [
        { name: "Sarah Chen", role: "Software Engineer @ Google", text: "SkillSpeak's real-time feedback helped me identify verbal fillers I never knew I used. The semantic analysis is scary accurate.", avatar: "SC" },
        { name: "Marcus Thorne", role: "Product Manager @ Meta", text: "The proctoring system is elite. It actually helped me fix my eye contact during remote panels. Landed my Senior PM role in 2 weeks!", avatar: "MT" },
        { name: "Elena Rodriguez", role: "Full Stack Developer", text: "I was skeptical about AI coaching, but the deep reports provided more value than any human mentor I've had. Truly peak technology.", avatar: "ER" }
    ];

    const faqs = [
        { q: "How does the Neural Proctoring work?", a: "Our system uses advanced computer vision to track gaze direction, head position, and micro-expressions in real-time. This data is handled locally on your device to ensure maximum privacy while providing objective behavioral feedback." },
        { q: "Is my data used to train the AI?", a: "Absolutely not. We prioritize your data sovereignty. Transcripts and recordings are used solely for your personal feedback generation and are encrypted. We do not sell or use your interview content for model training." },
        { q: "Which roles can the system simulate?", a: "Our Gemini-powered engine is role-agnostic. Whether you're a Software Engineer, Sales Executive, or Creative Director, the AI adapts its semantic logic to match the seniority and technical depth of your targeted position." },
        { q: "Can I use it on mobile?", a: "Yes, our neural link is optimized for all modern browsers. However, for the best proctoring experience, we recommend using a desktop device with a high-quality camera." }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="space-y-40 py-10">
            {/* HERO SECTION */}
            <section className="text-center max-w-6xl mx-auto px-4 space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Neural Mesh v4.0 Active
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-[var(--text)] leading-[0.85] tracking-tighter">
                        Master the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">Interview.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--muted)] font-medium max-w-3xl mx-auto leading-relaxed">
                        The world's first multimodal AI platform that analyzes your presence, technical depth, and cognitive performance in real-time.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={onStart}
                        className="btn-primary w-full sm:w-auto px-16 py-7 rounded-[32px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Play className="w-6 h-6 fill-white" />
                        Initiate Link
                    </button>
                    <button className="w-full sm:w-auto px-16 py-7 rounded-[32px] font-black text-xl hover:bg-[var(--accent)] transition-all border-2 border-[var(--border)] bg-transparent text-[var(--text)] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                        Watch Demo
                    </button>
                </motion.div>
            </section>

            {/* NEURAL PROCEDURE (HOW IT WORKS) */}
            <section className="max-w-7xl mx-auto px-4 py-10 relative">
                <div className="text-center mb-24">
                    <motion.h4
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-4"
                    >
                        The Process
                    </motion.h4>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-[var(--text)] tracking-tighter uppercase italic"
                    >
                        Neural Workflow.
                    </motion.h2>
                </div>

                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-[45px] z-0 hidden md:block">
                    <div className="w-full h-full border-t border-dashed border-indigo-500/30"></div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-y-16 md:gap-4 relative z-10"
                >
                    {[
                        { title: "Sync Resume", desc: "Upload and set target role", icon: <FileText className="w-8 h-8" /> },
                        { title: "Neural Adapt", desc: "AI builds custom interrogation", icon: <Wand2 className="w-8 h-8" /> },
                        { title: "Live Practice", desc: "Real-time voice & eye track", icon: <LineChart className="w-8 h-8" /> },
                        { title: "Peak Result", desc: "Maximize your offer chances", icon: <Trophy className="w-8 h-8" /> }
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="flex flex-col items-center text-center space-y-8 group"
                        >
                            <div className="w-20 h-20 rounded-full bg-[var(--surface)] border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all duration-500 relative">
                                {step.icon}
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent)] rounded-full border border-[var(--border)] flex items-center justify-center text-[10px] font-black text-indigo-500">0{i + 1}</div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-black text-sm uppercase tracking-[0.2em] text-[var(--text)] group-hover:text-indigo-400 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-60 leading-relaxed px-4">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* TRUST LOGOS */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="max-w-7xl mx-auto px-4 py-20 border-y border-[var(--border)] overflow-hidden"
            >
                <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-[var(--muted)] mb-12 opacity-50">Candidates Hired At</p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <span className="text-2xl font-black italic tracking-tighter uppercase">Google</span>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">Meta</span>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">Amazon</span>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">SpaceX</span>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">OpenAI</span>
                </div>
            </motion.section>

            {/* FEATURE 1: NEURAL SYNC */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-[var(--text)] leading-none tracking-tighter uppercase italic">Neural CV <br /><span className="text-indigo-500">Context.</span></h2>
                    <p className="text-xl text-[var(--muted)] leading-relaxed">
                        Our AI parses your professional history with semantic precision. It doesn't just read keywords; it understands your technical trajectory and builds a customized interrogation profile based on your real-world experience.
                    </p>
                    <ul className="space-y-4">
                        {['Deep semantic parsing', 'Tailored interrogation logic', 'Context-aware scoring'].map((item, i) => (
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-[var(--text)]"
                            >
                                <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400">
                                    <Sparkles className="w-3 h-3" />
                                </span>
                                {item}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
                <div className="glass-card aspect-video rounded-[60px] p-8 border border-[var(--border)] shadow-3xl flex items-center justify-center relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent transition-opacity opacity-0 group-hover:opacity-100"></div>
                    <div className="text-center space-y-6">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-32 h-32 bg-[var(--accent)] border border-[var(--border)] rounded-[40px] mx-auto flex items-center justify-center text-indigo-500 shadow-2xl"
                        >
                            <FileText className="w-16 h-16" />
                        </motion.div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Processing Entity History...</p>
                    </div>
                </div>
            </section>

            {/* FEATURE 2: PROCTORING */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="order-2 lg:order-1 relative px-4"
                >
                    <div className="absolute inset-0 bg-pink-500/20 blur-[100px] rounded-full opacity-50"></div>
                    <img
                        src={proctoringImg}
                        alt="AI Proctoring"
                        className="relative z-10 w-full rounded-[60px] shadow-3xl border border-white/5"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 order-1 lg:order-2"
                >
                    <div className="w-16 h-16 bg-pink-500/20 rounded-3xl flex items-center justify-center text-pink-500">
                        <Eye className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-[var(--text)] leading-none tracking-tighter uppercase italic">Behavioral <br /><span className="text-pink-500">Analysis.</span></h2>
                    <p className="text-xl text-[var(--muted)] leading-relaxed">
                        Nail the presentation. Local AI tracks eye contact, head posture, and composure markers. Every pause, every shift, every visual metric is analyzed to ensure you project peak confidence.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-[var(--accent)] p-6 rounded-[32px] border border-[var(--border)]"
                        >
                            <span className="text-3xl font-black text-indigo-500">92%</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mt-2">Correlation to Hired Candidates</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-[var(--accent)] p-6 rounded-[32px] border border-[var(--border)]"
                        >
                            <span className="text-3xl font-black text-pink-500">0ms</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mt-2">Local Latency Processing</p>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* STATS SECTION */}
            <section className="mx-4 relative">
                <motion.div
                    initial={{ opacity: 0, borderRadius: "100px" }}
                    whileInView={{ opacity: 1, borderRadius: "80px" }}
                    transition={{ duration: 1 }}
                    className="bg-indigo-600 py-24 px-8 text-center text-white overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),transparent_70%)]"></div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10"><Zap className="w-20 h-20" /></div>
                        <div className="absolute bottom-10 right-10"><Zap className="w-20 h-20" /></div>
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-20">
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Quantifying Your Evolution.</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { val: "15m", label: "Avg. Daily Prep" },
                                { val: "84%", label: "Confidence Boost" },
                                { val: "2.5x", label: "More Offers" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    <div className="text-7xl font-black mb-4">{stat.val}</div>
                                    <p className="text-sm font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-4 space-y-20">
                <div className="text-center space-y-4">
                    <motion.h4
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400"
                    >
                        Neural Testimonials
                    </motion.h4>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-[var(--text)] tracking-tighter uppercase italic"
                    >
                        Success Stories.
                    </motion.h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 rounded-[48px] border border-[var(--border)] space-y-8 flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="relative">
                                <Quote className="absolute -top-4 -left-4 w-10 h-10 text-indigo-500/20" />
                                <p className="text-lg font-medium italic text-[var(--muted)] leading-relaxed group-hover:text-[var(--text)] transition-colors relative z-10">"{t.text}"</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg uppercase">{t.avatar}</div>
                                <div>
                                    <h5 className="font-black text-[var(--text)] uppercase tracking-tight">{t.name}</h5>
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="max-w-4xl mx-auto px-4 space-y-20">
                <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black text-[var(--text)] tracking-tighter uppercase italic">Neural Protocols.</h2>
                    <p className="text-[var(--muted)] font-medium">Frequently asked questions about the SkillSpeak engine.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-[var(--accent)] border border-[var(--border)] rounded-3xl overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left group"
                            >
                                <span className={`text-lg font-black uppercase tracking-tight transition-colors ${activeFaq === i ? 'text-indigo-400' : 'text-[var(--text)] group-hover:text-indigo-300'}`}>{faq.q}</span>
                                <Plus className={`w-6 h-6 transition-transform duration-300 ${activeFaq === i ? 'rotate-45 text-indigo-400' : 'text-[var(--muted)]'}`} />
                            </button>
                            {activeFaq === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="px-8 pb-8 text-[var(--muted)] text-lg leading-relaxed"
                                >
                                    {faq.a}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="max-w-6xl mx-auto px-4 py-32 text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <h2 className="text-6xl md:text-8xl font-black text-[var(--text)] leading-none tracking-tighter">Ready to <br /><span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600">Upgrade?</span></h2>
                    <p className="text-[var(--muted)] text-xl font-medium">Join 5,000+ developers accelerating their careers with SkillSpeak.</p>
                </motion.div>
                <div className="flex flex-col items-center gap-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="btn-primary px-20 py-8 rounded-[40px] font-black text-2xl uppercase tracking-[0.3em] shadow-3xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-4"
                    >
                        <Zap className="w-8 h-8 fill-white" />
                        Begin Simulation
                    </motion.button>
                </div>
                <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--muted)] opacity-30">
                    <span className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> © 2026 SKILLSPEAK AI</span>
                    <span>Privacy Link</span>
                    <span className="flex items-center justify-center gap-2"><Shield className="w-3 h-3" /> Neural TOS</span>
                    <span>Security Mesh</span>
                </div>
            </section>
        </div>
    );
};
