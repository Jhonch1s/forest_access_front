import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './SatelliteMap.css';

interface SatelliteMapProps {
  lat: number;
  lng: number;
  nombre: string;
  className?: string;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function SatelliteMap({ lat, lng, nombre, className }: SatelliteMapProps) {
  console.log('[SatelliteMap] Rendering with:', { lat, lng, nombre });

  return (
    <div className={`satellite-map ${className ?? ''}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="satellite-map-container"
      >
        <ChangeView center={[lat, lng]} zoom={14} />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker position={[lat, lng]}>
          <Popup>{nombre}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default SatelliteMap;
