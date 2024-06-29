<template>
  <div>
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

    <!-- Restaurant List -->
    <div class="flex flex-wrap place-content-center">
      <div
        v-for="restaurant in getVisibleRestaurants"
        :key="restaurant.id"
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4"
      >
        <div
          class="restaurant-card relative border bg-gradient-to-tl from-gray-50 to-gray-100 border-amber-300 border-3.5 p-4 m-4 text-center rounded overflow-hidden bg-gray-750 h-64 transition-transform transform hover:scale-105 cursor-pointer"
        >
          <router-link :to="`/restaurant/${restaurant.id}`">
            <img
              :src="restaurant.pictures[0]"
              alt="Restaurant Image"
              class="w-full h-40 object-cover mx-auto mb-4"
          /></router-link>
          <button @click="changePage('/' + restaurant.name)">
            {{ restaurant.name }}
          </button>
          <div v-if="isLoggedIn">
            <button
              class="mb-2 text-3xl text-amber-600"
              @click="openOverlay(restaurant.id, restaurant.name)"
            >
              {{ isRestaurantVisited(restaurant.id) ? "⚑" : "⚐" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <ReviewModal
      :isOpen="isOverlayOpen"
      :restaurantId="currentRestaurantId"
      :restaurantName="currentRestaurantName"
      @close="isOverlayOpen = false"
      :handleReviewSubmit="handleReviewSubmit"
    />

    <!-- Show More Button -->
    <div
      v-if="getVisibleRestaurants.length < getFilteredRestaurants.length"
      class="flex justify-center mt-4"
    >
      <button @click="showMoreRestaurants" class="btn-primary">
        Show More
      </button>
    </div>
  </div>
</template>

<script>
import Restaurant from "@/model/restaurant";
import ReviewModal from "./ReviewModal.vue";
import visitsService from "@/services/visitsService";
import auth from "@/services/authService.js";
import { useToast } from "vue-toastification";
import userService from "@/services/userService.js";
import { UNSECURE_ENDPOINT } from "@/utils/endpoints";
import authService from "@/services/authService.js";

export default {
  components: {
    ReviewModal,
  },
  data() {
    return {
      // Restaurant data
      restaurants: [],
      searchInput: "",
      visibleRestaurantsCount: 8,
      showFilterMenu: false,
      selectedPrice: "",
      selectedGenre: "",
      isLoggedIn: auth.isAuthenticated(),
      userInfo: null,

      // overlay data
      isOverlayOpen: false,
      currentRestaurantId: null,
      currentRestaurantName: "",
      userVisits: [],
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

  mounted() {
    this.fetchRestaurants();
    window.addEventListener("click", this.handleClickOutsideFilterMenu);
  },

  methods: {
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

    isRestaurantVisited(restaurantId) {
      return this.userVisits.some(visit => visit.restaurant_id === restaurantId);
    },

    async fetchUserVisits(userId, page = 0, limit = 100) {
      try {
        const response = await fetch(
          `${UNSECURE_ENDPOINT}/users/${userId}/restaurants/visits?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': authService.getUserToken()
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to get user's visits`);
        }

        const data = await response.json();
        console.log("Data:", data)
        this.userVisits = data.items;
        console.log("User Visits:", this.userVisits);
      } catch (error) {
        console.error("Error:", error.message);
      }
    },

    showMoreRestaurants() {
      this.visibleRestaurantsCount += 8;
    },

    toggleFilterMenu() {
      this.showFilterMenu = !this.showFilterMenu;
    },

    applyFilters() {
      this.visibleRestaurantsCount = 8;
    },

    changePage(href) {
      this.$router.push(href);
    },
    openOverlay(restaurantId, restaurantName) {
      this.currentRestaurantId = restaurantId;
      this.currentRestaurantName = restaurantName;
      this.isOverlayOpen = true;
    },
    async handleReviewSubmit(review) {
      try {
        await visitsService.addUserVisitsAtRestaurant(
          this.userInfo.id,
          review.restaurantId,
          review.comment,
          review.rating,
          review.visitDate,
        );
        await this.fetchUserVisits(this.userInfo.id);
        this.isOverlayOpen = false;
        return true
      } catch(e) {
        return false
      }
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

  async created() {

    if (this.isLoggedIn) {
      this.isLoading = true;
      const id = await auth.getUserId();
      if (id != null) {
        try {
          this.userInfo = await userService.getUser(id);
          this.isLoading = false;
        } catch (e) {
          console.log(e);
          const toast = useToast();
          toast.error("Could not get user's information");
        }
      } else {
        const toast = useToast();
        toast.error("Could not get user's id");
      }
      await this.fetchUserVisits(this.userInfo.id);
    }
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  @apply text-white bg-gradient-to-r from-amber-400 to-amber-300 hover:bg-gradient-to-l focus:ring-4 focus:outline-none
  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  @apply text-white bg-gradient-to-r from-gray-400 to-gray-300 hover:bg-gradient-to-l focus:ring-4 focus:outline-none
  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2;
}
.btn-secondary:hover {
  background-color: #bbb;
}
</style>
