import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hazard, Shelter } from '../lib/supabase';

interface Zone {
  id: string;
  name: string;
  coordinates: [number, number][];
}

interface MapViewProps {
  hazards: Hazard[];
  shelters: Shelter[];
  zones?: Zone[];
}

/* -------------------------------------------------------------------------- */
/*                         🔧 Fix Default Leaflet Icons                        */
/* -------------------------------------------------------------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* -------------------------------------------------------------------------- */
/*                          Fit Map to All Markers                             */
/* -------------------------------------------------------------------------- */
const FitBounds: React.FC<{ hazards: Hazard[]; shelters: Shelter[]; zones?: Zone[] }> = ({
  hazards,
  shelters,
  zones,
}) => {
  const map = useMap();

  useEffect(() => {
    const allCoords: [number, number][] = [
      ...hazards
        .map(h => [Number(h.lat), Number(h.lng)] as [number, number])
        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng)),
      ...shelters
        .map(s => [Number(s.lat), Number(s.lng)] as [number, number])
        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng)),
      ...(zones
        ? zones.flatMap(z =>
            z.coordinates.map(coord => [Number(coord[0]), Number(coord[1])] as [number, number])
          )
        : []),
    ];

    if (allCoords.length > 0) {
      map.fitBounds(allCoords, { padding: [50, 50] });
    }
  }, [hazards, shelters, zones, map]);

  return null;
};

/* -------------------------------------------------------------------------- */
/*                                MapView Component                            */
/* -------------------------------------------------------------------------- */
const MapView: React.FC<MapViewProps> = ({ hazards, shelters, zones = [] }) => {
  const [activeLayer, setActiveLayer] = useState({
    flood: true,
    fire: true,
    earthquake: true,
    windstorm: true,
    traffic: true,
    weather: true,
  });

  const [activeZones, setActiveZones] = useState<string[]>([]);

  const toggleZone = (id: string) => {
    setActiveZones(prev => (prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]));
  };

  const getHazardColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#EF233C';
      case 'high':
        return '#FF6B6B';
      case 'moderate':
        return '#FFD60A';
      default:
        return '#06D6A0';
    }
  };

  const getShelterIcon = (type: string): Icon => {
    let iconUrl = '/icons/shelter.png';
    if (type === 'hospital') iconUrl = '/icons/hospital.png';
    if (type === 'safe_zone') iconUrl = '/icons/safezone.png';
    return new Icon({
      iconUrl,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });
  };

  const activeHazards = hazards.filter(
    h => h.active && activeLayer[h.type as keyof typeof activeLayer]
  );

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      {/* ------------------- Floating Layers Panel ------------------- */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg text-white text-xs space-y-2 shadow-lg z-50">
        <h3 className="text-[#00B4D8] font-semibold text-sm mb-1">Layers & Zones</h3>

        {/* Hazard Layers */}
        <div>
          <strong>Hazards:</strong>
          {Object.entries(activeLayer).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  setActiveLayer(prev => ({ ...prev, [key]: !prev[key as keyof typeof activeLayer] }))
                }
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>

        {/* Zone Layers */}
        {zones.length > 0 && (
          <div>
            <strong>Zones:</strong>
            {zones.map(zone => (
              <label key={zone.id} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeZones.includes(zone.id)}
                  onChange={() => toggleZone(zone.id)}
                />
                <span>{zone.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ------------------- Map Container ------------------- */}
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={12}
        className="w-full h-full rounded-xl overflow-hidden"
      >
        <FitBounds hazards={hazards} shelters={shelters} zones={zones} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Zones */}
        {zones
          .filter(z => activeZones.includes(z.id))
          .map(z => (
            <Polygon
              key={z.id}
              positions={z.coordinates}
              color="#00B4D8"
              fillOpacity={0.1}
              weight={2}
            />
          ))}

        {/* Hazard Circles */}
        {activeHazards.map(h => (
          <Circle
            key={h.id}
            center={[Number(h.lat), Number(h.lng)]}
            radius={h.radius}
            color={getHazardColor(h.severity)}
            fillColor={getHazardColor(h.severity)}
            fillOpacity={0.35}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <strong>{h.type.toUpperCase()}</strong> — {h.severity}
                <br />
                Zone: {h.zone}
                <br />
                Risk: {h.risk_percentage}%
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Shelters */}
        {shelters.map(s => (
          <Marker
            key={s.id}
            position={[Number(s.lat), Number(s.lng)]}
            icon={getShelterIcon(s.type)}
          >
            <Popup>
              <div className="text-sm">
                <strong>{s.name}</strong>
                <br />
                Type: {s.type}
                <br />
                Capacity: {s.current_occupancy}/{s.capacity}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
