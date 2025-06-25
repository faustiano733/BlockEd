'use client'; // Isso é essencial no topo do arquivo
import dynamic from 'next/dynamic';
import { useState,useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
/*import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';*/

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

/*const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});*/

function MapaComRaio({ onChange, initialPosition, initialRadius }) {
  const [position, setPosition] = useState(initialPosition);
  
  const [radius, setRadius] = useState(300);

  useEffect(() => {
    if (initialPosition && 
        typeof initialPosition.lat === 'number' &&
        typeof initialPosition.lng === 'number' &&
        !isNaN(initialPosition.lat) &&
        !isNaN(initialPosition.lng)) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const getZoomFromRadius = (radiusInMeters) => {
    return Math.floor(16 - Math.log2(radiusInMeters / 100));
  }

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
        zoom={getZoomFromRadius(radius)} 
        style={{ height: 'calc(100% - 50px)', width: '100%', borderRadius: 10 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/*<Marker position={position} icon={customMarkerIcon} />*/}
        <Circle 
          center={position} 
          radius={radius} 
          pathOptions={{ color: 'blue', fillOpacity: 0.2 }} 
        />
        <MapaClickHandler />
      </MapContainer>

      <div style={{ marginTop: '5px', height: "20px", display: "flex", gap: 2, fontSize: "0.875rem", color: "#2a4859", alignItems: "center", justifyContent: "center"  }}>
        <label>Raio: </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="5"
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