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

export interface PlaceDetails {
  id: string;
  name: string;
  displayName: string;
  category: string;
  osmKey?: string;
  osmValue?: string;
  type?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  locality?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodingOptions {
  lat: number;
  lon: number;
  lang?: string;
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

export function formatOsmCategory(
  key?: string,
  value?: string,
  type?: string,
): string {
  if (key === "amenity") {
    const amenity: Record<string, string> = {
      cafe: "Café",
      restaurant: "Restaurant",
      fast_food: "Fast Food",
      bar: "Bar",
      pub: "Pub",
      nightclub: "Nightclub",
      food_court: "Food Court",
      pharmacy: "Pharmacy",
      hospital: "Hospital",
      clinic: "Clinic",
      doctors: "Medical Practice",
      dentist: "Dentist",
      veterinary: "Veterinary",
      school: "School",
      university: "University",
      college: "College",
      library: "Library",
      bank: "Bank",
      atm: "ATM",
      post_office: "Post Office",
      police: "Police",
      fire_station: "Fire Station",
      fuel: "Petrol Station",
      parking: "Parking",
      bicycle_parking: "Bike Parking",
      taxi: "Taxi",
      bus_station: "Bus Station",
      ferry_terminal: "Ferry Terminal",
      toilets: "Public Toilets",
      place_of_worship: "Place of Worship",
      theatre: "Theatre",
      cinema: "Cinema",
      arts_centre: "Arts Centre",
      community_centre: "Community Centre",
      townhall: "Town Hall",
      courthouse: "Courthouse",
      embassy: "Embassy",
      marketplace: "Marketplace",
      recycling: "Recycling Point",
      social_facility: "Social Facility",
    };
    if (value && amenity[value]) return amenity[value];
    return "Amenity";
  }

  if (key === "shop") {
    const shop: Record<string, string> = {
      supermarket: "Supermarket",
      convenience: "Convenience Store",
      bakery: "Bakery",
      butcher: "Butcher",
      greengrocer: "Greengrocer",
      fishmonger: "Fishmonger",
      deli: "Deli",
      alcohol: "Off-Licence",
      clothes: "Clothes Shop",
      shoes: "Shoe Shop",
      sports: "Sports Shop",
      electronics: "Electronics",
      mobile_phone: "Phone Shop",
      computer: "Computer Shop",
      hardware: "Hardware Store",
      furniture: "Furniture Store",
      books: "Bookshop",
      florist: "Florist",
      gift: "Gift Shop",
      jewellery: "Jewellery",
      toys: "Toy Shop",
      pet: "Pet Shop",
      chemist: "Chemist",
      hairdresser: "Hairdresser",
      beauty: "Beauty Salon",
      laundry: "Laundry",
      dry_cleaning: "Dry Cleaning",
      optician: "Optician",
      travel_agency: "Travel Agency",
      car: "Car Dealer",
      car_repair: "Car Repair",
      bicycle: "Bike Shop",
    };
    if (value && shop[value]) return shop[value];
    return "Shop";
  }

  if (key === "tourism") {
    const tourism: Record<string, string> = {
      museum: "Museum",
      hotel: "Hotel",
      hostel: "Hostel",
      motel: "Motel",
      guest_house: "Guest House",
      camp_site: "Campsite",
      caravan_site: "Caravan Site",
      attraction: "Attraction",
      viewpoint: "Viewpoint",
      artwork: "Artwork",
      gallery: "Gallery",
      information: "Information",
      theme_park: "Theme Park",
      zoo: "Zoo",
      aquarium: "Aquarium",
      picnic_site: "Picnic Site",
    };
    if (value && tourism[value]) return tourism[value];
    return "Tourism";
  }

  if (key === "leisure") {
    const leisure: Record<string, string> = {
      park: "Park",
      garden: "Garden",
      playground: "Playground",
      stadium: "Stadium",
      sports_centre: "Sports Centre",
      swimming_pool: "Swimming Pool",
      gym: "Gym",
      golf_course: "Golf Course",
      tennis: "Tennis Court",
      pitch: "Sports Pitch",
      track: "Athletics Track",
      marina: "Marina",
      beach_resort: "Beach Resort",
      nature_reserve: "Nature Reserve",
      dog_park: "Dog Park",
    };
    if (value && leisure[value]) return leisure[value];
    return "Leisure";
  }

  if (key === "highway") {
    const highway: Record<string, string> = {
      motorway: "Motorway",
      trunk: "Trunk Road",
      primary: "Main Road",
      secondary: "Secondary Road",
      tertiary: "Local Road",
      residential: "Residential Street",
      unclassified: "Road",
      service: "Service Road",
      footway: "Footpath",
      cycleway: "Cycle Path",
      path: "Path",
      steps: "Steps",
      pedestrian: "Pedestrian Zone",
      living_street: "Living Street",
    };
    if (value && highway[value]) return highway[value];
    return "Road";
  }

  if (key === "railway") {
    const railway: Record<string, string> = {
      station: "Train Station",
      halt: "Train Stop",
      tram_stop: "Tram Stop",
      subway_entrance: "Subway Entrance",
    };
    if (value && railway[value]) return railway[value];
    return "Railway";
  }

  if (key === "aeroway") {
    const aeroway: Record<string, string> = {
      aerodrome: "Airport",
      terminal: "Airport Terminal",
      helipad: "Helipad",
    };
    if (value && aeroway[value]) return aeroway[value];
    return "Airport";
  }

  if (key === "natural") {
    const natural: Record<string, string> = {
      beach: "Beach",
      wood: "Forest",
      water: "Water",
      wetland: "Wetland",
      peak: "Mountain Peak",
      hill: "Hill",
      valley: "Valley",
      cliff: "Cliff",
      cave_entrance: "Cave",
    };
    if (value && natural[value]) return natural[value];
    return "Natural Feature";
  }

  if (key === "place") {
    const place: Record<string, string> = {
      city: "City",
      town: "Town",
      village: "Village",
      hamlet: "Hamlet",
      suburb: "Suburb",
      neighbourhood: "Neighbourhood",
      quarter: "Quarter",
      island: "Island",
      square: "Square",
    };
    if (value && place[value]) return place[value];
    return "Place";
  }

  if (key === "building") {
    const building: Record<string, string> = {
      commercial: "Commercial Building",
      industrial: "Industrial Building",
      office: "Office Building",
      residential: "Residential Building",
      retail: "Retail Building",
      warehouse: "Warehouse",
      church: "Church",
      cathedral: "Cathedral",
      mosque: "Mosque",
      synagogue: "Synagogue",
      school: "School Building",
      university: "University Building",
      hospital: "Hospital Building",
    };
    if (value && building[value]) return building[value];
    return "Building";
  }

  if (key === "office") {
    return "Office";
  }

  if (key === "sport") {
    return "Sports Venue";
  }

  if (type) {
    const typeMap: Record<string, string> = {
      house: "Address",
      street: "Street",
      city: "City",
      district: "District",
      locality: "Area",
      county: "County",
      state: "State / Region",
      country: "Country",
    };
    if (typeMap[type]) return typeMap[type];
  }

  return "Place";
}

export async function reverseGeocode(
  options: ReverseGeocodingOptions,
): Promise<PlaceDetails | null> {
  const { lat, lon, lang = "en" } = options;

  try {
    const { data } = await photonClient.get<PhotonResponse>("/reverse", {
      params: { lat, lon, lang, limit: 1 },
    });

    const feature = data.features?.[0];
    if (!feature) return null;

    return featureToPlaceDetails(feature, { lat, lon });
  } catch {
    return null;
  }
}

export function featureToPlaceDetails(
  feature: PhotonFeature,
  fallbackCoords: { lat: number; lon: number },
): PlaceDetails {
  const { properties } = feature;

  const latitude = fallbackCoords.lat;
  const longitude = fallbackCoords.lon;

  const name =
    properties.name ??
    (properties.street && properties.housenumber
      ? `${properties.street} ${properties.housenumber}`
      : properties.street) ??
    properties.city ??
    `${fallbackCoords.lat.toFixed(5)}, ${fallbackCoords.lon.toFixed(5)}`;

  const addressParts = [
    properties.housenumber && properties.street && !properties.name
      ? undefined
      : properties.street,
    properties.locality,
    properties.city,
    properties.postcode,
    properties.country,
  ].filter(
    (part): part is string =>
      Boolean(part) && part !== name && part !== properties.name,
  );

  const displayName =
    addressParts.length > 0
      ? addressParts.join(", ")
      : [properties.district, properties.state, properties.country]
          .filter(Boolean)
          .join(", ") || "Unknown location";

  const id =
    properties.osm_id && properties.osm_type
      ? `${properties.osm_type}${properties.osm_id}`
      : `pin_${fallbackCoords.lat.toFixed(6)}_${fallbackCoords.lon.toFixed(6)}`;

  const category = formatOsmCategory(
    properties.osm_key,
    properties.osm_value,
    properties.type,
  );

  return {
    id,
    name,
    displayName,
    category,
    osmKey: properties.osm_key,
    osmValue: properties.osm_value,
    type: properties.type,
    street: properties.street,
    housenumber: properties.housenumber,
    postcode: properties.postcode,
    locality: properties.locality,
    district: properties.district,
    city: properties.city,
    state: properties.state,
    country: properties.country,
    latitude,
    longitude,
  };
}

export function droppedPin(lat: number, lon: number): PlaceDetails {
  return {
    id: `pin_${lat.toFixed(6)}_${lon.toFixed(6)}`,
    name: "Dropped Pin",
    displayName: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
    category: "Place",
    latitude: lat,
    longitude: lon,
  };
}
