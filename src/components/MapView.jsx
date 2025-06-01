import * as React from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import supabase from "@/services/supabase";
import { useToast } from "@/hooks/use-toast";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmFvbDUyOCIsImEiOiJjbWF0c2l4c2YwYjVhMmtxeHlkYWtxb21hIn0.Sq4AN9lBtwyqcCmlOprAYg";

export default function MapView({ order, product }) {
  const mapRef = React.useRef();
  const [lat, setLat] = React.useState(order.latitude);
  const [lng, setLng] = React.useState(order.longitude);
  const [prodLat, setProdLat] = React.useState(null);
  const [prodLng, setProdLng] = React.useState(null);
  const [route, setRoute] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const { toast } = useToast();
  const [viewState, setViewState] = React.useState({
    latitude: order.latitude,
    longitude: order.longitude,
    zoom: 12,
  });

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

  React.useEffect(() => {
    let watchId;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log("Buyer location:", coords);
        setLat(coords.latitude);
        setLng(coords.longitude);
        updateBuyerLocation(coords.latitude, coords.longitude);

        watchId = navigator.geolocation.watchPosition(
          ({ coords }) => {
            setLat(coords.latitude);
            setLng(coords.longitude);
            updateBuyerLocation(coords.latitude, coords.longitude);
          },
          (error) =>
            toast({
              title: "Geolocation Error",
              description:
                error.message ||
                "Error tracking your location. Please check permissions.",
            }),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      },
      (error) => {
        console.error("Geolocation permission denied or error:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  async function updateBuyerLocation(latitude, longitude) {
    await supabase
      .from("orders")
      .update({ latitude, longitude })
      .eq("id", order.id);
  }

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!prodLat || !prodLng || !lat || !lng) return;

    const fetchRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${prodLng},${prodLat};${lng},${lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry);
        setDistance((data.routes[0].distance / 1000).toFixed(2));
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
        onLoad={() => setIsMapLoaded(true)}
      >
        <Marker latitude={lat} longitude={lng} color="red" />
        <Popup latitude={lat} longitude={lng} closeButton={false}>
          Me
        </Popup>

        {prodLat && prodLng && (
          <>
            <Marker latitude={prodLat} longitude={prodLng} color="green" />
            <Popup latitude={prodLat} longitude={prodLng} closeButton={false}>
              Product
            </Popup>
          </>
        )}

        {isMapLoaded && route && (
          <Source
            id="route"
            type="geojson"
            data={{ type: "Feature", geometry: route }}
          >
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#00b894",
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
