'use client'; // Isso é essencial no topo do arquivo
import dynamic from 'next/dynamic';
import { useState,useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
// Carregar os componentes do Leaflet apenas no cliente
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
function MapaComRaio({ onChange, initialPosition, initialRadius }) {
  const [position, setPosition] = useState({ 
    lat: -8.8383, 
    lng: 13.2344 
  });
  
  const [radius, setRadius] = useState(500);

  useEffect(() => {
    if (initialPosition && 
        typeof initialPosition.lat === 'number' &&
        typeof initialPosition.lng === 'number' &&
        !isNaN(initialPosition.lat) &&
        !isNaN(initialPosition.lng)) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  useEffect(() => {
    if (initialRadius && !isNaN(initialRadius)) {
      setRadius(initialRadius);
    }
  }, [initialRadius]);



  function MapaClickHandler() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng, radius: radius });
      },
    });
    return null;
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '60%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <Circle 
          center={position} 
          radius={radius} 
          pathOptions={{ color: 'blue', fillOpacity: 0.2 }} 
        />
        <MapaClickHandler />
      </MapContainer>

      <div style={{ marginTop: '1rem' }}>
        <label>Raio (metros): </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="10"
          value={radius}
          onChange={(e) => {
            const newRadius = parseInt(e.target.value, 10);
            setRadius(newRadius);
            onChange({ ...position, radius: newRadius });
          }}
        />
        <span>{radius}m</span>
      </div>
    </div>
  );
}

export default MapaComRaio;