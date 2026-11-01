import type { PlaceDetails } from "@/lib/api/geocoding";

export function getPlaceLines(place: PlaceDetails) {
  const streetLine = [place.street, place.housenumber]
    .filter(Boolean)
    .join(" ");

  const localityLine = [place.locality, place.district]
    .filter(Boolean)
    .join(", ");

  const cityLine = [place.city, place.postcode, place.country]
    .filter(Boolean)
    .join(", ");

  const coordsText = `${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`;

  const fullAddress = [streetLine, localityLine, cityLine]
    .filter(Boolean)
    .join("\n");

  return { streetLine, localityLine, cityLine, coordsText, fullAddress };
}

export function getPlaceCopyText(place: PlaceDetails) {
  const { coordsText, fullAddress } = getPlaceLines(place);
  return [place.name, fullAddress || place.displayName, coordsText]
    .filter(Boolean)
    .join("\n");
}

export function getPlaceShareText(place: PlaceDetails) {
  const { coordsText, fullAddress } = getPlaceLines(place);
  return [
    place.name,
    fullAddress || place.displayName,
    `Coordinates: ${coordsText}`,
    `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}&zoom=17`,
  ]
    .filter(Boolean)
    .join("\n");
}
