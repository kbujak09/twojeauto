import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';

import styles from './CarDetails.module.scss';

interface Owner {
  _id: string;
  username?: string;
  email: string;
  phone?: string;
}

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  engineCapacity: number;
  power: number;
  bodyType: string;
  color: string;
  vin: string;
  description: string;
  images?: string[];
  createdAt: string;
  owner_id: Owner;
}

export default function CarDetails() {
  const { carId } = useParams({ strict: false });
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/cars/${carId}`);
        if (!res.ok) throw new Error('Błąd podczas pobierania ogłoszenia');
        const data = await res.json();
        setCar(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (carId) fetchCar();
  }, [carId]);

  if (isLoading) return <div className={styles.message}>Ładowanie ogłoszenia...</div>;
  if (error || !car) return <div className={styles.message}>{error || 'Nie znaleziono ogłoszenia'}</div>;

  const nextImage = () => {
    if (car.images && car.images.length > 0) {
      setCurrentImage((prev) => (prev === car.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (car.images && car.images.length > 0) {
      setCurrentImage((prev) => (prev === 0 ? car.images!.length - 1 : prev - 1));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.gallery}>
          <div className={styles.mainImageContainer}>
            {car.images && car.images.length > 0 ? (
              <>
                <img src={car.images[currentImage]} alt={`${car.brand} ${car.model}`} className={styles.mainImage} />
                {car.images.length > 1 && (
                  <>
                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>&#10094;</button>
                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>&#10095;</button>
                  </>
                )}
              </>
            ) : (
              <div className={styles.noImage}>Brak zdjęcia</div>
            )}
          </div>

          {car.images && car.images.length > 1 && (
            <div className={styles.thumbnails}>
              {car.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className={`${styles.thumbnail} ${index === currentImage ? styles.activeThumbnail : ''}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.headerBox}>
            <h1 className={styles.title}>{car.brand} {car.model}</h1>
            <div className={styles.price}>{car.price.toLocaleString('pl-PL')} PLN</div>
          </div>

          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Rocznik</span>
              <span className={styles.specValue}>{car.year}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Przebieg</span>
              <span className={styles.specValue}>{car.mileage.toLocaleString('pl-PL')} km</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Pojemność silnika</span>
              <span className={styles.specValue}>{car.engineCapacity} cm3</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Moc</span>
              <span className={styles.specValue}>{car.power} KM</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Paliwo</span>
              <span className={styles.specValue}>{car.fuelType}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Skrzynia biegów</span>
              <span className={styles.specValue}>{car.transmission}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Typ nadwozia</span>
              <span className={styles.specValue}>{car.bodyType}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Kolor</span>
              <span className={styles.specValue}>{car.color}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>VIN</span>
              <span className={styles.specValue}>{car.vin}</span>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <h3>Opis pojazdu</h3>
            <p className={styles.description}>{car.description}</p>
          </div>

          <div className={styles.contactBox}>
            <h3>Dane kontaktowe</h3>
            <div className={styles.contactDetails}>
              {car.owner_id?.username && (
                <div className={styles.contactRow}>
                  <span className={styles.icon}>👤</span>
                  <span>{car.owner_id.username}</span>
                </div>
              )}
              {car.owner_id?.email && (
                <div className={styles.contactRow}>
                  <span className={styles.icon}>✉️</span>
                  <a href={`mailto:${car.owner_id.email}`}>{car.owner_id.email}</a>
                </div>
              )}
              {car.owner_id?.phone && (
                <div className={styles.contactRow}>
                  <span className={styles.icon}>📞</span>
                  <a href={`tel:${car.owner_id.phone}`}>{car.owner_id.phone}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}