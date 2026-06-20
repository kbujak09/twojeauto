import { useState, useEffect } from 'react';
import type { Filters } from '../Home';

import styles from './CarList.module.scss';

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  description: string;
}

interface Props {
  filters: Filters;
}

export default function CarList({ filters }: Props) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/cars');
        if (!res.ok) throw new Error('Błąd pobierania danych z serwera');

        const data = await res.json();
        setCars(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (isLoading) return <div className={styles.message}>Ładowanie ogłoszeń...</div>;
  if (error) return <div className={styles.message}>{error}</div>;

  const filteredCars = cars.filter((car) => {
    if (filters.brand && !car.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.priceMin && car.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && car.price > Number(filters.priceMax)) return false;
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Ogłoszenia ({filteredCars.length})</h2>

      <div className={styles.list}>
        {filteredCars.length === 0 ? (
          <div className={styles.message}>Brak ogłoszeń spełniających kryteria.</div>
        ) : (
          filteredCars.map((car) => (
            <div key={car._id} className={styles.card}>
              <div className={styles.imagePlaceholder}>
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  'Brak zdjęcia'
                )}
              </div>

              <div className={styles.content}>
                <div className={styles.mainInfo}>
                  <h3 className={styles.title}>{car.brand} {car.model}</h3>
                  <div className={styles.price}>
                    {car.price.toLocaleString('pl-PL')} PLN
                  </div>
                </div>

                <ul className={styles.details}>
                  <li>{car.year}</li>
                  <li>{car.mileage.toLocaleString('pl-PL')} km</li>
                  <li>{car.fuelType}</li>
                </ul>

                <p className={styles.description}>{car.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}