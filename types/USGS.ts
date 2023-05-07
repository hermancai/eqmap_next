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

type USGSData = {
  bbox: number[];
  features: {
    geometry: { coordinates: number[] };
    properties: {
      mag: number;
      place: string;
      time: number;
      title: string;
    };
    id: string;
  }[];
};

export type { QueryValues, USGSData };
