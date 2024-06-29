<template>
  <div
    class="pt-4 pb-4 pl-2 pr-2 sm:pt-20 sm:pb-20 sm:pl-20 sm:pr-20 fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center"
  >
    <div class="bg-white rounded-lg p-8 relative w-full h-full overflow-y-auto">
      <div v-if="favorite != null">
        <div v-if="isLoading1" class="flex justify-center items-center">
          <img
            src="../assets/loading-gif.gif"
            alt="Loading gif"
            style="width: 48px; height: 48px"
          />
        </div>
        <div :class="{ hidden: isLoading1 }" class="mx-2 my-4">
          <div>
            <p class="py-2 text-xl text-m truncate ...">
              Favorite list: "{{ favorite.name }}"
            </p>
            <Accordion>
              <AccordionItem class="bg-gray border rounded mb-2">
                <template v-slot:title> Current restaurant </template>
                <template v-slot:content>
                  <div>
                    <div v-if="currentRestaurants.length > 0">
                      <div
                        v-for="(restaurant, index) in currentRestaurants"
                        :key="index"
                      >
                        <Accordion>
                          <AccordionItem>
                            <template v-slot:title>
                              <div
                                class="flex items-center justify-between border-b py-2"
                              >
                                <p class="text-m truncate ...">
                                  {{ restaurant.name }}
                                </p>
                                <button
                                  @click="
                                    removeRestaurantInCurrentFavorite(
                                      restaurant,
                                    )
                                  "
                                  class="ml-3 mr-8 bg-red-400 hover:bg-red-500 text-white font-bold py-0.5 px-2.5 rounded-full"
                                >
                                  -
                                </button>
                              </div>
                            </template>
                            <template v-slot:content>
                              <router-link :to="`/restaurant/${restaurant.id}`">
                                <img
                                  :src="restaurant.pictures[0]"
                                  alt="Restaurant Image"
                                  class="w-full h-40 object-cover mx-auto mb-4"
                                />
                              </router-link>
                              <p>{{ restaurant.address }}</p>
                              <p>{{ restaurant.tel }}</p>
                              <div class="info-container">
                                <p
                                  v-for="genre in restaurant.genres"
                                  :key="genre"
                                >
                                  {{ genre }}
                                </p>
                                <p>{{ "$".repeat(restaurant.price_range) }}</p>
                              </div>
                              <div
                                class="mt-4 grid grid-cols-2 gap-4 justify-between"
                              >
                                <div>
                                  <star-rating
                                    class="rating"
                                    :rating="restaurant.rating"
                                    :show-rating="false"
                                    :read-only="true"
                                  ></star-rating>
                                </div>
                                <div>
                                  <button
                                    class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4 ml-2"
                                    @click="
                                      changePage('/restaurant/' + restaurant.id)
                                    "
                                  >
                                    Go to restaurant page
                                  </button>
                                </div>
                              </div>
                            </template>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                    <div v-else>
                      <p>No restaurant yet in the list</p>
                    </div>
                  </div>
                </template>
              </AccordionItem>
              <AccordionItem class="bg-gray border rounded mb-2">
                <template v-slot:title> Search restaurant </template>
                <template v-slot:content>
                  <div>
                    <input
                      type="text"
                      v-model="searchTerm"
                      @input="searchRestaurantByName"
                      class="border border-gray-400 rounded-lg py-2 px-3 mb-4"
                      placeholder="Search"
                    />
                    <div v-if="searchResults.length > 0" class="mt-2">
                      <div
                        v-for="(result, index) in searchResults"
                        :key="index"
                        class="flex items-center justify-between border-b py-2"
                      >
                        <p class="text-m truncate ...">{{ result.name }}</p>
                        <button
                          v-if="!result.alreadyInList"
                          @click="addRestaurantToCurrentFavorite(result)"
                          class="bg-green-400 hover:bg-green-500 text-white font-bold py-0.5 px-2 rounded-full"
                        >
                          +
                        </button>
                        <button
                          v-if="result.alreadyInList"
                          @click="removeRestaurantInCurrentFavorite(result)"
                          class="bg-red-400 hover:bg-red-500 text-white font-bold py-0.5 px-2.5 rounded-full"
                        >
                          -
                        </button>
                      </div>
                    </div>
                    <div v-else>
                      <p>No results found</p>
                    </div>
                  </div>
                </template>
              </AccordionItem>
              <AccordionItem class="bg-gray border rounded mb-2">
                <template v-slot:title> Options </template>
                <template v-slot:content>
                  <div>
                    <div>
                      <form @submit.prevent="updateName">
                        <p class="py-2">Update list's name:</p>
                        <input
                          type="text"
                          v-model="updatedListName"
                          class="border border-gray-400 rounded-lg py-2 px-3 mb-4"
                          placeholder="Enter name"
                        />
                        <button
                          type="submit"
                          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4 ml-2"
                        >
                          Update
                        </button>
                      </form>
                      <hr class="py-2 border-gray-400" />

                      <div class="flex">
                        <p class="py-2 mr-2">Delete list:</p>
                        <button
                          @click="deleteListFromModal()"
                          class="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        >
                          <svg
                            class="w-6 h-6"
                            fill="#000000"
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 408.483 408.483"
                            xml:space="preserve"
                          >
                            <!-- https://www.svgrepo.com/svg/78963/rubbish-bin?edit=true -->
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <g>
                                <g>
                                  <path
                                    d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316 H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293 c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329 c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355 c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356 c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"
                                  ></path>
                                  <path
                                    d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916 c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </AccordionItem>
            </Accordion>
          </div>
          <button
            @click="closeModal()"
            class="absolute top-0 right-0 bg-gray-500 hover:bg-gray-600 text-white font-bold py-0.25 px-2 rounded-full mt-2 mr-2"
          >
            &times;
          </button>
        </div>
      </div>

      <div v-else>
        <div v-if="isLoading2" class="flex justify-center items-center">
          <img
            src="../assets/loading-gif.gif"
            alt="Loading gif"
            style="width: 48px; height: 48px"
          />
        </div>
        <div v-else>
          <form @submit.prevent="create">
            <input
              type="text"
              v-model="newFavoriteName"
              class="border border-gray-400 rounded-lg py-2 px-3 mb-4"
              placeholder="Enter name"
            />
            <button
              type="submit"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4 ml-2"
            >
              Create
            </button>
          </form>
          <button
            @click="closeModal()"
            class="absolute top-0 right-0 bg-gray-500 hover:bg-gray-600 text-white font-bold py-0.25 px-2 rounded-full mt-2 mr-2"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import Accordion from "./Accordion.vue";
import AccordionItem from "./AccordionItem.vue";
import restaurantService from "@/services/restaurantService.js";
import favoritesService from "@/services/favoritesService.js";
import StarRating from "vue-star-rating";

export default {
  components: {
    StarRating,
    Accordion,
    AccordionItem,
  },
  props: {
    favorite: {
      type: Object,
    },
    closeModal: {
      type: Function,
      required: true,
    },
    createList: {
      type: Function,
      required: true,
    },
    deleteList: {
      type: Function,
      required: true,
    },
    updateListName: {
      type: Function,
      required: true,
    },
    setRestaurant: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isLoading1: false,
      isLoading2: false,
      newFavoriteName: "",
      updatedListName: this.favorite ? this.favorite.name : "",
      searchTerm: "",
      searchResults: [],
      currentRestaurants: [],
    };
  },
  async created() {
    if (this.favorite == null) return;
    this.isLoading1 = true;
    try {
      let temp = [];
      for (const restaurant of this.favorite.restaurants) {
        const data = await restaurantService.getRestaurant(restaurant.id);
        temp.push({
          id: restaurant.id,
          name: data.name,
          address: data.address,
          tel: data.tel,
          genres: data.genres,
          price_range: data.price_range,
          rating: data.rating,
          pictures: data.pictures,
        });
      }

      this.currentRestaurants = temp;
      this.isLoading1 = false;
    } catch {
      const toast = useToast();
      toast.error("Could not fetch the list content");
    }
  },
  methods: {
    async create() {
      if (this.newFavoriteName === "") {
        const toast = useToast();
        toast.error("Give a name to the list");
      } else {
        this.isLoading2 = true;
        const response = await this.createList(this.newFavoriteName);
        if (response == true) {
          const toast = useToast();
          toast.success("New list created");
          this.newFavoriteName = "";
        }
        this.isLoading2 = false;
      }
    },
    async deleteListFromModal() {
      this.isLoading1 = true;
      const response = await this.deleteList();
      if (response == true) {
        const toast = useToast();
        toast.success("List was deleted");
      }
      this.isLoading1 = false;
      this.closeModal();
    },
    async updateName() {
      if (this.updatedListName === "") {
        const toast = useToast();
        toast.error("Give a name to the list");
      } else {
        this.isLoading1 = true;
        const response = await this.updateListName(this.updatedListName);
        if (response == true) {
          const toast = useToast();
          toast.success("List was updated with new name");
        } else {
          this.updatedListName = this.favorite.name;
        }
        this.isLoading1 = false;
      }
    },
    async addRestaurantToCurrentFavorite(restaurant) {
      this.isLoading1 = true;
      try {
        const data = await favoritesService.addToFavorite(
          this.favorite.id,
          restaurant.id,
        );
        this.setRestaurant(data.restaurant);

        const data_resto = await restaurantService.getRestaurant(restaurant.id);
        this.currentRestaurants.push({
          id: restaurant.id,
          name: data_resto.name,
          address: data_resto.address,
          tel: data_resto.tel,
          genres: data_resto.genres,
          price_range: data_resto.price_range,
          rating: data_resto.rating,
          pictures: data_resto.pictures,
        });

        let i = this.searchResults.findIndex((e) => e.id === restaurant.id);
        if (i != -1) this.searchResults[i].alreadyInList = true;
      } catch {
        const toast = useToast();
        toast.error("Could not add to the list");
      }
      this.isLoading1 = false;
    },
    async removeRestaurantInCurrentFavorite(restaurant) {
      this.isLoading1 = true;
      try {
        const data = await favoritesService.deleteToFavorite(
          this.favorite.id,
          restaurant.id,
        );

        this.setRestaurant(data.restaurant);

        let i = this.currentRestaurants.findIndex(
          (e) => e.id === restaurant.id,
        );
        if (i != -1) this.currentRestaurants.splice(i, 1);

        let i2 = this.searchResults.findIndex((e) => e.id === restaurant.id);
        if (i2 != -1) this.searchResults[i2].alreadyInList = false;
      } catch {
        const toast = useToast();
        toast.error("Could not remove from the list");
      }
      this.isLoading1 = false;
    },
    async showFavoriteRestoInfo(restaurant) {
      this.isLoading1 = true;
      try {
        let temp = [];
        const data = await restaurantService.getRestaurant(restaurant.id);
        temp.push({
          id: restaurant.id,
          name: data.name,
          address: data.address,
          tel: data.tel,
          genres: data.genres,
          price_range: data.price_range,
          rating: data.rating,
          pictures: data.pictures,
        });
        return temp[0];
      } catch {
        const toast = useToast();
        toast.error("Could not fetch restaurant info");
      }
      this.isLoading1 = false;
    },
    changePage(href) {
      this.$router.push(href);
    },
    async searchRestaurantByName() {
      if (this.searchTerm.trim() === "") {
        this.searchResults = [];
        return;
      }
      try {
        const response = await restaurantService.searchRestaurant(
          this.searchTerm,
          6,
        );
        let temp = [];
        for (const restaurant of response.items) {
          let alreadyInList =
            this.currentRestaurants.findIndex((e) => e.id === restaurant.id) !=
            -1;
          temp.push({
            alreadyInList: alreadyInList,
            id: restaurant.id,
            name: restaurant.name,
          });
        }
        this.searchResults = temp;
        console.log(response);
      } catch (error) {
        console.error("Error while searching for restaurants:", error);
        this.searchResults = [];
      }
    },
  },
};
</script>
