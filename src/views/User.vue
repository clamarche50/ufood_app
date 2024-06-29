<template>
  <main class="bg-gray-100 bg-opacity-25">


    <div v-if="isLoading" class="flex justify-center items-center">
      <img src="../assets/loading-gif.gif" alt="Loading gif" style="width:48px;height:48px;">
    </div>


    <div v-if="isLoggedIn && !isLoading" class="lg:w-8/12 lg:mx-auto mb-8">
      <header class="flex flex-wrap items-center p-4 md:py-8">
        <div class="md:w-3/12 md:ml-16">
          <!-- profile image -->
          <img
            class="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-amber-400 p-1"
            src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
            alt="profile"
          />
        </div>
        <!-- profile meta -->
        <div class="w-8/12 md:w-7/12 ml-4">
          <div class="md:flex md:flex-wrap md:items-center mb-4">
            <h2 class="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
              {{userInfo.name}}
            </h2>
          </div>
          <!-- post, following, followers list for medium screens -->
          <ul class="hidden md:flex space-x-8 mb-4">
            <li>
              <span class="font-semibold">{{userInfo.followers.length}}</span>
              followers
            </li>
            <li>
              <span class="font-semibold">{{userInfo.following.length}}</span>
              following
            </li>
          </ul>
          <!-- user meta form medium screens -->
          <div class="hidden md:block">
            <h1 class="font-semibold">Score : {{userInfo.rating}}</h1>
          </div>
        </div>
        <!-- user meta form small screens -->
        <div class="md:hidden text-sm my-2">
          <h1 class="font-semibold">Score : {{userInfo.rating}}</h1>
        </div>
      </header>
      <!-- posts -->
      <div class="px-px md:px-3">
        <!-- user following for mobile only -->
        <ul class="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-gray-600 leading-snug text-sm">
          <li>
            <span class="font-semibold text-gray-800 block">{{userInfo.followers.length}}</span>
            followers
          </li>
          <li>
            <span class="font-semibold text-gray-800 block">{{userInfo.following.length}}</span>
            following
          </li>
        </ul>
        <br>
        <ul class="flex justify-between items-center uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
          <li v-for="(liSection, index) in [{msg: 'Recent', i: 0}, {msg: 'Favorites', i: 1}, {msg: 'Followers', i: 2}, {msg: 'Following', i: 3},]" :key="index" :class="{ 'item-bar': true, 'w-1/5': true, 'text-center': true, 'hover:bg-amber-100': activeSection !== liSection.i, 'bg-amber-400': activeSection === liSection.i, 'hover:bg-amber-500' : activeSection === liSection.i }" style="height: 3rem;">
            <a class="inline-block p-3" style="cursor: pointer" @click="activeSection = liSection.i">
              <i class="fas fa-th-large text-xs lg:text-xl md:text-xs sm:text-xs"></i>
              <span class="md:inline">{{ liSection.msg }}</span>
            </a>
          </li>
        </ul>
        <br>
        <div class="px-px md:-mx-3">
          <div :class="{ 'hidden': activeSection !== 0 }"> 
            <RecentPosts :userInfo="userInfo"/>
          </div>
          <div :class="{ 'hidden': activeSection !== 1 }">
            <FavoritePosts :userInfo="userInfo"/>
          </div>
          <div :class="{ 'hidden': activeSection !== 2 }">
            <Followers :userInfo="userInfo"/>
          </div>
          <div :class="{ 'hidden': activeSection !== 3 }">
            <Following :userInfo="userInfo"/>
          </div>
        </div>
      </div>
    </div>


    <div v-else-if="!isLoading && !signUpView" class="flex justify-center md:pt-0 pt-10 pb-0 md:items-center items-start h-screen">
      <div class="w-full max-w-xl rounded-lg overflow-hidden shadow-md"> 
        <form @submit.prevent="login" class="px-8 pt-4 pb-8">
          <div class="flex items-center">
            <img src="@/assets/UFood2.png" alt="logo" class="h-20 px-2"> 
            <h2 class="text-gray-700 text-xl font-bold px-2">Login</h2>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input v-model="email" class="rounded w-full py-2 px-3 text-gray-700 leading-tight" type="email" placeholder="Email">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input v-model="password" class="rounded w-full py-2 px-3 text-gray-700 leading-tight" type="password" placeholder="************">
          </div>
          <button class="bg-amber-400 w-full hover:bg-amber-500 text-white font-bold py-2 px-4 rounded" type="submit">
            Sign In
          </button>
          <br>
          <br>
          <p class="text-center text-gray-500 text-xs">
            New to Our Website? <a @click="viewSignUp(true)" class="hover:cursor-pointer text-amber-400 hover:text-amber-500">Create an Account</a>
          </p>
        </form>
      </div>
    </div>


    <div v-else-if="!isLoading && signUpView" class="flex justify-center md:pt-0 pt-10 pb-0 md:items-center items-start h-screen">
      <div class="w-full max-w-xl rounded-lg overflow-hidden shadow-md"> 
        <form @submit.prevent="signUp" class="px-8 pt-4 pb-8">
          <div class="flex items-center">
            <button @click="viewSignUp(false)" class="hover:cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-2 rounded-full mt-2 mr-2">
              <svg class="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>
            <img src="@/assets/UFood2.png" alt="logo" class="h-20 px-2"> 
            <h2 class="text-gray-700 text-xl font-bold px-2">Sign Up</h2>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input v-model="name" class="rounded w-full py-2 px-3 text-gray-700 leading-tight" type="text" placeholder="Name">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input v-model="email" class="rounded w-full py-2 px-3 text-gray-700 leading-tight" type="email" placeholder="Email">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input v-model="password" class="rounded w-full py-2 px-3 text-gray-700 leading-tight" type="password" placeholder="************">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Validate Password
            </label>
            <input v-model="passwordValidation" class="rounded w-full py-2 px-3 text-gray-700 leading-tight" type="password" placeholder="************">
          </div>
          <button class="bg-amber-400 w-full hover:bg-amber-500 text-white font-bold py-2 px-4 rounded" type="submit">
            Sign Up
          </button>
          <br>
        </form>
      </div>
    </div>


  </main>
</template>

<script>
import auth from '@/services/authService.js';
import { useToast } from "vue-toastification";
import userService from '@/services/userService.js'

import validation from '@/utils/validation.js'

import RecentPosts from '@/components/UserRecentPosts.vue';
import FavoritePosts from '@/components/UserFavoritePosts.vue';
import Followers from '@/components/UserFollowers.vue';
import Following from '@/components/UserFollowing.vue';

export default {
  components: {
    RecentPosts,
    FavoritePosts,
    Followers,
    Following
  },
  data() {
    return {
      isLoading: false,
      name: '',
      email: '',
      password: '',
      passwordValidation: '',
      showRestaurants: true,
      isLoggedIn: auth.isAuthenticated(),
      userInfo: null,
      userFavorites: [],
      activeSection: 0, // Set default active section
      signUpView: false
    }
  },
  methods: {
    async login() {
      if(validation.isEmptyOrBlank(this.email) || validation.isEmptyOrBlank(this.password)) {
        const toast = useToast()
        toast.error("Complete all fields")
        return
      }

      this.isLoading = true
      try {
        await auth.login(this.email, this.password);
        this.$router.go();
      } catch (error) {
        this.password = ""
        const toast = useToast()
        toast.error(error.message)
        this.isLoading = false
      }
    },
    async signUp() {
      if(validation.isEmptyOrBlank(this.name) || validation.isEmptyOrBlank(this.email) || validation.isEmptyOrBlank(this.password) || validation.isEmptyOrBlank(this.passwordValidation)) {
        const toast = useToast()
        toast.error("Complete all fields")
        return
      }

      if(this.password != this.passwordValidation) {
        const toast = useToast()
        toast.error("Password validation failed")
        return
      }

      this.isLoading = true
      try {
        await auth.signup(this.name, this.email, this.password);
        this.$router.go();
      } catch (error) {
        const toast = useToast()
        toast.error(error.message)
        this.isLoading = false
      }
    },
    viewSignUp(state) {
      this.email = ""
      this.password = ""
      this.name = ""
      this.signUpView = state
    }
  },
  async created() {
    if (this.isLoggedIn) {
      this.isLoading = true
      const id = await auth.getUserId()
      if(id != null) {
        try {
          this.userInfo = await userService.getUser(id)
          this.isLoading = false
        } catch (e) {
          console.log(e)
          const toast = useToast()
          toast.error("Could not get user's information")
        }
      } else {
        const toast = useToast()
        toast.error("Could not get user's id")
      }
    }
  },
};
</script>

<style>
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

.post:hover img {
  transform: scale(1.08);
}

.post:hover {
  transform: scale(1.03);
  z-index: 10;
}

.post img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.pb-full {
  padding-bottom: 100%;
}
span {
  display: block;
}

@media screen and (min-width: 768px) {
  .post:hover .overlay {
    display: block;
  }
}

</style>
