import { QueryValues, USGSData } from "@/types/USGS";

/**
 * Sample URL
 * https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude
 * &starttime=1900-01-01
 * &endtime=2000-01-01
 * &latitude=37.7749295
 * &longitude=-122.4194155
 * &maxradiuskm=500
 * &minmagnitude=6
 * &maxmagnitude=10
 * &limit=20
 */

const buildURL = (data: QueryValues): string => {
  let baseURL =
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude";

  baseURL = baseURL.concat(
    `&starttime=${data.startDate}&endtime=${data.endDate}`
  );

  baseURL = baseURL.concat(
    `&latitude=${data.lat}&longitude=${data.lng}&maxradiuskm=${data.searchRadius}&minmagnitude=${data.minMag}&maxmagnitude=${data.maxMag}&limit=${data.resultLimit}`
  );

  return baseURL;
};

const fetchData = async (data: QueryValues) => {
  const url = buildURL(data);

  const response = await fetch(url);
  const res = (await response.json()) as USGSData;

  if (response.status !== 200) {
    throw Error("Fetching data failed");
  }

  return res;
};

export { fetchData };
