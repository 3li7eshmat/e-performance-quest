import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../services/auth';
import { getAgents, updateAgentStats } from '../services/data';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, ArrowLeft } from 'lucide-react';

const Admin = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        setAgents(getAgents());
    }, [navigate]);

    const handleChange = (id, field, value) => {
        setAgents(prev => prev.map(agent => {
            if (agent.id === id) {
                return {
                    ...agent,
                    stats: { ...agent.stats, [field]: Number(value) }
                };
            }
            return agent;
        }));
    };

    const handleSave = (id) => {
        const agent = agents.find(a => a.id === id);
        if (agent) {
            updateAgentStats(id, agent.stats);
            alert(`Stats updated for ${agent.name}`);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Command Center</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)' }}>
                        <ArrowLeft size={18} /> User View
                    </button>
                    <button onClick={() => { logout(); navigate('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-dark-lighter)', color: 'white', borderRadius: 'var(--radius-md)' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div style={{ background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1rem' }}>Agent</th>
                            <th style={{ padding: '1rem' }}>CSAT (%)</th>
                            <th style={{ padding: '1rem' }}>FCR (%)</th>
                            <th style={{ padding: '1rem' }}>AHT (sec)</th>
                            <th style={{ padding: '1rem' }}>Streak (Days)</th>
                            <th style={{ padding: '1rem' }}>XP</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{agent.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="number"
                                        value={agent.stats.csat}
                                        onChange={(e) => handleChange(agent.id, 'csat', e.target.value)}
                                        style={inputStyle}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="number"
                                        value={agent.stats.fcr}
                                        onChange={(e) => handleChange(agent.id, 'fcr', e.target.value)}
                                        style={inputStyle}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="number"
                                        value={agent.stats.aht}
                                        onChange={(e) => handleChange(agent.id, 'aht', e.target.value)}
                                        style={inputStyle}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="number"
                                        value={agent.stats.attendance}
                                        onChange={(e) => handleChange(agent.id, 'attendance', e.target.value)}
                                        style={inputStyle}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="number"
                                        value={agent.stats.xp}
                                        onChange={(e) => handleChange(agent.id, 'xp', e.target.value)}
                                        style={inputStyle}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => handleSave(agent.id)} style={{ padding: '0.5rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-sm)' }}>
                                        <Save size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const inputStyle = {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '4px',
    width: '80px'
};

export default Admin;
