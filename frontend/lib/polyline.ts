import polyline from "@mapbox/polyline";

const PRECISION = 5;

export function decodePath(encoded: string): GeoJSON.LineString {
  return polyline.toGeoJSON(encoded, PRECISION);
}
