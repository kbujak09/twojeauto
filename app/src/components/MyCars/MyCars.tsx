import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';

import styles from './MyCars.module.scss';

interface Car {
  _id: string;
  brand: string;
  model: string;
  price: number;
  images?: string[];
}

export default function MyCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchMyCars();
  }, []);

  const fetchMyCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/cars/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Błąd pobierania danych');
      const data = await res.json();
      setCars(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Błąd podczas usuwania');

      setCars(cars.filter(car => car._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className={styles.message}>Ładowanie...</div>;
  if (error) return <div className={styles.message}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Twoje ogłoszenia ({cars.length})</h2>

      <div className={styles.list}>
        {cars.length === 0 ? (
          <div className={styles.message}>Nie masz jeszcze żadnych ogłoszeń.</div>
        ) : (
          cars.map((car) => (
            <div key={car._id} className={styles.card}>
              <div className={styles.imagePlaceholder}>
                {car.images && car.images.length > 0 ? (
                  <img src={car.images[0]} alt={`${car.brand} ${car.model}`} />
                ) : (
                  'Brak zdjęcia'
                )}
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{car.brand} {car.model}</h3>
                <div className={styles.price}>{car.price.toLocaleString('pl-PL')} PLN</div>

                <div className={styles.actions}>
                  <Link to="/car/$carId" params={{ carId: car._id }} className={styles.viewBtn}>Zobacz</Link>
                  <Link to="/edit/$carId" params={{ carId: car._id }} className={styles.editBtn}>Edytuj</Link>
                  <button onClick={() => handleDelete(car._id)} className={styles.deleteBtn}>Usuń</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}