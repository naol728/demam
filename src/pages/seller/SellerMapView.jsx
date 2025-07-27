import * as React from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import supabase from "@/services/supabase";
import { Badge } from "@/components/ui/badge";

const MAPBOX_TOKEN = import.meta.env.MAPBOX_TOKEN;

export default function SellerMapView({
  order,
  product,
  prodyuctlat,
  productlng,
}) {
  const mapRef = React.useRef();
  const [orderlat, setOrderLat] = React.useState(order.latitude);
  const [orderlng, setOrderLng] = React.useState(order.longitude);
  const [productLat, setProductLat] = React.useState(prodyuctlat);
  const [productLng, setProductLng] = React.useState(productlng);
  const [route, setRoute] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const [viewState, setViewState] = React.useState({
    latitude: order.latitude,
    longitude: order.longitude,
    zoom: 12,
  });
  console.log(orderlat, orderlng, productLat, productLng);
  React.useEffect(() => {
    if (orderlat && orderlng && productLat && productLng && mapRef.current) {
      const bounds = [
        [Math.min(orderlng, productLng), Math.min(productLat, orderlat)],
        [Math.max(orderlng, productLng), Math.max(productLat, orderlat)],
      ];
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    }
  }, [orderlat, orderlng, productLat, productLng]);

  React.useEffect(() => {
    let watchId;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setProductLat(coords.latitude);
        setProductLng(coords.longitude);
        updateProductLocation(coords.latitude, coords.longitude);

        watchId = navigator.geolocation.watchPosition(
          ({ coords }) => {
            setProductLat(coords.latitude);
            setProductLng(coords.longitude);
            updateProductLocation(coords.latitude, coords.longitude);
          },
          (error) => console.error("Geolocation error during tracking:", error),
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
  }, [product]);

  async function updateProductLocation(latitude, longitude) {
    await supabase
      .from("products")
      .update({ latitude, longitude })
      .eq("id", product);
  }

  React.useEffect(() => {
    const fetchInitialLocation = async () => {
      const { data } = await supabase
        .from("orders")
        .select("latitude, longitude")
        .eq("id", order.id)
        .single();
      if (data) {
        setOrderLat(data.latitude);
        setOrderLng(data.longitude);
      }
    };

    fetchInitialLocation();

    const channel = supabase
      .channel("realtime:orders")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrderLat(payload.new.latitude);
          setOrderLng(payload.new.longitude);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [product]);

  React.useEffect(() => {
    if (!productLat || !productLng || !orderlat || !orderlng) return;

    const fetchRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${productLng},${productLat};${orderlng},${orderlat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.length > 0) {
        setRoute(data.routes[0].geometry);
        setDistance((data.routes[0].distance / 1000).toFixed(2));
      }
    };

    fetchRoute();
  }, [productLat, productLng, orderlat, orderlng]);

  return (
    <div className="relative h-full min-h-screen w-full bg-white dark:bg-gray-950 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/naol528/cmaumgyjx001u01sdagd6c5e3"
        style={{ width: "100%", height: "100%" }}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={() => setIsMapLoaded(true)}
      >
        <Marker latitude={orderlat} longitude={orderlng} color="green" />
        <Popup latitude={orderlat} longitude={orderlng} closeButton={false}>
          <p className="text-sm font-semibold text-green-700">Order</p>
        </Popup>

        {productLat && productLng && (
          <>
            <Marker latitude={productLat} longitude={productLng} color="red" />
            <Popup
              latitude={productLat}
              longitude={productLng}
              closeButton={false}
            >
              <p className="text-sm font-semibold text-red-700">Me</p>
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
                "line-width": 5,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}
      </Map>

      {distance && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2">
          <Badge variant="secondary" className="text-base font-medium">
            Distance: {distance} km
          </Badge>
        </div>
      )}
    </div>
  );
}
