<template>
  <div class="w-full mt-4 relative pb-20">
    <div class="relative">
      <!-- Filter Button -->
      <div class="flex justify-center mb-4 pt-2.5">
        <button
          ref="filterButton"
          @click="toggleFilterMenu"
          class="text-white bg-gradient-to-r from-amber-400 to-amber-300 hover:bg-gradient-to-l focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Filter
        </button>
      </div>

      <!-- Filter Menu -->
      <div
        v-if="showFilterMenu"
        class="absolute top-0 left-0 right-0 mt-16 p-4 bg-white border border-gray-300 rounded shadow-md z-50"
      >
        <label class="block mb-2">Filter by Price:</label>
        <select
          v-model="selectedPrice"
          @change="applyFilters"
          class="p-2 border border-gray-300 rounded w-full mb-2"
        >
          <option value="">All Prices</option>
          <option
            v-for="priceRange in getPriceRanges"
            :key="priceRange"
            :value="priceRange"
          >
            {{ getPriceDisplay(priceRange) }}
          </option>
        </select>
        <label class="block mb-2">Filter by Genre:</label>
        <select
          v-model="selectedGenre"
          @change="applyFilters"
          class="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Genres</option>
          <option v-for="genre in getGenres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchInput"
        placeholder="Search restaurant by name"
        class="p-2 border border-gray-300 rounded w-full"
      />
    </div>
  <div id="map" class="h-96 z-0 pt-15"></div>
  </div>
</template>

<script>
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import { useToast } from "vue-toastification";
import customMarkerIconDestLoc from "@/assets/marker2.png"
import customMarkerIconCurLoc from "@/assets/marker3.png"
import Restaurant from "@/model/restaurant";
import authService from "@/services/authService";

export default {
  name: "MapWithList",
  props: {
    dstLocation: {
      type: Object,
      default: () => ({ latitude: 46.7102778, longitude: -71.2908333 }),
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
      restaurants: [],

      searchInput: "",
      showFilterMenu: false,
      selectedPrice: "",
      selectedGenre: "",
      visibleRestaurantsCount: 130,

      markerLayer: null,
    };
  },
  computed: {
    getFilteredRestaurants() {
      let filtered = this.restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(this.searchInput.toLowerCase()),
      );

      if (this.selectedPrice) {
        filtered = filtered.filter((restaurant) =>
          restaurant.priceRange
            .toString()
            .includes(this.selectedPrice.toString()),
        );
      }

      if (this.selectedGenre) {
        filtered = filtered.filter((restaurant) =>
          restaurant.genres.includes(this.selectedGenre),
        );
      }

      return filtered;
    },

    getVisibleRestaurants() {
      return this.getFilteredRestaurants.slice(0, this.visibleRestaurantsCount);
    },

    getGenres() {
      const uniqueGenres = [
        ...new Set(this.restaurants.flatMap((restaurant) => restaurant.genres)),
      ];
      return uniqueGenres.sort();
    },

    getPriceRanges() {
      const uniquePrices = [
        ...new Set(
          this.restaurants.flatMap((restaurant) => restaurant.priceRange),
        ),
      ];
      return uniquePrices.sort((a, b) => a - b);
    },
  },
  async mounted() {
    await this.fetchRestaurants();
    this.getUserLocation();
  },
  watch: {
    searchInput() {
      this.applyFilters();
    },
    selectedPrice() {
      this.applyFilters();
    },
    selectedGenre() {
      this.applyFilters();
    },
  },
  methods: {
    getUserLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.initMap();
          },
          (error) => {
            const toast = useToast();
            toast.error("Couldn't get user's location");
            this.initMap();
          },
        );
      } else {
        const toast = useToast();
        toast.error("Geolocation is not supported by this browser");
      }
    },
    initMap() {
      this.map = L.map("map", {zoomControl: true,zoom:1,zoomAnimation:false,fadeAnimation:true,markerZoomAnimation:true}).setView([this.userLocation.latitude, this.userLocation.longitude], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.markerLayer = L.layerGroup().addTo(this.map);

      L.marker([this.userLocation.latitude, this.userLocation.longitude], {
        icon: L.icon({
          iconUrl: customMarkerIconDestLoc,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      }).addTo(this.map);

      this.addRestaurantMarkers();
    },

    addRestaurantMarkers() {
      this.markerLayer.clearLayers();

      const visibleRestaurants = this.getVisibleRestaurants;

      visibleRestaurants.forEach(restaurant => {
        const restaurantUrl = `/#/restaurant/${restaurant.id}`;

        const popupContent = `
          <b>${restaurant.name}</b><br>
             ${restaurant.address}<br>
          <a href="#/restaurant/${restaurant.id}" class="restaurant-link">Visit Page</a>
         `;

        const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], {
          icon: L.icon({
            iconUrl: customMarkerIconCurLoc,
            iconSize: [35, 35],
            iconAnchor: [17, 34],
            popupAnchor: [0, -34],
          })
        }).addTo(this.map)
          .bindPopup(popupContent);

        this.markerLayer.addLayer(marker);
      });
    },

      async fetchRestaurants() {
        const optionalParams = {
          limit: 130,
        };

        const url = new URL(
          "https://ufoodapi.herokuapp.com/restaurants",
        );
        Object.keys(optionalParams).forEach((key) =>
          url.searchParams.append(key, optionalParams[key]),
        );

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': authService.getUserToken()
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();

          this.restaurants = data.items.map((data) => new Restaurant(data));
          console.log("Restaurants:", this.restaurants);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      },

    toggleFilterMenu() {
      this.showFilterMenu = !this.showFilterMenu;
    },

    applyFilters() {
      this.visibleRestaurantsCount = 130;
      this.addRestaurantMarkers();
    },

    getPriceDisplay(priceRange) {
      switch (priceRange) {
        case 1:
          return "$";
        case 2:
          return "$$";
        case 3:
          return "$$$";
        case 4:
          return "$$$$";
        case 5:
          return "$$$$$";
        default:
          return "All Prices";
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
