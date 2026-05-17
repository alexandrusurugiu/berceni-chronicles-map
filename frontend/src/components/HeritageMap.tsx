import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
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

function makeLiveUserIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div class="relative flex h-5 w-5 ml-[-2px] mt-[-2px]">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-5 w-5 bg-green-800 border-2 border-white shadow-md"></span>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
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
  onSelectUserStory: (s: UserStory) => void;
  onMapClick?: (lat: number, lng: number) => void;
  userStories?: UserStory[];
  userLocation?: { lat: number; lng: number } | null; 
};

export default function HeritageMap({ onSelect, onSelectUserStory, onMapClick, userStories = [], userLocation }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full bg-secondary" />;

  return (
    <MapContainer center={[44.4045, 26.1100]} zoom={15} scrollWheelZoom className="h-full w-full cursor-crosshair">
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds />
      {onMapClick && <MapClickListener onMapClick={onMapClick} />}

      {/* Randează utilizatorul dacă știm unde este */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={makeLiveUserIcon()}>
          <Popup className="custom-vintage-popup">
            <div className="p-1 font-body text-ink font-bold">📍 Locația ta actuală</div>
          </Popup>
        </Marker>
      )}

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
            eventHandlers={{ click: () => onSelectUserStory(story) }}
          />
        );
      })}
    </MapContainer>
  );
}