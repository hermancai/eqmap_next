import { EarthquakeData } from "./USGS";

type SelectedRows = {
    [key: EarthquakeData["id"]]: boolean;
};

export type { SelectedRows };
