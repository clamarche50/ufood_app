<template>
  <div>
    <div class="w-full mt-4 relative">
      <div
        v-if="showRoute"
        class="leaflet-top leaflet-right absolute top-0 right-0 mt-4 mr-4 p-4 rounded bg-white bg-opacity-50 backdrop-blur-md"
      >
        <p>
          <strong>Duration:</strong> {{ routeTime }}
          <br />
          <strong>Distance:</strong> {{ routeDistance }}
        </p>
      </div>
      <div id="map" class="h-96 z-0"></div>
      <button
        id="btn"
        class="absolute bottom-4 left-4 bg-white bg-opacity-50 hover:bg-opacity-75 text-slate-900 hover:text-slate-800 px-2 py-1 rounded cursor-not-allowed flex items-center"
        @click="toggleRoute"
      >
        <img
          v-if="showRoute"
          :src="showDestinationIcon"
          alt="Show destination"
          class="h-5 w-10"
        />
        <img
          v-else
          :src="showRouteIcon"
          alt="Show Route"
          class="h-6 w-6 mr-2"
        />
        <span>{{ showRoute ? "Show Destination" : "Show Route" }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import { useToast } from "vue-toastification";
import customMarkerIconDestLoc from "@/assets/marker2.png"
import customMarkerIconCurLoc from "@/assets/marker3.png"
import showRouteIcon from '@/assets/location-arrow-solid.svg'
import showDestinationIcon from '@/assets/location-pin-solid.svg'

export default {
  name: "MapWithDirection",
  props: {
    dstLocation: {
      type: Object,
      default: null,
      latitude: 46.7102778,
      longitude: -71.2908333,
    },
  },
  data() {
    return {
      userLocation: null,
      map: null,
      controller: null,
      showRoute: false,
      routeTime: "N/A",
      routeDistance: "N/A",
      showDestinationIcon: showDestinationIcon,
      showRouteIcon: showRouteIcon
    };
  },
  mounted() {
    this.getUserLocation(false);
    this.initMap();
  },
  methods: {
    getUserLocation(showPopUpOnError, showPopUpOnNotSupported) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            document
              .getElementById("btn")
              .classList.remove("cursor-not-allowed");
          },
          (error) => {
            if (showPopUpOnError) {
              const toast = useToast();
              toast.error("Couldn't get user's location")
            }
          },
        );
      } else {
        if (showPopUpOnNotSupported) {
          const toast = useToast()
          toast.error("Geolocation is not supported by this browser")
        }
      }
    },
    initMap() {
      this.map = L.map("map");

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.controller = L.Routing.control({
        waypoints: [
          L.latLng(this.dstLocation.latitude, this.dstLocation.longitude),
        ],
        routeWhileDragging: false,
        createMarker: (waypointIndex, waypoint, number, isVia) =>
          this.createCustomMarker(waypointIndex, waypoint),
      }).addTo(this.map);

      this.controller.on("routesfound", (e) => {
        var routes = e.routes;
        var summary = routes[0].summary;
        this.routeDistance =
          Math.round(summary.totalDistance / 1000).toFixed(2) + " km";
        const d = Number(summary.totalTime);
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        this.routeTime =
          (h > 0 ? h + " h " + (m < 10 ? "0" : "") : "") + m + " min";
      });

      // Initial view focused on destination
      this.focusMapDestination();
    },
    createCustomMarker(waypointIndex, waypoint) {
      let markerIcon;

      if (this.showRoute) {
        if (waypointIndex === 0) {
          // Current location point
          markerIcon = L.icon({
            iconUrl: customMarkerIconCurLoc,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
          });
        } else {
          // Destination point
          markerIcon = L.icon({
            iconUrl: customMarkerIconDestLoc,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
          });
        }
      } else {
        // No route shown, use destination point icon
        markerIcon = L.icon({
          iconUrl: customMarkerIconDestLoc,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
        });
      }

      const marker = L.marker(waypoint.latLng, {
        icon: markerIcon,
        draggable: false,
      });

      return marker;
    },
    focusMapDestination() {
      const bounds = L.latLngBounds([
        [this.dstLocation.latitude, this.dstLocation.longitude],
      ]);
      this.map.fitBounds(bounds, { maxZoom: 15 });
    },
    focusMapOnBoth() {
      const bounds = L.latLngBounds([
        [this.userLocation.latitude, this.userLocation.longitude],
        [this.dstLocation.latitude, this.dstLocation.longitude],
      ]);
      this.map.fitBounds(bounds);
    },
    toggleRoute() {
      if (this.userLocation == null) {
        this.getUserLocation(true);
        return;
      }

      this.showRoute = !this.showRoute;

      if (this.showRoute) {
        // Show the route
        this.controller.setWaypoints([
          L.latLng(this.userLocation.latitude, this.userLocation.longitude),
          L.latLng(this.dstLocation.latitude, this.dstLocation.longitude),
        ]);
        this.focusMapOnBoth();
      } else {
        // Hide the route
        this.controller.setWaypoints([
          L.latLng(this.dstLocation.latitude, this.dstLocation.longitude),
        ]);
        this.focusMapDestination();
      }
    },
  },
};
</script>

<style>
.leaflet-routing-container {
  display: none !important; /*to hide the instructions on the map*/
}
</style>
