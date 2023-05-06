import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import SearchForm from "@/components/home/SearchForm";
import Map from "@/components/home/Map";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row">
      <SearchForm />
      <div className="grow h-[75vh] md:h-screen">
        <Map />
      </div>
    </main>
  );
}
