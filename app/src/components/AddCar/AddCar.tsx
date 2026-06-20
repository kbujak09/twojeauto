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
    transmission: 'Manualna',
    engineCapacity: '',
    power: '',
    bodyType: 'Sedan',
    color: '',
    vin: '',
    description: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'number' && e.target.name !== 'year') {
      if (Number(e.target.value) < 0) return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      setImages((prevImages) => {
        const combinedFiles = [...prevImages, ...newFiles];

        if (combinedFiles.length > 10) {
          setError('Możesz dodać maksymalnie 10 zdjęć.');
          return combinedFiles.slice(0, 10);
        } else {
          setError('');
          return combinedFiles;
        }
      });
    }
  };

  const clearImages = () => {
    setImages([]);
    setError('');
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));

    if (images.length === 1) {
      setError('');
      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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
      submitData.append('transmission', formData.transmission);
      submitData.append('engineCapacity', String(formData.engineCapacity));
      submitData.append('power', String(formData.power));
      submitData.append('bodyType', formData.bodyType);
      submitData.append('color', formData.color);
      submitData.append('vin', formData.vin);
      submitData.append('description', formData.description);

      images.forEach((image) => {
        submitData.append('images', image);
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cars`, {
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
            <input id='brand' name='brand' value={formData.brand} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='model'>Model</label>
            <input id='model' name='model' value={formData.model} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='year'>Rocznik</label>
            <input type='number' id='year' name='year' value={formData.year} onChange={handleChange} required min='1900' max={new Date().getFullYear()} disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='price'>Cena (PLN)</label>
            <input type='number' id='price' name='price' value={formData.price} onChange={handleChange} onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()} className={styles.noSpinners} required min='0' disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='mileage'>Przebieg (km)</label>
            <input type='number' id='mileage' name='mileage' value={formData.mileage} onChange={handleChange} onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()} className={styles.noSpinners} required min='0' disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='engineCapacity'>Pojemność silnika (cm3)</label>
            <input type='number' id='engineCapacity' name='engineCapacity' value={formData.engineCapacity} onChange={handleChange} className={styles.noSpinners} required min='0' disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='power'>Moc (KM)</label>
            <input type='number' id='power' name='power' value={formData.power} onChange={handleChange} className={styles.noSpinners} required min='0' disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='fuelType'>Paliwo</label>
            <select name='fuelType' id='fuelType' value={formData.fuelType} onChange={handleChange} disabled={isLoading}>
              <option value='Benzyna'>Benzyna</option>
              <option value='Diesel'>Diesel</option>
              <option value='LPG'>LPG</option>
              <option value='Hybryda'>Hybryda</option>
              <option value='Elektryczny'>Elektryczny</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='transmission'>Skrzynia biegów</label>
            <select name='transmission' id='transmission' value={formData.transmission} onChange={handleChange} disabled={isLoading}>
              <option value='Manualna'>Manualna</option>
              <option value='Automatyczna'>Automatyczna</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='bodyType'>Typ nadwozia</label>
            <select name='bodyType' id='bodyType' value={formData.bodyType} onChange={handleChange} disabled={isLoading}>
              <option value='Sedan'>Sedan</option>
              <option value='Kombi'>Kombi</option>
              <option value='Hatchback'>Hatchback</option>
              <option value='SUV'>SUV</option>
              <option value='Coupe'>Coupe</option>
              <option value='Kabriolet'>Kabriolet</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='color'>Kolor</label>
            <input id='color' name='color' value={formData.color} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='vin'>VIN</label>
            <input id='vin' name='vin' value={formData.vin} onChange={handleChange} required disabled={isLoading} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='description'>Opis</label>
          <textarea name='description' id='description' value={formData.description} onChange={handleChange} required rows={5} disabled={isLoading} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='images'>Zdjęcia pojazdu (max 10)</label>
          <input
            type='file'
            id='images'
            name='images'
            accept='image/png, image/jpeg, image/webp'
            multiple
            onChange={handleImageChange}
            disabled={isLoading}
            className={styles.fileInput}
          />

          {images.length > 0 && (
            <div className={styles.fileList}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <p style={{ margin: 0 }}>Dodano plików: {images.length} / 10</p>
                <button type="button" onClick={clearImages} className={styles.clearBtn}>
                  Wyczyść listę
                </button>
              </div>
              <ul className={styles.imageList}>
                {images.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className={styles.removeBtn}
                      title="Usuń to zdjęcie"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type='submit' className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Zapisywanie...' : 'Dodaj ogłoszenie'}
        </button>
      </form>
    </div>
  )
}