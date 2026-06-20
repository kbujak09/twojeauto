import { useState } from 'react';
import type { Filters} from '../Home';

import styles from './Sidebar.module.scss';

interface Props {
  filters: Filters,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function Sidebar({ filters, setFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: Reach.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            placeholder={'np. Toyota'}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='priceMin'>Cena od (PLN)</label>
          <input
            type='number'
            id='priceMin'
            name='priceMin'
            value={filters.priceMin}
            onChange={handleChange}
            min='0'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='priceMax'>Cena do (PLN)</label>
          <input
            type='number'
            id='priceMax'
            name='priceMax'
            value={filters.priceMax}
            onChange={handleChange}
            min='0'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='fuelType'>Paliwo</label>
          <select
            name='fuelType'
            id='fuelType'
            value={filters.fuelType}
            onChange={handleChange}
          >
            <option value=''>Wszystkie</option>
            <option value='Benzyna'>Benzyna</option>
            <option value='Diesel'>Diesel</option>
            <option value='Hybryda'>Hybryda</option>
            <option value='Elektryczny'>Elektryczny</option>
          </select>
        </div>
      </div>
    </aside>
  )
}