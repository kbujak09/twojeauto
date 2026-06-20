import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import styles from '../AddCar/AddCar.module.scss';

export default function EditCar() {
  const { carId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '', model: '', year: 2020, price: '', mileage: '',
    fuelType: 'Benzyna', transmission: 'Manualna', engineCapacity: '',
    power: '', bodyType: 'Sedan', color: '', vin: '', description: ''
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cars/${carId}`);
        if (!res.ok) throw new Error('Nie udało się pobrać ogłoszenia');
        const data = await res.json();
        setFormData({
          brand: data.brand, model: data.model, year: data.year,
          price: data.price, mileage: data.mileage, fuelType: data.fuelType,
          transmission: data.transmission, engineCapacity: data.engineCapacity || '',
          power: data.power || '', bodyType: data.bodyType, color: data.color,
          vin: data.vin, description: data.description
        });
        setExistingImages(data.images || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (carId) fetchCar();
  }, [carId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalImages = existingImages.length + newImages.length + selectedFiles.length;

      if (totalImages > 10) {
        alert('Możesz dodać maksymalnie 10 zdjęć w sumie.');
        return;
      }
      setNewImages(prev => [...prev, ...selectedFiles]);
    }
    e.target.value = '';
  };

  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewImage = (indexToRemove: number) => {
    setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });

      existingImages.forEach((img) => submitData.append('existingImages', img));
      newImages.forEach((file) => submitData.append('images', file));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });

      if (!res.ok) throw new Error('Błąd podczas aktualizacji ogłoszenia.');
      navigate({ to: '/my-cars' });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  if (isLoading) return <div className={styles.container}>Ładowanie danych...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edytuj ogłoszenie</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.inputGroup}><label>Marka</label><input name='brand' value={formData.brand} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>Model</label><input name='model' value={formData.model} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>Rocznik</label><input type='number' name='year' value={formData.year} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>Cena (PLN)</label><input type='number' name='price' value={formData.price} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>Przebieg (km)</label><input type='number' name='mileage' value={formData.mileage} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>Pojemność silnika</label><input type='number' name='engineCapacity' value={formData.engineCapacity} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>Moc (KM)</label><input type='number' name='power' value={formData.power} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}>
            <label>Paliwo</label>
            <select name='fuelType' value={formData.fuelType} onChange={handleChange}>
              <option value='Benzyna'>Benzyna</option><option value='Diesel'>Diesel</option><option value='LPG'>LPG</option><option value='Hybryda'>Hybryda</option><option value='Elektryczny'>Elektryczny</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Skrzynia biegów</label>
            <select name='transmission' value={formData.transmission} onChange={handleChange}>
              <option value='Manualna'>Manualna</option><option value='Automatyczna'>Automatyczna</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Nadwozie</label>
            <select name='bodyType' value={formData.bodyType} onChange={handleChange}>
              <option value='Sedan'>Sedan</option><option value='Kombi'>Kombi</option><option value='Hatchback'>Hatchback</option><option value='SUV'>SUV</option>
            </select>
          </div>
          <div className={styles.inputGroup}><label>Kolor</label><input name='color' value={formData.color} onChange={handleChange} required /></div>
          <div className={styles.inputGroup}><label>VIN</label><input name='vin' value={formData.vin} onChange={handleChange} required /></div>
        </div>

        <div className={styles.inputGroup}>
          <label>Opis</label>
          <textarea name='description' value={formData.description} onChange={handleChange} required rows={5} />
        </div>

        <div className={styles.inputGroup}>
          <label>Zarządzaj zdjęciami (max 10)</label>

          <div className={styles.imageGallery}>
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className={styles.imagePreview}>
                <img src={img} alt={`Istniejące ${index}`} />
                <button type="button" onClick={() => removeExistingImage(index)} className={styles.removeBtn}>×</button>
              </div>
            ))}

            {newImages.map((file, index) => (
              <div key={`new-${index}`} className={styles.imagePreview}>
                <img src={URL.createObjectURL(file)} alt={`Nowe ${index}`} className={styles.newBadge} />
                <button type="button" onClick={() => removeNewImage(index)} className={styles.removeBtn}>×</button>
              </div>
            ))}
          </div>

          {(existingImages.length + newImages.length) < 10 && (
            <input type='file' multiple accept="image/*" onChange={handleImageSelect} className={styles.fileInput} style={{ marginTop: '1rem' }} />
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        <button type='submit' className={styles.submitBtn}>Zapisz zmiany</button>
      </form>
    </div>
  );
}