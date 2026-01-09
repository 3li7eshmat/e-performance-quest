import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../services/auth';
import { getAgents, calculatePowerScore } from '../services/data';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, Star, ThumbsUp, CheckCircle, Flame, Target } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [agents, setAgents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);

        // Load Leaderboard Data
        const allAgents = getAgents();
        const agentsWithScore = allAgents.map(a => ({
            ...a,
            powerScore: calculatePowerScore(a.stats)
        })).sort((a, b) => b.powerScore - a.powerScore);

        setAgents(agentsWithScore);
    }, [navigate]);

    if (!user) return null;

    // Get current user stats from the fresh data
    const myData = agents.find(a => a.id === user.id) || user;
    const stats = myData.stats;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            {/* Hero Section */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)'
            }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome, {user.name}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Level {stats.level} Agent • {stats.xp} Total XP</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {stats.attendance > 3 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', color: '#fca5a5' }}>
                            <Flame size={20} />
                            <span>{stats.attendance} Day Streak!</span>
                        </div>
                    )}
                    <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: '0.5rem 1rem', background: 'var(--bg-dark-lighter)', color: 'white', borderRadius: 'var(--radius-md)' }}>
                        Logout
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <KpiCard
                    title="CSAT Score"
                    value={`${stats.csat}%`}
                    target="83%"
                    icon={<ThumbsUp size={24} />}
                    color="var(--secondary)"
                    progress={stats.csat}
                />
                <KpiCard
                    title="First Call Resolution"
                    value={`${stats.fcr}%`}
                    target="73%"
                    icon={<CheckCircle size={24} />}
                    color="var(--success)"
                    progress={stats.fcr}
                />
                <KpiCard
                    title="Avg Handling Time"
                    value={`${stats.aht}s`}
                    target="< 300s"
                    icon={<Timer size={24} />}
                    color="var(--warning)"
                    progress={Math.min(100, (300 / stats.aht) * 100)} // Inverse progress
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* The Arena (Leaderboard) */}
                <div style={{
                    background: 'var(--glass-bg)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Trophy size={24} color="var(--warning)" />
                        <h2 style={{ fontSize: '1.5rem' }}>The Arena</h2>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem' }}>Rank</th>
                                <th style={{ padding: '1rem' }}>Agent</th>
                                <th style={{ padding: '1rem' }}>Level</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Power Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map((agent, index) => (
                                <tr key={agent.id} style={{
                                    background: agent.id === user.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <td style={{ padding: '1rem' }}>
                                        {index < 3 ? <span style={{ fontSize: '1.2rem' }}>{['🥇', '🥈', '🥉'][index]}</span> : `#${index + 1}`}
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-dark-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {agent.username[0]}
                                        </div>
                                        {agent.name}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{agent.stats.level}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {agent.powerScore}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Daily Quests */}
                <div style={{
                    background: 'var(--glass-bg)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--glass-border)',
                    height: 'fit-content'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Target size={24} color="var(--accent)" />
                        <h2 style={{ fontSize: '1.5rem' }}>Daily Quests</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <QuestItem title="Perfect CSAT Streak" desc="Get 5 CSATs of 100% in a row" reward="100 XP" />
                        <QuestItem title="Speed Demon" desc="Maintain AHT < 250s for 1 hour" reward="50 XP" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, target, icon, color, progress }) => (
    <div style={{
        background: 'var(--glass-bg)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</h3>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: `${color}20`, color: color }}>
                {icon}
            </div>
        </div>
        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Progress</span>
            <span>Target: {target}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-dark)', borderRadius: '3px' }}>
            <div style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 1s ease' }}></div>
        </div>
    </div>
);

const QuestItem = ({ title, desc, reward }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <h4 style={{ fontWeight: '600' }}>{title}</h4>
            <span style={{ color: 'var(--warning)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="var(--warning)" /> {reward}
            </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
);

export default Dashboard;
