import { useState } from "react";
import SearchForm from "@/components/home/SearchForm";
import Map from "@/components/home/Map";
import { USGSData } from "@/types/USGS";

export default function Home() {
  const [searchRadius, setSearchRadius] = useState<number>(3000);
  const [pinPosition, setPinPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [data, setData] = useState<USGSData | null>(null);

  return (
    <main className="flex flex-col md:flex-row">
      <SearchForm
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
        pinPosition={pinPosition}
        setData={setData}
      />
      <div className="grow h-[75vh] md:h-screen">
        <Map
          pinPosition={pinPosition}
          setPinPosition={setPinPosition}
          searchRadius={searchRadius}
          data={data}
        />
      </div>
    </main>
  );
}
