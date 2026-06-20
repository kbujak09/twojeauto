import { Link, useNavigate } from '@tanstack/react-router';
import Logo from '../Logo';

import styles from './Header.module.scss';

export default function Header() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate({ to: '/login' });
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to='/' className={styles.logoWrapper}>
          <Logo />
        </Link>
        <nav className={styles.nav}>
          <Link to='add' className={styles.addBtn}>Dodaj ogłoszenie</Link>

          <Link to='/' className={styles.link}>Ogłoszenia</Link>

          {isAuthenticated ? (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Wyloguj
            </button>
          ) : (
            <Link to='/login' className={styles.link}>Logowanie</Link>
          )}
        </nav>
      </div>
    </header>
  )
}