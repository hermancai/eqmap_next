type QueryValues = {
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
  minMag: number;
  maxMag: number;
  searchRadius: number;
  resultLimit: number;
};

type EarthquakeData = {
  geometry: { coordinates: number[] };
  properties: {
    mag: number;
    place: string;
    time: number;
    title: string;
  };
  id: string;
};

type USGSData = {
  bbox: number[];
  features: EarthquakeData[];
};

export type { QueryValues, EarthquakeData, USGSData };
