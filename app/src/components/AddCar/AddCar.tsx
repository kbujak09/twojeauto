import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import styles from './AddCar.module.scss';

export default function AddCar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'Benzyna',
    description: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'number' && e.target.name !== 'year') {
      if (Number(e.target.value) < 0) return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Brak autoryzacji. Zaloguj się ponownie.');

      const submitData = new FormData();
      submitData.append('brand', formData.brand);
      submitData.append('model', formData.model);
      submitData.append('year', String(formData.year));
      submitData.append('price', String(formData.price));
      submitData.append('mileage', String(formData.mileage));
      submitData.append('fuelType', formData.fuelType);
      submitData.append('description', formData.description);

      if (image) {
        submitData.append('image', image);
      }

      const res = await fetch('http://localhost:3000/api/cars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Błąd podczas dodawania ogłoszenia.');

      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dodaj nowe ogłoszenie</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label htmlFor='brand'>Marka</label>
            <input
              id='brand'
              name='brand'
              value={formData.brand}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='model'>Model</label>
            <input
              id='model'
              name='model'
              value={formData.model}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='year'>Rocznik</label>
            <input
              type='number'
              id='year'
              name='year'
              value={formData.year}
              onChange={handleChange}
              required
              min='1900'
              max={new Date().getFullYear()}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='price'>Cena (PLN)</label>
            <input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
              className={styles.noSpinners}
              required
              min='0'
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='mileage'>Przebieg (km)</label>
            <input
              type='number'
              id='mileage'
              name='mileage'
              value={formData.mileage}
              onChange={handleChange}
              onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
              className={styles.noSpinners}
              required
              min='0'
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='fuelType'>Paliwo</label>
            <select
              name='fuelType'
              id='fuelType'
              value={formData.fuelType}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value='Benzyna'>Benzyna</option>
              <option value='Diesel'>Diesel</option>
              <option value='Hybryda'>Hybryda</option>
              <option value='Elektryczny'>Elektryczny</option>
            </select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='description'>Opis</label>
          <textarea
            name='description'
            id='description'
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='image'>Zdjęcie pojazdu</label>
          <input
            type='file'
            id='image'
            name='image'
            accept='image/png, image/jpeg, image/webp'
            onChange={handleImageChange}
            disabled={isLoading}
            className={styles.fileInput}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type='submit'
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Zapisywanie...' : 'Dodaj ogłoszenie'}
        </button>
      </form>
    </div>
  )
}