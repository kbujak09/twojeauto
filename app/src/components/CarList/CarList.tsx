import { useState, useEffect } from 'react';

import styles from './CarList.module.scss';

interface Car {
  _id: string,
  brand: string,
  model: string,
  year: number,
  price: number,
  mileage: number,
  fuelType: string,
  description: string,
}

export default function CarList() {
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
      } catch (error) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (isLoading) return <div className={styles.message}>Ładowanie ogłoszeń...</div>;
  if (error) return <div className={styles.message}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {cars.map((car) => (
          <div key={car._id} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              Brak zdjęcia
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
        ))}
      </div>
    </div>
  )
}