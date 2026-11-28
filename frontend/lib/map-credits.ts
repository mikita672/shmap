export interface MapCredit {
  name: string;
  usage: string;
  license: string;
  url: string;
}

export interface MapCreditGroup {
  title: string;
  credits: MapCredit[];
}

export const MAP_CREDIT_GROUPS: MapCreditGroup[] = [
  {
    title: "Map",
    credits: [
      {
        name: "OpenStreetMap",
        usage: "Map data",
        license: "ODbL 1.0",
        url: "https://www.openstreetmap.org/copyright",
      },
      {
        name: "OpenMapTiles",
        usage: "Map schema and design",
        license: "CC BY 4.0",
        url: "https://openmaptiles.org/",
      },
      {
        name: "OpenFreeMap",
        usage: "Map tiles and style",
        license: "MIT",
        url: "https://openfreemap.org/",
      },
      {
        name: "Natural Earth",
        usage: "Shaded relief",
        license: "Public domain",
        url: "https://www.naturalearthdata.com/",
      },
      {
        name: "OSM Liberty",
        usage: "Map style base",
        license: "BSD 3-Clause",
        url: "https://github.com/maputnik/osm-liberty",
      },
    ],
  },
  {
    title: "Search and directions",
    credits: [
      {
        name: "Photon by komoot",
        usage: "Place search",
        license: "Data © OpenStreetMap",
        url: "https://photon.komoot.io/",
      },
      {
        name: "openrouteservice",
        usage: "Directions",
        license: "© openrouteservice.org by HeiGIT",
        url: "https://openrouteservice.org/",
      },
    ],
  },
  {
    title: "Map engine",
    credits: [
      {
        name: "MapLibre Native",
        usage: "Map rendering",
        license: "BSD 2-Clause",
        url: "https://github.com/maplibre/maplibre-native/blob/main/LICENSE.md",
      },
      {
        name: "MapLibre React Native",
        usage: "Map components",
        license: "MIT",
        url: "https://github.com/maplibre/maplibre-react-native/blob/main/LICENSE.md",
      },
    ],
  },
];

export const MAP_DATA_CREDIT = "© OpenStreetMap  © OpenMapTiles";
