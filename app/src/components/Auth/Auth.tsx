import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';

import Logo from '../Logo';

import styles from './Auth.module.scss';

export default function Auth() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setIsError(true);
      setMessage('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin ? { email, password } : { email, password, phone };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas autoryzacji');
      }

      setMessage(data.message);

      if (isLogin && data.token) {
        localStorage.setItem('token', data.token);
        setEmail('');
        setPassword('');
        setPhone('');

        navigate('/');
      } else if (!isLogin) {
        setIsLogin(true);
        setConfirmPassword('');
      }
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setIsError(false);
    setConfirmPassword('');
    setPhone('');
  }

  return (
    <div className={styles.container}>
      <Link to={'/'} className={styles.logoWrapper}>
        <Logo/>
      </Link>
      <h2 className={styles.title}>{isLogin ? 'Logowanie' : 'Rejestracja' }</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor='email'>Adres e-mail</label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {!isLogin && (
          <div className={styles.inputGroup}>
            <label htmlFor='phone'>Numer telefonu</label>
            <input
              id='phone'
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor='password'>Hasło</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={8}
          />
        </div>

        {!isLogin && (
          <div className={styles.inputGroup}>
            <label htmlFor='confirmPassword'>Powtórz hasło</label>
            <input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
        )}

        <button type='submit' className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj się' : 'Utwórz konto')}
        </button>
      </form>

      {message && (
        <div className={isError ? styles.error : styles.success}>
          {message}
        </div>
      )}

      <button
        type='button'
        onClick={toggleMode}
        className={styles.toggleBtn}
        disabled={isLoading}
      >
        {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
      </button>
    </div>
  );
}