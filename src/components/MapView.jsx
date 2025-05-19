import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmFvbDUyOCIsImEiOiJjbWF0c2l4c2YwYjVhMmtxeHlkYWtxb21hIn0.Sq4AN9lBtwyqcCmlOprAYg";

export default function MapView({ latitude, longitude, location }) {
  return (
    <div className="h-full w-full rounded overflow-hidden">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude,
          latitude,
          zoom: 15,
        }}
        mapStyle="mapbox://styles/naol528/cmaumgyjx001u01sdagd6c5e3"
        style={{ width: "100%", height: "100%" }}
      >
        <Marker
          latitude={latitude}
          longitude={longitude}
          color="red"
          className="text-foreground bg-background"
        />
        <Popup latitude={latitude} longitude={longitude} closeButton={false}>
          {location}
        </Popup>
      </Map>
    </div>
  );
}
