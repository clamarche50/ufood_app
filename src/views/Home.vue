<template>
  <div>
    <div>
    <!-- Home Section -->
    <div class="bg-amber-400 text-white py-16">
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div class="flex flex-col items-center md:items-start md:text-left">
          <h1 class="text-5xl md:text-9xl mb-4 font-extrabold">Welcome</h1>
          <h1 class="text-5xl md:text-9xl mb-8">to UFood</h1>
          <p class="text-lg md:text-xl mb-8 text-justify p-4">
            Discover the finest dining experience with UFood. We bring you a wide selection of restaurant to satisfy your cravings.
          </p>
        </div>

      <div class="flex justify-center items-center md:pl-64 ">
        <img src="../assets/UFood1.png" alt="UFood Logo" class="object-cover md:w-auto rounded-3xl pb-2 p-4" />
      </div>
    </div>
</div>

      <!-- About Us Section -->
      <div class="bg-white py-16">
        <div class="container mx-auto text-center">
          <h2 class="text-3xl md:text-5xl font-bold mb-8">About Us</h2>
          <p class="text-lg md:text-xl mb-8">
            UFood is not just an app; it's an experience. Our passion for diverse cuisine brings us together.
            With a diverse selection of restaurants, we aim to bring you the best dining experience.
          </p>
        </div>
      </div>

      <div v-if="isLoggedIn">
      <!-- Selection Section -->
      <div class=" from-amber-400 to-amber-300 bg-gradient-to-t py-16">
        <div class="container mx-auto text-center">
          <h2 class="text-white text-3xl md:text-5xl font-bold mb-8">Search a Restaurant</h2>
          <p class="text-white text-lg md:text-xl mb-8">
            To facilitate your search, we offer a wide selection of restaurants.You can either choose to search from a
            list, where you can filter by price range and genre or use the map to see restaurant near you.
          </p>
        </div>
        <div class="flex mt-4 justify-center items-center">
          <div class="flex">
            <button @click="toggleView('list')" :class="{ 'bg-gradient-to-r from-gray-100 to-gray-200': currentView === 'list', 'hover:bg-gradient-to-l': currentView === 'list' }" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Show list</button>
          </div>
          <div class="flex">
            <button @click="toggleView('map')" :class="{ 'bg-gradient-to-r from-gray-100 to-gray-200': currentView === 'map', 'hover:bg-gradient-to-l': currentView === 'map' }" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Show map</button>
          </div>
        </div>
      </div>
    </div>

      <!-- For non-logged-in users -->
      <div v-else class="from-amber-400 to-amber-300 bg-gradient-to-t py-16">
        <div class="container mx-auto text-center">
          <h2 class="text-3xl md:text-5xl font-bold mb-8">Start Browsing</h2>
          <p class="text-lg md:text-xl mb-8">
            Log into your profile to start browsing our restaurant selection!
          </p>
          <button
            @click="changePage('/user')"
            class="btn-third">Login</button>
        </div>
      </div>

      <MapWithList
        v-if="currentView === 'map'"
        v-bind:dstLocation="this.location"
        class="lg:pl-48 lg:pr-48 pb-5 xl:pl-80 xl:pr-80"
      />

    </div>
    <RestaurantList
    v-if="currentView === 'list'"
    />
  </div>
</template>

<script>
import RestaurantList from '@/components/RestaurantList.vue';
import MapWithList from "@/components/MapWithList.vue";
import auth from "@/services/authService";
export default {
  components: {
    MapWithList,
    RestaurantList,
  },
  data() {
    return {
      isLoggedIn: auth.isAuthenticated(),
      location: {
        latitude: "46.7102778",
        longitude: "-71.2908333",
      },
      currentView: auth.isAuthenticated()? 'list' : '',
    };
  },
  methods: {
    changePage(href) {
      this.$router.push(href);
    },
    toggleView(view) {
      this.currentView = view;
    },
  },
};
</script>

<style>
.btn-third {
  @apply text-white bg-gradient-to-r from-red-600 to-red-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none
  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2;
}

.btn-third:hover {
  background-color: #45a049;
}
</style>
