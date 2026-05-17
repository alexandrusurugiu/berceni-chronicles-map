import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { POIS, type POI } from "@/data/pois";

function makeIcon(index: number) {
  return L.divIcon({
    className: "",
    html: `<div class="vintage-pin">${index + 1}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(POIS.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map]);
  return null;
}

type Props = { onSelect: (p: POI) => void };

export default function HeritageMap({ onSelect }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full bg-secondary" />;

  return (
    <MapContainer
      center={[44.4, 26.117]}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds />
      {POIS.map((p, i) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={makeIcon(i)}
          eventHandlers={{ click: () => onSelect(p) }}
        />
      ))}
    </MapContainer>
  );
}
