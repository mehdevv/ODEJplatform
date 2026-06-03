import { getWilayaCenter } from "@/data/wilaya-coordinates";
import type { Institution } from "@/lib/api";

/** Resolve lat/lng for map pins (exact coords or spread around wilaya center). */
export function resolveInstitutionCoordinates(
  institution: Institution,
  index = 0,
): { lat: number; lng: number } {
  if (institution.coordinates) {
    return institution.coordinates;
  }

  const center = getWilayaCenter(institution.wilayaCode ?? "06");
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.018 + (index % 4) * 0.008;
  return {
    lat: center.lat + Math.cos(angle) * radius,
    lng: center.lng + Math.sin(angle) * radius,
  };
}
