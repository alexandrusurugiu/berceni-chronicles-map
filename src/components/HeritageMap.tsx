import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { POIS, type POI } from "@/data/pois";
import { type UserStory } from "@/components/AddStoryDialog";

function makeIcon(index: number) {
  return L.divIcon({
    className: "",
    html: `<div class="vintage-pin">${index + 1}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="vintage-pin" style="background-color: #5c2517; color: #f4ebd9; border-color: #f4ebd9;">P</div>`,
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

function MapClickListener({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Props = { 
  onSelect: (p: POI) => void;
  onSelectUserStory: (s: UserStory) => void; // NOU
  onMapClick?: (lat: number, lng: number) => void;
  userStories?: UserStory[]; 
};

export default function HeritageMap({ onSelect, onSelectUserStory, onMapClick, userStories = [] }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full bg-secondary" />;

  return (
    <MapContainer center={[44.4, 26.117]} zoom={14} scrollWheelZoom className="h-full w-full cursor-crosshair">
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds />
      {onMapClick && <MapClickListener onMapClick={onMapClick} />}

      {POIS.map((p, i) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={makeIcon(i)} eventHandlers={{ click: () => onSelect(p) }} />
      ))}

      {userStories.map((story) => {
        if (story.lat === undefined || story.lng === undefined) return null;
        return (
          <Marker
            key={story.id}
            position={[story.lat, story.lng]}
            icon={makeUserIcon()}
            eventHandlers={{ click: () => onSelectUserStory(story) }} // Am legat click-ul aici!
          />
        );
      })}
    </MapContainer>
  );
}