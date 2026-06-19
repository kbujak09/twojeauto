import { useState } from 'react';

import Sidebar from '../Sidebar';
import CarList from '../CarList';

export interface Filters {
  brand: string;
  priceMin: string;
  priceMax: string;
  fuelType: string;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    brand: '',
    priceMin: '',
    priceMax: '',
    fuelType: '',
  });

  return (
    <div className="main-layout">
      <Sidebar filters={filters} setFilters={setFilters}/>
      <CarList filters={filters}/>
    </div>
  )
}