import * as React from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import supabase from "@/services/supabase";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmFvbDUyOCIsImEiOiJjbWF0c2l4c2YwYjVhMmtxeHlkYWtxb21hIn0.Sq4AN9lBtwyqcCmlOprAYg";

export default function MapView({ order, product }) {
  const mapRef = React.useRef();
  const [lat, setLat] = React.useState(order.latitude); // Buyer
  const [lng, setLng] = React.useState(order.longitude);
  const [prodLat, setProdLat] = React.useState(null); // Product
  const [prodLng, setProdLng] = React.useState(null);
  const [route, setRoute] = React.useState(null);
  const [distance, setDistance] = React.useState(null);

  const [viewState, setViewState] = React.useState({
    latitude: order.latitude,
    longitude: order.longitude,
    zoom: 12,
  });

  // Automatically fit the bounds when both locations are known
  React.useEffect(() => {
    if (lat && lng && prodLat && prodLng && mapRef.current) {
      const bounds = [
        [Math.min(lng, prodLng), Math.min(lat, prodLat)],
        [Math.max(lng, prodLng), Math.max(lat, prodLat)],
      ];
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    }
  }, [lat, lng, prodLat, prodLng]);

  // Simulate buyer movement
  React.useEffect(() => {
    let latitude = order.latitude;
    let longitude = order.longitude;

    const interval = setInterval(() => {
      setLat(latitude);
      setLng(longitude);
      setViewState((prev) => ({ ...prev, latitude, longitude }));
      updateBuyerLocation(latitude, longitude);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function updateBuyerLocation(latitude, longitude) {
    await supabase
      .from("orders")
      .update({ latitude, longitude })
      .eq("id", order.id);
  }

  // Subscribe to product location updates
  React.useEffect(() => {
    if (!product) return;

    const fetchInitialLocation = async () => {
      const { data } = await supabase
        .from("products")
        .select("latitude, longitude")
        .eq("id", product)
        .single();
      if (data) {
        setProdLat(data.latitude);
        setProdLng(data.longitude);
      }
    };

    fetchInitialLocation();

    const channel = supabase
      .channel("realtime:products")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${product}`,
        },
        (payload) => {
          const { latitude, longitude } = payload.new;
          setProdLat(latitude);
          setProdLng(longitude);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [product]);

  // Fetch and draw the route
  React.useEffect(() => {
    if (!prodLat || !prodLng || !lat || !lng) return;

    const fetchRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${prodLng},${prodLat};${lng},${lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry);
        setDistance((data.routes[0].distance / 1000).toFixed(2)); // in kilometers
      }
    };

    fetchRoute();
  }, [prodLat, prodLng, lat, lng]);

  return (
    <div className="h-full w-full rounded overflow-hidden relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/naol528/cmaumgyjx001u01sdagd6c5e3"
        style={{ width: "100%", height: "100%" }}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {/* Buyer Marker */}
        <Marker latitude={lat} longitude={lng} color="red" />
        <Popup latitude={lat} longitude={lng} closeButton={false}>
          Your Location
        </Popup>

        {/* Product Marker */}
        {prodLat && prodLng && (
          <>
            <Marker latitude={prodLat} longitude={prodLng} color="green" />
            <Popup latitude={prodLat} longitude={prodLng} closeButton={false}>
              Product Location
            </Popup>
          </>
        )}

        {/* Route Line */}
        {route && (
          <Source
            id="route"
            type="geojson"
            data={{ type: "Feature", geometry: route }}
          >
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#3b8",
                "line-width": 4,
              }}
            />
          </Source>
        )}
      </Map>

      {/* Distance Display */}
      {distance && (
        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur px-4 py-2 rounded-lg shadow border">
          <p className="text-sm font-medium">Distance: {distance} km</p>
        </div>
      )}
    </div>
  );
}
