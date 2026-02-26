    import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

const HomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { 
        logout();
        navigate('/login');
    };

    return (
        <div>
            <header style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={24} />
                    Stay<span style={{ color: 'var(--primary)' }}>Mate</span>.
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        Welcome, <strong style={{ color: 'white' }}>{user?.fullName}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-card)';
                            e.target.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.borderColor = 'var(--border)';
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '3rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👋 Welcome to StayMate!</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Logged in as <strong style={{ color: 'var(--primary)' }}>{user?.email}</strong>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
