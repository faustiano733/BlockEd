// pages/escola.js
'use client'

import './page.css'
import { useState } from 'react';
import MapaComRaio from '@/components/MapaComRaio';

export default function PaginaEscola() {
  const [dadosLocalizacao, setDadosLocalizacao] = useState({ 
    lat: -8.8383, 
    lng: 13.2344, 
    radius: 500 
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="titulo-mapa">Marque a localização da escola</h1>
      <MapaComRaio onChange={setDadosLocalizacao} />

      <div className="dados-localizacao">
        <h3>Dados da Localização:</h3>
        <pre>
          Latitude: {dadosLocalizacao.lat.toFixed(6)}
          <br />
          Longitude: {dadosLocalizacao.lng.toFixed(6)}
          <br />
          Raio: {dadosLocalizacao.radius} metros
        </pre>
      </div>
    </div>
  );
}