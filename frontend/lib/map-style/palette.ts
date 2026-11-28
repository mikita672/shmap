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
};
