<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <button
        @click="changePage('/')"
        class="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <img src="../assets/UFood2.png" class="h-8" alt="UFood logo" />
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >UFood</span
        >
      </button>
      <div class="flex md:order-2">
        <button
          type="button"
          data-collapse-toggle="navbar-search"
          aria-controls="navbar-search"
          aria-expanded="false"
          class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>
        <div class="relative hidden md:block">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search icon</span>
          </div>
          <form
            id="searchform"
            class="search2"
            method="get"
            action="source.html"
          />
          <input
            type="text"
            v-model="searchQuery"
            @input="searchRestaurants"
            id="search-navbar"
            class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
          <div
            v-if="showDropdownMenu"
            class="absolute top-14 right-0 z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div
              class="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="search-navbar"
            >
              <router-link
                v-for="result in searchResults"
                :key="result.id"
                :to="`/restaurant/${result.id}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {{ result.name }}
              </router-link>
            </div>
          </div>
        </div>
        <button
          data-collapse-toggle="navbar-search"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-search"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      <div
        class="items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative"
      >
        <button
          type="button"
          ref="dropdownUserTrigger"
          class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="w-8 h-8 rounded-full"
            src="../assets/UFood1.png"
            alt="user photo"
          />
        </button>
        <div
          v-if="showDropdownUser"
          ref="dropdownUserContent"
          class="z-50 origin-top-right absolute mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 right-0"
        >
          <div class="px-4 py-2" v-if="isLoggedIn">
            <span class="block text-sm text-gray-900 dark:text-white"
              >Rick Astley</span
            >
            <span
              class="block text-sm text-gray-500 truncate dark:text-gray-400"
              >rick.astley.5@ulaval.ca</span
            >
          </div>
          <ul class="py-1" aria-labelledby="user-menu-button">
            <li v-if="isLoggedIn">
              <button
                @click="changePage('/user')"
                class="hover:text-orange-600 block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Profile
              </button>
            </li>
            <li v-if="!isLoggedIn">
              <button
                @click="changePage('/user')"
                class="hover:text-orange-600 block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Login
              </button>
            </li>
            <li v-if="isLoggedIn">
              <button
                @click="logout()"
                class="hover:text-orange-600 block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-search"
      >
        <div class="relative mt-3 md:hidden">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <button
              @click="changePage('/')"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-600 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Home
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import auth from "@/services/authService.js";
import { onMounted } from "vue";
import { Dropdown } from "flowbite";

export default {
  data() {
    return {
      isLoggedIn: false,
      searchQuery: "",
      searchResults: [],
      showDropdownMenu: false,
      showDropdownUser: false,
    };
  },
  watch: {
    $route(to, from) {
      this.searchQuery = "";
      this.searchResults = [];
      this.showDropdownMenu = false;
    },
  },
  mounted() {
    this.isLoggedIn = auth.isAuthenticated();
    document.addEventListener("click", this.handleClickDropdown);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickDropdown);
  },
  methods: {
    async logout() {
      await auth.logout();
      this.showDropdownUser = false;
      this.isLoggedIn = false;

      if(this.$router.currentRoute._value.path == '/user') {
        this.$router.go();
      } else {
        this.$router.push('/user');
      }
    },
    changePage(href) {
      this.showDropdownUser = false;
      this.$router.push(href);
    },
    isDropDownMenuVisible() {
      if (this.searchQuery.length === 0) {
        this.showDropdownMenu = false;
      } else {
        this.showDropdownMenu = true;
      }
    },
    async searchRestaurants() {
      try {
        const response = await fetch(
          `https://ufoodapi.herokuapp.com/unsecure/restaurants?search=${this.searchQuery}`,
        );
        if (response.ok) {
          const data = await response.json();
          this.isDropDownMenuVisible();
          this.searchResults = data.items.filter((item) =>
            item.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
          );
        } else {
          console.error("Failed to fetch restaurants:", response.statusText);
        }
      } catch (error) {
        console.error("Error searching restaurants:", error);
      }
    },
    handleClickDropdown(event) {
      if (
        this.showDropdownUser === true &&
        this.$refs.dropdownUserContent &&
        !this.$refs.dropdownUserContent.contains(event.target)
      ) {
        this.showDropdownUser = false;
      } else if (
        this.showDropdownUser === false &&
        this.$refs.dropdownUserTrigger &&
        this.$refs.dropdownUserTrigger.contains(event.target)
      ) {
        this.showDropdownUser = true;
      }
    },
  },
};
</script>

<style></style>
