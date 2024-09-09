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
    // coordinates list: longitude, latitude, depth (km)
    geometry: { coordinates: [number, number, number] };
    properties: {
        mag: number;
        place: string;
        time: number;
        title: string;
    };
    id: string;
};

// bbox only if at least 2 features. Holds confining coordinates for all points
type USGSData = {
    bbox?: [number, number, number, number, number, number];
    features: EarthquakeData[];
};

export type { QueryValues, EarthquakeData, USGSData };
