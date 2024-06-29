<template>
    <div>
        <div v-if="isLoading" class="flex justify-center items-center">
            <img src="../assets/loading-gif.gif" alt="Loading gif" style="width:48px;height:48px;">
        </div>

        <div v-else>
            <div class="flex flex-wrap">
                <div class="w-1/3 p-px md:px-3 md:mb-6">
                    <div @click="openModalFavorites(null)" class="aspect-square bg-gray-200 hover:bg-amber-200 hover:cursor-pointer flex justify-center items-center text-gray-500">
                        <p class="text-3xl">+</p>
                    </div>
                </div>

                <div v-for="(favorite, index) in userFavorites" :key="index" class="w-1/3 p-px md:px-3 md:mb-6">
                    <div @click="openModalFavorites(favorite)" class="aspect-square bg-gray-200 hover:bg-amber-200 hover:cursor-pointer flex justify-center items-center text-center text-gray-500">
                        <p class="text-m truncate ...">{{ favorite.name }}</p>
                    </div>
                </div>

                <UserFavoriteModal v-if="showModalFavorites" :createList="createList" :deleteList="deleteList" :updateListName="updateListName" :setRestaurant="setRestaurant" :favorite="selectedFavorite" :closeModal="closeModal" />
            </div>
            <div v-if="!viewMoreIsLoading">
                <button v-if="nextPage >= 0" class="bg-amber-400 w-full hover:bg-amber-500 text-white font-bold py-2 px-4 rounded" @click="viewOtherFavorites">
                    See more
                </button>
            </div>
            <div v-else class="flex justify-center items-center">
                <img src="../assets/loading-gif.gif" alt="Loading gif" style="width:48px;height:48px;">
            </div>
        </div>
    </div>
</template>

<script>
import UserFavoriteModal from '@/components/UserFavoriteModal.vue';
import favoritesService from '@/services/favoritesService.js'
import userService from '@/services/userService.js'
import { useToast } from "vue-toastification";
import visitsService from '@/services/visitsService.js'
import restaurantService from '@/services/restaurantService.js'

export default {
    components: {
        UserFavoriteModal
    },
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            userFavorites: [],
            isLoading: false,
            viewMoreIsLoading: false,
            showModalFavorites: false,
            selectedFavorite: null,
            totalNbFavorites: 0,
            nextPage: 0,
            dataParPage: 10
        }
    },
    methods: {
        openModalFavorites(favorite) {
            this.selectedFavorite = favorite;
            this.showModalFavorites = true;
        },
        closeModal() {
            this.showModalFavorites = false;
        },
        setRestaurant(restaurant) {
            const indexToUpdate = this.userFavorites.findIndex(e => e.id === this.selectedFavorite.id)
            if(indexToUpdate != -1) {
                console.log(indexToUpdate)
                console.log(this.userFavorites[indexToUpdate])
                this.userFavorites[indexToUpdate].restaurants = restaurant
            }
    },
        async createList(name) {
            try {
                const data = await favoritesService.postFavorite(this.userInfo.email, name)
                this.userFavorites.unshift(data)
                return true
            } catch {
                const toast = useToast()
                toast.error("Could not create the list " + name)
                return false
            }
        },
        async updateListName(name) {
            try {
                const data = await favoritesService.putFavorite(this.userInfo.email, this.selectedFavorite.id, name)
                this.selectedFavorite = data
                const indexToUpdate = this.userFavorites.findIndex(e => e.id === this.selectedFavorite.id)
                if(indexToUpdate != -1) this.userFavorites[indexToUpdate] = data
                return true
            } catch {
                const toast = useToast()
                toast.error("Could not update the list name")
                return false
            }
        },
        async deleteList() {
            try {
                const data = await favoritesService.deleteFavorite(this.selectedFavorite.id)
                const indexToDelete = this.userFavorites.findIndex(e => e.id === this.selectedFavorite.id)
                if(indexToDelete != -1) this.userFavorites.splice(indexToDelete, 1)
                return true
            } catch {
                const toast = useToast()
                toast.error("Could not delete the list")
                return false
            }
        },
        async viewOtherFavorites() {
            this.viewMoreIsLoading = true
            try {
                const id = this.userInfo.id
                const newFavorites = await userService.getUserFavorites(id, this.nextPage)
                this.nextPage = this.nextPage - 1

                this.userFavorites = [...this.userFavorites, ...newFavorites.items.reverse()]

                this.viewMoreIsLoading = false
            } catch (e) {
                console.log(e)
                this.showToast("Could not get user's other favorites")
            }
        },
        showToast(message) {
            const toast = useToast();
            toast.error(message);
        }
    },
    async created() {
        this.isLoading = true
        try {
            const id = this.userInfo.id
            this.totalNbFavorites = await userService.getUserNbFavorites(id)

            if(this.totalNbFavorites<=0) {
                this.isLoading = false
                return
            }
            this.nextPage = Math.floor(this.totalNbFavorites / this.dataParPage) -1
            const userFavorites = await userService.getUserFavorites(id, this.nextPage + 1)

            this.userFavorites = (userFavorites.items).reverse()

            if(this.nextPage >= 0) await this.viewOtherFavorites()

            this.isLoading = false
        } catch (e) {
            console.log(e)
            this.showToast("Could not get user's favorites")
        }
    }
}
</script>
