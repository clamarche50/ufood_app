<template>
  <div>
    <div class="bg-gray-100">
      <img
        class="hero object-cover w-full sm:h-32 md:h-52"
        :src="hero"
        alt="hero"
      />
      <div
        class="restaurant-container flex flex-col md:flex-row justify-evenly text-center content-center mb-8 pb-8 pt-8 m-auto shadow-lg"
      >
        <div class="flex flex-col items-center pb-5">
          <div
            :style="{ fontSize: nameSize }"
            class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl xl:text-7xl dark:text-white"
          >
            <div v-for="(line, index) in nameAdjusted" :key="index">
              {{ line }}
            </div>
          </div>
          <div>
            <star-rating
              class="rating"
              :rating="restaurant.rating"
              :show-rating="false"
              :read-only="true"
            ></star-rating>
          </div>
          <div v-if="isLoggedIn" class="pt-4">
            <button
              @click="openAddToFavoriteModal"
              :class="{
                'text-white bg-amber-400': favorite,
                'text-amber-400 border border-amber-400': !favorite,
              }"
              class="hover:bg-amber-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-amber-200 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-amber-300 dark:hover:text-white dark:focus:ring-amber-500 dark:hover:bg-amber-300"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="sr-only">Favorite button</span>
            </button>

            <RestaurantAddFavoriteModal
              v-if="isAddToFavoriteModalOpen && restaurant.id"
              :userId="userInfo.id"
              :restaurantId="restaurant.id"
              @close="isAddToFavoriteModalOpen = false"
            />
            <button
              class="mb-2 text-3xl text-amber-600"
              @click="openOverlay(restaurant.id, restaurant.name)"
            >
              {{ restaurantVisited ? "⚑" : "⚐" }}
            </button>
          </div>
        </div>

        <div class="mb-3 text-gray-600 dark:text-gray-400 text-base xl:text-xl">
          <p>{{ restaurant.address }}</p>
          <p>{{ restaurant.tel }}</p>

          <div class="info-container">
            <p v-for="genre in restaurant.genres" :key="genre">{{ genre }}</p>
            <p>{{ formattedPrice }}</p>
          </div>
        </div>
        <div class="mb-3 text-gray-600 dark:text-gray-400 text-base xl:text-xl">
          <p v-for="(time, day) in restaurant.openingHours" :key="day">
            {{ day }}: {{ time || "Closed" }}
          </p>
        </div>
      </div>

      <MapWithDirection
        v-if="location.latitude !== 0 && location.longitude !== 0"
        :dstLocation="location"
        class="lg:pl-48 lg:pr-48 pb-5 xl:pl-80 xl:pr-80"
      />

      <div class="container flex flex-wrap justify-between max-w-7xl m-auto">
        <div
          class="card"
          v-for="(image, index) in restaurant.pictures"
          :key="index"
        >
          <img :src="image" />
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
  </div>
</template>

<style>
.card {
  width: calc((100% / 3) - 10px);
  height: 25rem;
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.card:hover img {
  transform: scale(1.1);
}

.card:hover {
  transform: scale(1.05);
  z-index: 10;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}

@media (max-width: 1000px) and (min-width: 768px) {
  .card {
    width: calc((100% / 2) - 10px);
  }
}
</style>

<script>
import StarRating from "vue-star-rating";
import MapWithDirection from "@/components/MapWithDirection.vue";
import Restaurant from "@/model/restaurant";
import ReviewModal from "@/components/ReviewModal.vue";
import auth from "@/services/authService.js";
import { useToast } from "vue-toastification";
import userService from "@/services/userService.js";
import RestaurantAddFavoriteModal from "@/components/RestaurantAddFavoriteModal.vue";
import visitsService from "@/services/visitsService";
import authService from "@/services/authService";

export default {
  components: {
    StarRating,
    MapWithDirection,
    ReviewModal,
    RestaurantAddFavoriteModal,
  },
  data() {
    return {
      favorite: false,
      connected: true,
      restaurant: [],
      location: {
        latitude: 0,
        longitude: 0,
      },
      hero: "",
      isLoggedIn: auth.isAuthenticated(),
      userInfo: null,
      isAddToFavoriteModalOpen: false,

      // overlay data
      isOverlayOpen: false,
      currentRestaurantId: null,
      currentRestaurantName: "",
      restaurantVisited: false,
    };
  },
  computed: {
    formattedPrice() {
      return "$".repeat(this.restaurant.price);
    },
    nameSize() {
      const normalSize = 3.8;
      const smallSize = 3;
      const minimumSize = 2;
      const smallLenght = 20;
      const minimumLenght = 30;

      if (this.restaurant?.name?.length > minimumLenght) {
        return minimumSize + "rem";
      } else if (this.restaurant?.name?.length > smallLenght) {
        return smallSize + "rem";
      } else {
        return normalSize + "rem";
      }
    },
    nameAdjusted() {
      if (this.restaurant?.name) {
        return this.restaurant.name.split("-");
      }
      return [];
    },
  },
  async mounted() {
    const restaurantId = this.$route.params.id;

    const RESTAURANT_ENDPOINT =
      "https://ufoodapi.herokuapp.com/restaurants/" + restaurantId;

    const getRestaurantInfo = async () => {
      const response = await fetch(RESTAURANT_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': authService.getUserToken(),
        },
      });
      const restaurantData = await response.json();
      this.restaurant = new Restaurant(restaurantData);
      this.hero = this.restaurant.pictures[0];
      this.location.latitude = this.restaurant.location.coordinates[1];
      this.location.longitude = this.restaurant.location.coordinates[0];
    };

    await getRestaurantInfo();
    if (this.isLoggedIn) {
      await this.isRestaurantVisited();
    }
  },

  methods: {
    openOverlay(restaurantId, restaurantName) {
      this.currentRestaurantId = restaurantId;
      this.currentRestaurantName = restaurantName;
      this.isOverlayOpen = true;
    },
    async handleReviewSubmit(review) {
      try {
        await visitsService.addUserVisitsAtRestaurant(
          this.userInfo.id,
          this.restaurant.id,
          review.comment,
          review.rating,
          review.visitDate,
        );
        this.isRestaurantVisited()
        this.isOverlayOpen = false;
        return true
      } catch (e) {
        return false
      }
    },
    async isRestaurantVisited() {
      console.log("this.userInfo.id", this.userInfo.id);
      console.log("this.restaurant.id", this.restaurant.id);
      let response = await visitsService.getUserVisitsAtRestaurant(this.userInfo.id, this.restaurant.id);
      console.log("response", response);
      if (response.total > 0) {
        this.restaurantVisited = true;
      }
    },
    toggleFavorite() {
      this.favorite = !this.favorite;
    },
    openAddToFavoriteModal() {
      this.isAddToFavoriteModalOpen = true;
    },
  },
  async created() {
    if (this.isLoggedIn) {
      try {
        this.userInfo = await auth.getLoggedUser();
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        const toast = useToast();
        toast.error("Could not get user's information");
      }
    }
  },
};
</script>
