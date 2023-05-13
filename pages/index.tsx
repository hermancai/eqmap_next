import { useEffect, useState } from "react";
import SearchForm from "@/components/home/SearchForm";
import Map from "@/components/home/Map";
import DataTable from "@/components/home/DataTable";
import { EarthquakeData, USGSData } from "@/types/USGS";

export type SelectedRows = {
  [key: EarthquakeData["id"]]: boolean;
};

export default function Home() {
  const [searchRadius, setSearchRadius] = useState<number>(3000);
  const [pinPosition, setPinPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  // Need to separate from pinPosition to prevent panning on pin move
  const [searchedCenter, setSearchedCenter] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [data, setData] = useState<USGSData | null>(null);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>({});

  useEffect(() => {
    if (data === null) {
      return setSelectedRows({});
    }

    const newSelectedRows: SelectedRows = {};
    data.features.forEach((entry) => {
      newSelectedRows[entry.id] = false;
    });

    setSelectedRows(newSelectedRows);
  }, [data]);

  const toggleSelectedRow = (id: EarthquakeData["id"]) => {
    setSelectedRows((prev) => {
      return { ...prev, [id]: !prev[id] };
    });
  };

  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <SearchForm
          searchRadius={searchRadius}
          setSearchRadius={setSearchRadius}
          pinPosition={pinPosition}
          setSearchedCenter={setSearchedCenter}
          data={data}
          setData={setData}
        />
        <div className="grow h-[75vh] md:h-auto">
          <Map
            pinPosition={pinPosition}
            setPinPosition={setPinPosition}
            searchedCenter={searchedCenter}
            searchRadius={searchRadius}
            data={data}
            selectedRows={selectedRows}
            toggleSelectedRow={toggleSelectedRow}
          />
        </div>
      </div>
      {data !== null && data.features.length > 1 ? (
        <DataTable
          entries={data.features}
          selectedRows={selectedRows}
          toggleSelectedRow={toggleSelectedRow}
        />
      ) : null}
    </main>
  );
}
