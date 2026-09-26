import axios from "axios";

export interface PhotonProperties {
  osm_id: number;
  osm_type: string;
  osm_key: string;
  osm_value: string;
  type?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  locality?: string;
  district?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  extent?: [number, number, number, number];
}

export interface PhotonFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [longitude: number, latitude: number];
  };
  properties: PhotonProperties;
}

export interface PhotonResponse {
  type: "FeatureCollection";
  features: PhotonFeature[];
}

export interface GeocodingSearchOptions {
  query: string;
  lon?: number;
  lat?: number;
  zoom?: number;
  locationBiasScale?: number;
  limit?: number;
  lang?: string;
}

export interface SearchPlace {
  id: string;
  name: string;
  displayName: string;
  longitude: number;
  latitude: number;
}

const PHOTON_BASE_URL = "https://photon.komoot.io";

const photonClient = axios.create({
  baseURL: PHOTON_BASE_URL,
  timeout: 5000,
});

export async function searchPlaces(
  options: GeocodingSearchOptions,
): Promise<PhotonFeature[]> {
  const {
    query,
    lat,
    lon,
    zoom,
    locationBiasScale,
    limit = 5,
    lang = "en",
  } = options;

  if (!query || query.trim().length < 2) {
    return [];
  }

  const params: Record<string, string | number> = {
    q: query.trim(),
    limit,
    lang,
  };

  if (lat !== undefined && lon !== undefined) {
    params.lat = lat;
    params.lon = lon;
  }

  if (zoom !== undefined) {
    params.zoom = zoom;
  }

  if (locationBiasScale !== undefined) {
    params.location_bias_scale = locationBiasScale;
  }

  const { data } = await photonClient.get<PhotonResponse>("/api", { params });

  return data.features;
}

export function featureToPlace(feature: PhotonFeature): SearchPlace {
  const { properties, geometry } = feature;
  const [longitude, latitude] = geometry.coordinates;

  const name = properties.name ?? properties.street ?? "Unknown";

  const addressParts = [
    properties.street,
    properties.district,
    properties.city,
    properties.state,
    properties.country,
  ].filter((part): part is string => Boolean(part) && part !== name);

  const displayName = [name, ...addressParts].join(", ") || "Unknown location";

  return {
    id: `${properties.osm_type}${properties.osm_id}`,
    name,
    displayName,
    longitude,
    latitude,
  };
}
