'use client';
import { useRouter } from 'next/navigation.js';
import { useState } from 'react';
import styles from './login.module.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const {login} = useAuth()
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegisterRedirect = (e) => {
        e.preventDefault();
        router.push('/cadastro');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/login', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            const data = await response.clone().json();
            
            if (response.status !== 200) {  
                throw new Error(data.error);
            }
            
            const teste = login(data.user, data.school)
            router.push('/');
        } catch (erro) {
            setError(erro.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Login</h2>
                
                {error && <p className={styles.error}>{error}</p>}
                
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.rememberContainer}>
                        <label className={styles.rememberCheckbox}>
                            <input type="checkbox" className={styles.checkbox} />
                            Remember me
                        </label>
                        <a href="#" className={styles.forgotPassword}>Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>

                    <div className={styles.registerText}>
                        <p>
                            Don't have an account?{' '}
                            <Link 
                                onClick={handleRegisterRedirect}
                                className={styles.registerLink}
                                href='#'
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}