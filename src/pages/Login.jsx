import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { User, Gamepad2 } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const result = login(username);
        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
        }}>
            <div style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                border: '1px solid var(--glass-border)',
                padding: '3rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--glass-shadow)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{
                    marginBottom: '2rem',
                    display: 'inline-flex',
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '50%'
                }}>
                    <Gamepad2 size={48} color="var(--primary)" />
                </div>

                <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>e& Quest</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Enter the Arena</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Agent Username (e.g. Ali.Heshmat)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'var(--transition-fast)'
                        }}
                    >
                        Start Mission
                    </button>
                </form>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Tip: Supervisors can access the Command Center directly.
                </div>
            </div>
        </div>
    );
};

export default Login;
