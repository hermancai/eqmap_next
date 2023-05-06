import { useState } from "react";
import SearchForm from "@/components/home/SearchForm";
import Map from "@/components/home/Map";

export default function Home() {
  const [searchRadius, setSearchRadius] = useState<number>(3000);
  const [pinPosition, setPinPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  return (
    <main className="flex flex-col md:flex-row">
      <SearchForm
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
        pinPosition={pinPosition}
      />
      <div className="grow h-[75vh] md:h-screen">
        <Map
          pinPosition={pinPosition}
          setPinPosition={setPinPosition}
          searchRadius={searchRadius}
        />
      </div>
    </main>
  );
}
