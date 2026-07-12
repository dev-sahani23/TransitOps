import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// leaflet default-icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function truckIcon(color = "oklch(0.78 0.18 75)") {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative">
      <div style="width:34px;height:34px;border-radius:50%;background:${color};display:grid;place-items:center;box-shadow:0 0 0 4px rgba(255,255,255,0.15),0 8px 24px rgba(0,0,0,0.5);animation:pulse 2s infinite">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
      </div>
    </div>
    <style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}</style>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function endpointIcon(kind: "origin" | "dest") {
  const color = kind === "origin" ? "oklch(0.72 0.17 155)" : "oklch(0.65 0.19 200)";
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function FitBounds({ trips }: { trips: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (!trips.length) return;
    const pts: [number, number][] = [];
    trips.forEach((t) => {
      pts.push([t.origin_lat, t.origin_lng]);
      pts.push([t.dest_lat, t.dest_lng]);
    });
    map.fitBounds(pts as any, { padding: [40, 40] });
  }, [trips, map]);
  return null;
}

function useAnimatedPosition(trip: any) {
  const [pos, setPos] = useState<[number, number]>([trip.origin_lat, trip.origin_lng]);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 18000; // 18s to cross full route, then loops
    const tick = (t: number) => {
      const elapsed = (t - start) % dur;
      let p = elapsed / dur;
      // ease-in-out
      p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const lat = trip.origin_lat + (trip.dest_lat - trip.origin_lat) * p;
      const lng = trip.origin_lng + (trip.dest_lng - trip.origin_lng) * p;
      setPos([lat, lng]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trip.id, trip.origin_lat, trip.origin_lng, trip.dest_lat, trip.dest_lng]);
  return pos;
}

function TripLayer({ trip }: { trip: any }) {
  const pos = useAnimatedPosition(trip);
  return (
    <>
      <Polyline
        positions={[
          [trip.origin_lat, trip.origin_lng],
          [trip.dest_lat, trip.dest_lng],
        ]}
        pathOptions={{ color: "oklch(0.78 0.18 75)", weight: 2.5, dashArray: "6 8", opacity: 0.75 }}
      />
      <Marker position={[trip.origin_lat, trip.origin_lng]} icon={endpointIcon("origin")}>
        <Popup>{trip.origin}</Popup>
      </Marker>
      <Marker position={[trip.dest_lat, trip.dest_lng]} icon={endpointIcon("dest")}>
        <Popup>{trip.destination}</Popup>
      </Marker>
      <Marker position={pos} icon={truckIcon()}>
        <Popup>
          <div className="text-sm">
            <div className="font-bold">{trip.code}</div>
            <div className="text-xs text-slate-600">
              {trip.origin} → {trip.destination}
            </div>
            {trip.driver && <div className="mt-1 text-xs">👤 {trip.driver.full_name}</div>}
            {trip.vehicle && <div className="text-xs">🚛 {trip.vehicle.reg_number}</div>}
          </div>
        </Popup>
      </Marker>
    </>
  );
}

export function LiveMap({ trips }: { trips: any[] }) {
  return (
    <MapContainer
      center={[15.5, 78.5]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds trips={trips} />
      {trips.map((t) => (
        <TripLayer key={t.id} trip={t} />
      ))}
    </MapContainer>
  );
}
