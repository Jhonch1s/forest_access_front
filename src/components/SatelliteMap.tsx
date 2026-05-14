import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './SatelliteMap.css';

interface SatelliteMapProps {
  lat: number;
  lng: number;
  nombre: string;
  className?: string;
}

function SatelliteMap({ lat, lng, nombre, className }: SatelliteMapProps) {
  console.log('[SatelliteMap] Rendering with:', { lat, lng, nombre });

  return (
    <div className={`satellite-map ${className ?? ''}`}>
      <MapContainer
        key={`${lat}-${lng}`}
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="satellite-map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker key={`${lat}-${lng}`} position={[lat, lng]}>
          <Popup>{nombre}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default SatelliteMap;
