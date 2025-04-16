// pages/escola.js
'use client'
import 'leaflet/dist/leaflet.css';
import './page.css'
import { useState } from 'react';
import MapaComRaio from '@/components/MapaComRaio';

export default function Location() {
  const [dadosLocalizacao, setDadosLocalizacao] = useState({ 
    lat: -8.8383, 
    lng: 13.2344, 
    radius: 500 
  });

  return (
    <div className="-container">
    <h3 className='subtitle'>Marque a localização da escola</h3>
    <MapaComRaio 
      onChange={setDadosLocalizacao}
      initialPosition={{
        lat: Number(dadosLocalizacao.latitude),
        lng: Number(dadosLocalizacao.longitude)
      }}
      initialRadius={Number(dadosLocalizacao.radius)}
    />
  </div>
  );
}