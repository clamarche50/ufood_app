<template>
  <div class="overlay">
    <div class="modal-content">
      <ul>
        <li
          v-for="list in favoriteLists"
          :key="list.id"
          class="flex justify-between items-center mb-2"
        >
          <span>{{ list.name }}</span>
          <button
            @click="toggleRestaurantInList(list)"
            :class="{
              'bg-green-400 hover:bg-green-500': !isRestaurantInList(list),
              'bg-red-400 hover:bg-red-500': isRestaurantInList(list),
            }"
            class="text-white font-bold py-0.5 px-2 rounded-full transition-colors duration-200"
          >
            {{ isRestaurantInList(list) ? "-" : "+" }}
          </button>
        </li>
      </ul>
      <button @click="closeModal" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script>
import userService from "@/services/userService.js";
import favoritesService from "@/services/favoritesService.js";

export default {
  props: ["userId", "restaurantId"],
  data() {
    return {
      favoriteLists: [],
    };
  },
  methods: {
    async fetchFavoriteLists() {
      try {
        const response = await userService.getUserFavorites(this.userId, 0);
        if (response.items && Array.isArray(response.items)) {
          this.favoriteLists = response.items.map((list) => ({
            ...list,
            restaurants: Array.isArray(list.restaurants)
              ? list.restaurants.map((restaurant) => restaurant.id)
              : [],
          }));
        }
      } catch (error) {
        console.error("Error fetching favorite lists:", error);
      }
    },
    isRestaurantInList(list) {
      return list.restaurants.includes(this.restaurantId);
    },
    async toggleRestaurantInList(list) {
      if (this.isRestaurantInList(list)) {
        try {
          await favoritesService.deleteToFavorite(list.id, this.restaurantId);
          const listIndex = this.favoriteLists.findIndex(
            (item) => item.id === list.id,
          );
          this.favoriteLists[listIndex].restaurants = this.favoriteLists[
            listIndex
          ].restaurants.filter((id) => id !== this.restaurantId);
        } catch (error) {
          console.error("Error removing restaurant from list:", error);
        }
      } else {
        try {
          await favoritesService.addToFavorite(list.id, this.restaurantId);
          const listIndex = this.favoriteLists.findIndex(
            (item) => item.id === list.id,
          );
          this.favoriteLists[listIndex].restaurants.push(this.restaurantId);
        } catch (error) {
          console.error("Error adding restaurant to list:", error);
        }
      }
    },
    closeModal() {
      this.$emit("close");
    },
  },
  created() {
    this.fetchFavoriteLists();
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.close-btn {
  display: block;
  margin: 20px auto 0;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
