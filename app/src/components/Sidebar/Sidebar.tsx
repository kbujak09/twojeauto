import { useState } from 'react';
import type { Filters } from '../Home';

import styles from './Sidebar.module.scss';

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function Sidebar({ filters, setFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <aside className={styles.sidebar}>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Ukryj filtry' : 'Filtrowanie'}
      </button>

      <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
        <h3 className={styles.title}>Filtry</h3>

        <div className={styles.inputGroup}>
          <label htmlFor='brand'>Marka</label>
          <input
            type='text'
            id='brand'
            name='brand'
            value={filters.brand}
            onChange={handleChange}
            placeholder='np. Toyota'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='priceMin'>Cena od (PLN)</label>
          <input type='number' id='priceMin' name='priceMin' value={filters.priceMin} onChange={handleChange} min='0' />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='priceMax'>Cena do (PLN)</label>
          <input type='number' id='priceMax' name='priceMax' value={filters.priceMax} onChange={handleChange} min='0' />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='yearMin'>Rocznik od</label>
          <input type='number' id='yearMin' name='yearMin' value={filters.yearMin} onChange={handleChange} min='1900' />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='yearMax'>Rocznik do</label>
          <input type='number' id='yearMax' name='yearMax' value={filters.yearMax} onChange={handleChange} min='1900' />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='mileageMax'>Przebieg do (km)</label>
          <input type='number' id='mileageMax' name='mileageMax' value={filters.mileageMax} onChange={handleChange} min='0' />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='fuelType'>Paliwo</label>
          <select name='fuelType' id='fuelType' value={filters.fuelType} onChange={handleChange}>
            <option value=''>Wszystkie</option>
            <option value='Benzyna'>Benzyna</option>
            <option value='Diesel'>Diesel</option>
            <option value='LPG'>LPG</option>
            <option value='Hybryda'>Hybryda</option>
            <option value='Elektryczny'>Elektryczny</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='transmission'>Skrzynia biegów</label>
          <select name='transmission' id='transmission' value={filters.transmission} onChange={handleChange}>
            <option value=''>Wszystkie</option>
            <option value='Manualna'>Manualna</option>
            <option value='Automatyczna'>Automatyczna</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='bodyType'>Typ nadwozia</label>
          <select name='bodyType' id='bodyType' value={filters.bodyType} onChange={handleChange}>
            <option value=''>Wszystkie</option>
            <option value='Sedan'>Sedan</option>
            <option value='Kombi'>Kombi</option>
            <option value='Hatchback'>Hatchback</option>
            <option value='SUV'>SUV</option>
            <option value='Coupe'>Coupe</option>
            <option value='Kabriolet'>Kabriolet</option>
          </select>
        </div>
      </div>
    </aside>
  )
}