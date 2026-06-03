import { useEffect, useMemo } from "react";
import type { LatLngBoundsExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { getWilayaCenter } from "@/data/wilaya-coordinates";
import { resolveInstitutionCoordinates } from "@/lib/map-institution-coords";
import { officeMarkerIcon } from "@/lib/leaflet-icon";
import { useLocalized } from "@/lib/localized-content";
import type { Institution } from "@/lib/api";
import "leaflet/dist/leaflet.css";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

interface WilayaStreetMapProps {
  wilayaCode: string;
  institutions: Institution[];
  className?: string;
  heightClassName?: string;
}

function MapViewSync({
  center,
  zoom,
  bounds,
}: {
  center: [number, number];
  zoom: number;
  bounds: L.LatLngBoundsExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
    } else {
      map.setView(center, zoom);
    }
  }, [map, center, zoom, bounds]);

  return null;
}

export function WilayaStreetMap({
  wilayaCode,
  institutions,
  className,
  heightClassName = "h-[220px]",
}: WilayaStreetMapProps) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const wilayaCenter = getWilayaCenter(wilayaCode);

  const markers = useMemo(
    () =>
      institutions.map((inst, i) => ({
        inst,
        position: resolveInstitutionCoordinates(inst, i),
      })),
    [institutions],
  );

  const center: [number, number] = [wilayaCenter.lat, wilayaCenter.lng];
  const bounds = useMemo(() => {
    if (markers.length === 0) return null;
    const lats = markers.map((m) => m.position.lat);
    const lngs = markers.map((m) => m.position.lng);
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ] as LatLngBoundsExpression;
  }, [markers]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-muted/30",
        heightClassName,
        className,
      )}
    >
      <MapContainer
        key={wilayaCode}
        center={center}
        zoom={wilayaCenter.zoom}
        className="z-0 h-full w-full"
        scrollWheelZoom={false}
        attributionControl
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <MapViewSync center={center} zoom={wilayaCenter.zoom} bounds={bounds} />
        {markers.map(({ inst, position }) => (
          <Marker
            key={inst.id}
            position={[position.lat, position.lng]}
            icon={officeMarkerIcon}
          >
            <Popup>
              <div className="min-w-[160px] text-start text-sm">
                <p className="font-bold text-primary">{pick(inst, "name")}</p>
                {inst.commune && (
                  <p className="mt-1 text-xs text-muted-foreground">{inst.commune}</p>
                )}
                <Link
                  href={`/institutions/${inst.slug}`}
                  className="mt-2 inline-block text-xs font-medium text-primary underline"
                >
                  {t("wilaya.viewOffice")}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="pointer-events-none absolute bottom-1 end-2 z-[1000] rounded bg-white/80 px-1.5 py-0.5 text-[9px] text-muted-foreground">
        {t("wilaya.mapAttribution")}
      </p>
    </div>
  );
}
