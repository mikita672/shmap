import type { MapPalette } from "./palette";

export interface PaintRule {
  match: RegExp;
  paint: (palette: MapPalette) => Record<string, unknown>;
}

export const PAINT_RULES: PaintRule[] = [
  { match: /^background$/, paint: (p) => ({ "background-color": p.land }) },
  {
    match: /^landuse_residential$/,
    paint: (p) => ({ "fill-color": p.residential }),
  },
  {
    match: /^park$/,
    paint: (p) => ({
      "fill-color": p.park,
      "fill-opacity": 1,
      "fill-outline-color": p.parkOutline,
    }),
  },
  { match: /^park_outline$/, paint: (p) => ({ "line-color": p.parkOutline }) },
  {
    match: /^landcover_wood$/,
    paint: (p) => ({ "fill-color": p.wood, "fill-opacity": 0.7 }),
  },
  {
    match: /^landcover_grass$/,
    paint: (p) => ({ "fill-color": p.grass, "fill-opacity": 0.7 }),
  },
  { match: /^landcover_ice$/, paint: (p) => ({ "fill-color": p.ice }) },
  { match: /^landcover_sand$/, paint: (p) => ({ "fill-color": p.sand }) },
  {
    match: /^landuse_(pitch|track)$/,
    paint: (p) => ({ "fill-color": p.pitch }),
  },
  { match: /^landuse_cemetery$/, paint: (p) => ({ "fill-color": p.cemetery }) },
  { match: /^landuse_hospital$/, paint: (p) => ({ "fill-color": p.hospital }) },
  { match: /^landuse_school$/, paint: (p) => ({ "fill-color": p.school }) },
  { match: /^water$/, paint: (p) => ({ "fill-color": p.water }) },
  { match: /^waterway_/, paint: (p) => ({ "line-color": p.water }) },
  { match: /^aeroway_fill$/, paint: (p) => ({ "fill-color": p.aeroway }) },
  {
    match: /^aeroway_(runway|taxiway)$/,
    paint: (p) => ({ "line-color": p.runway }),
  },
  {
    match: /^building$/,
    paint: (p) => ({
      "fill-color": p.building,
      "fill-outline-color": p.buildingOutline,
    }),
  },
  {
    match: /^building-3d$/,
    paint: (p) => ({
      "fill-extrusion-color": p.building3d,
      "fill-extrusion-opacity": 1,
      "fill-extrusion-vertical-gradient": false,
    }),
  },
  { match: /^boundary_3$/, paint: (p) => ({ "line-color": p.boundary }) },
  {
    match: /^boundary_(2|disputed)$/,
    paint: (p) => ({ "line-color": p.boundaryCountry }),
  },
  {
    match: /^(road|tunnel|bridge)_motorway(_link)?_casing$/,
    paint: (p) => ({ "line-color": p.motorwayCasing }),
  },
  {
    match: /^(road|tunnel|bridge)_motorway(_link)?$/,
    paint: (p) => ({ "line-color": p.motorway }),
  },
  {
    match:
      /^(road|tunnel|bridge)_(trunk_primary|secondary_tertiary|link)_casing$/,
    paint: (p) => ({ "line-color": p.majorRoadCasing }),
  },
  {
    match: /^(road|tunnel|bridge)_(trunk_primary|secondary_tertiary|link)$/,
    paint: (p) => ({ "line-color": p.majorRoad }),
  },
  {
    match: /^(road|tunnel|bridge)_(minor|street|service_track)_casing$/,
    paint: (p) => ({ "line-color": p.minorRoadCasing }),
  },
  {
    match: /^(road|tunnel|bridge)_(minor|street|service_track)$/,
    paint: (p) => ({ "line-color": p.minorRoad }),
  },
  {
    match: /^bridge_path_pedestrian_casing$/,
    paint: (p) => ({ "line-color": p.pathCasing }),
  },
  {
    match: /^(road|tunnel|bridge)_path_pedestrian$/,
    paint: (p) => ({ "line-color": p.path }),
  },
  {
    match: /^(road|tunnel|bridge)_(major|transit)_rail(_hatching)?$/,
    paint: (p) => ({ "line-color": p.rail }),
  },
];
