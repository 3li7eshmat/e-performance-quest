import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../services/auth';
import { getAgents, calculatePowerScore } from '../services/data';
import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, ThumbsUp, CheckCircle, Bell } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [agents, setAgents] = useState([]);
    const [activeTab, setActiveTab] = useState('powerScore');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);

        // Load Agents
        const allAgents = getAgents();
        const agentsWithScore = allAgents.map(a => ({
            ...a,
            powerScore: calculatePowerScore(a.stats)
        }));
        setAgents(agentsWithScore);
    }, [navigate]);

    if (!user) return null;

    // Get current user stats
    const myData = agents.find(a => a.id === user.id) || user;
    const stats = myData.stats;

    // Helper to determine color based on performance
    const getPerformanceColor = (value, target, isLowerBetter = false) => {
        const numValue = parseFloat(value);
        const numTarget = parseFloat(target);

        if (isLowerBetter) {
            if (numValue <= numTarget) return 'var(--success)';
            if (numValue <= numTarget * 1.1) return 'var(--warning)';
            return 'var(--error)';
        } else {
            if (numValue >= numTarget) return 'var(--success)';
            if (numValue >= numTarget * 0.9) return 'var(--warning)';
            return 'var(--error)';
        }
    };

    // Sorting Logic
    const getSortedAgents = () => {
        return [...agents].sort((a, b) => {
            if (activeTab === 'aht') {
                return a.stats.aht - b.stats.aht; // Ascending for AHT
            } else if (activeTab === 'csat') {
                return b.stats.csat - a.stats.csat;
            } else if (activeTab === 'fcr') {
                return b.stats.fcr - a.stats.fcr;
            } else {
                return b.powerScore - a.powerScore;
            }
        });
    };

    const sortedAgents = getSortedAgents();

    // Column Header & Value Accessor
    const getMetricDetails = () => {
        switch (activeTab) {
            case 'csat': return { label: 'CSAT %', getValue: (agent) => `${agent.stats.csat}%` };
            case 'fcr': return { label: 'FCR %', getValue: (agent) => `${agent.stats.fcr}%` };
            case 'aht': return { label: 'AHT (s)', getValue: (agent) => `${agent.stats.aht}s` };
            default: return { label: 'Power Score', getValue: (agent) => agent.powerScore };
        }
    };

    const metricDetails = getMetricDetails();

    return (
        <div className="dashboard-container">
            {/* Team Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Team Money Hackers</h1>
                    <p>Performance Dashboard</p>
                </div>
                <div className="header-actions">
                    <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Welcome Alert */}
            <div className="welcome-alert">
                <Bell size={20} />
                <span>Welcome back, <strong>{user.name}</strong>! Ready to crush your goals today?</span>
            </div>

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
                        <div className="arena-title">
                            <Trophy size={24} color="var(--warning)" />
                            <h2>The Arena</h2>
                        </div>
                        <div className="leaderboard-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'powerScore' ? 'active' : ''}`}
                                onClick={() => setActiveTab('powerScore')}
                            >
                                Overall
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'csat' ? 'active' : ''}`}
                                onClick={() => setActiveTab('csat')}
                            >
                                CSAT
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'fcr' ? 'active' : ''}`}
                                onClick={() => setActiveTab('fcr')}
                            >
                                FCR
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'aht' ? 'active' : ''}`}
                                onClick={() => setActiveTab('aht')}
                            >
                                AHT
                            </button>
                        </div>
                    </div>

                    <table className="arena-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Agent</th>
                                <th style={{ textAlign: 'right' }}>{metricDetails.label}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAgents.map((agent, index) => (
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
                                        {metricDetails.getValue(agent)}
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
