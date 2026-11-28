import type { LightSpecification } from "@maplibre/maplibre-react-native";

export interface MapPalette {
  light: LightSpecification;
  land: string;
  residential: string;
  park: string;
  parkOutline: string;
  wood: string;
  grass: string;
  pitch: string;
  cemetery: string;
  hospital: string;
  school: string;
  sand: string;
  ice: string;
  water: string;
  aeroway: string;
  runway: string;
  building: string;
  buildingOutline: string;
  building3d: string;
  boundary: string;
  boundaryCountry: string;
  minorRoad: string;
  minorRoadCasing: string;
  majorRoad: string;
  majorRoadCasing: string;
  motorway: string;
  motorwayCasing: string;
  path: string;
  pathCasing: string;
  rail: string;
  placeLabel: string;
  placeLabelMinor: string;
  roadLabel: string;
  pathLabel: string;
  poiLabel: string;
  transitLabel: string;
  waterLabel: string;
  labelHalo: string;
  reliefBrightness: number;
  reliefSaturation: number;
  patternOpacity: number;
}

export const LIGHT_PALETTE: MapPalette = {
  light: {
    anchor: "viewport",
    color: "#ffffff",
    intensity: 0.2,
    position: [1.15, 210, 30],
  },
  land: "#F6F3EA",
  residential: "#F1EDE2",
  park: "#D4E0B8",
  parkOutline: "#C4D3A4",
  wood: "#C9D9AE",
  grass: "#DCE6C4",
  pitch: "#DCE4C6",
  cemetery: "#D2DCC0",
  hospital: "#F3E1DE",
  school: "#EFEBD6",
  sand: "#F3EBCB",
  ice: "#EEF3F3",
  water: "#A9CBE0",
  aeroway: "#E9E5DC",
  runway: "#F9F7F2",
  building: "#E6E1D6",
  buildingOutline: "#DAD4C7",
  building3d: "#E9E4DA",
  boundary: "#B9A99A",
  boundaryCountry: "#8F8273",
  minorRoad: "#FFFFFF",
  minorRoadCasing: "#E2DCCD",
  majorRoad: "#FFF6DF",
  majorRoadCasing: "#E8D3A6",
  motorway: "#F6D9A8",
  motorwayCasing: "#D9B27A",
  path: "#FFFFFF",
  pathCasing: "#DDD6C6",
  rail: "#C9C3B6",
  placeLabel: "#3E3A32",
  placeLabelMinor: "#6B6355",
  roadLabel: "#6B6355",
  pathLabel: "#9C8F7A",
  poiLabel: "#6B6355",
  transitLabel: "#4F6F88",
  waterLabel: "#4F6F88",
  labelHalo: "#FFFFFF",
  reliefBrightness: 1,
  reliefSaturation: 0,
  patternOpacity: 1,
};

export const DARK_PALETTE: MapPalette = {
  light: {
    anchor: "viewport",
    color: "#FFF4E0",
    intensity: 0.2,
    position: [1.15, 210, 30],
  },
  land: "#23261F",
  residential: "#272A22",
  park: "#2E3A26",
  parkOutline: "#36432D",
  wood: "#2B3624",
  grass: "#2C3725",
  pitch: "#2F3828",
  cemetery: "#2C3527",
  hospital: "#3A2C2A",
  school: "#2F2E25",
  sand: "#34322A",
  ice: "#2E3436",
  water: "#1B2A33",
  aeroway: "#2B2D26",
  runway: "#35372F",
  building: "#2F322A",
  buildingOutline: "#3A3D33",
  building3d: "#33362D",
  boundary: "#6A6253",
  boundaryCountry: "#857A66",
  minorRoad: "#3A3C33",
  minorRoadCasing: "#2A2C25",
  majorRoad: "#4A4A3C",
  majorRoadCasing: "#2F3027",
  motorway: "#6B5A3E",
  motorwayCasing: "#4A3F2D",
  path: "#4A4C42",
  pathCasing: "#2A2C25",
  rail: "#4A4A40",
  placeLabel: "#E3D3B3",
  placeLabelMinor: "#C9B79A",
  roadLabel: "#C9B79A",
  pathLabel: "#9C8F7A",
  poiLabel: "#C9B79A",
  transitLabel: "#8FB0C8",
  waterLabel: "#7FA3B8",
  labelHalo: "#1E201A",
  reliefBrightness: 0.35,
  reliefSaturation: -0.5,
  patternOpacity: 0.12,
};
