import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../services/auth';
import { getAgents, calculatePowerScore } from '../services/data';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, ThumbsUp, CheckCircle } from 'lucide-react';
import '../styles/Dashboard.css';

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

    // Helper to determine color based on performance
    const getPerformanceColor = (value, target, isLowerBetter = false) => {
        const numValue = parseFloat(value);
        const numTarget = parseFloat(target);

        if (isLowerBetter) {
             // For AHT: Lower is better
             if (numValue <= numTarget) return 'var(--success)'; // High performance
             if (numValue <= numTarget * 1.1) return 'var(--warning)'; // Medium (within 10%)
             return 'var(--error)'; // Low performance
        } else {
            // For Scores: Higher is better
            if (numValue >= numTarget) return 'var(--success)';
            if (numValue >= numTarget * 0.9) return 'var(--warning)';
            return 'var(--error)';
        }
    };

    return (
        <div className="dashboard-container">
            {/* Hero Section */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Welcome, {user.name}</h1>
                    <p>Performance Dashboard</p>
                </div>
                <div className="header-actions">
                    <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
                        Logout
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="kpi-grid">
                <KpiCard
                    title="CSAT Score"
                    value={`${stats.csat}%`}
                    icon={<ThumbsUp size={24} />}
                    color={getPerformanceColor(stats.csat, 83)}
                    progress={stats.csat}
                />
                <KpiCard
                    title="First Call Resolution"
                    value={`${stats.fcr}%`}
                    icon={<CheckCircle size={24} />}
                    color={getPerformanceColor(stats.fcr, 73)}
                    progress={stats.fcr}
                />
                <KpiCard
                    title="Avg Handling Time"
                    value={`${stats.aht}s`}
                    icon={<Timer size={24} />}
                    color={getPerformanceColor(stats.aht, 300, true)}
                    progress={Math.min(100, (300 / stats.aht) * 100)} // Inverse progress
                />
            </div>

            <div className="main-content">
                {/* The Arena (Leaderboard) */}
                <div className="arena-container">
                    <div className="arena-header">
                        <Trophy size={24} color="var(--warning)" />
                        <h2>The Arena</h2>
                    </div>

                    <table className="arena-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Agent</th>
                                <th style={{ textAlign: 'right' }}>Power Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map((agent, index) => (
                                <tr key={agent.id} className={`arena-row ${agent.id === user.id ? 'current-user-row' : ''}`}>
                                    <td>
                                        {index < 3 ? <span style={{ fontSize: '1.2rem' }}>{['🥇', '🥈', '🥉'][index]}</span> : `#${index + 1}`}
                                    </td>
                                    <td className="agent-cell">
                                        <div className="avatar-circle">
                                            {agent.username[0]}
                                        </div>
                                        {agent.name}
                                    </td>
                                    <td className="score-cell">
                                        {agent.powerScore}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, icon, color, progress }) => (
    <div className="kpi-card">
        <div className="kpi-header">
            <div>
                <p className="kpi-title">{title}</p>
                <h3 className="kpi-value">{value}</h3>
            </div>
            <div className="kpi-icon" style={{ background: `${color}20`, color: color }}>
                {icon}
            </div>
        </div>
        <div className="kpi-footer">
            <span>Progress</span>
        </div>
        <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: color }}></div>
        </div>
    </div>
);

export default Dashboard;
