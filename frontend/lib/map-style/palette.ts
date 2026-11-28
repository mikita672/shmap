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
    color: "#FFFFFF",
    intensity: 0.2,
    position: [1.15, 210, 30],
  },
  land: "#343437",
  residential: "#38383B",
  park: "#324A37",
  parkOutline: "#3A553E",
  wood: "#30443A",
  grass: "#34493A",
  pitch: "#374C3D",
  cemetery: "#36463B",
  hospital: "#463539",
  school: "#3D3A32",
  sand: "#4A4234",
  ice: "#3A4147",
  water: "#22394B",
  aeroway: "#3A3A3D",
  runway: "#4C4C50",
  building: "#3B3B3F",
  buildingOutline: "#434347",
  building3d: "#404045",
  boundary: "#7D6E5C",
  boundaryCountry: "#9C8670",
  minorRoad: "#5C5C62",
  minorRoadCasing: "#2E2E31",
  majorRoad: "#7C6D5B",
  majorRoadCasing: "#4E443A",
  motorway: "#A07D54",
  motorwayCasing: "#654D36",
  path: "#5A5A60",
  pathCasing: "#2E2E31",
  rail: "#606066",
  placeLabel: "#EDE6D9",
  placeLabelMinor: "#BEB6A8",
  roadLabel: "#C9C2B4",
  pathLabel: "#A0998C",
  poiLabel: "#D4B88F",
  transitLabel: "#A3C4DE",
  waterLabel: "#8DB4D2",
  labelHalo: "#2B2B2E",
  reliefBrightness: 0.45,
  reliefSaturation: -0.6,
  patternOpacity: 0.12,
};
