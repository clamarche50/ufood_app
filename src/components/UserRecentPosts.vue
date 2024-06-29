<template>
    <div>
        <div v-if="isLoading" class="flex justify-center items-center">
            <img src="../assets/loading-gif.gif" alt="Loading gif" style="width:48px;height:48px;">
        </div>

        <div v-if="this.totalNbVisits > 0 && !isLoading">
            <div class="flex flex-wrap">
                <div v-for="(visit, index) in visitInfo" :key="index" class="w-1/3 p-px md:px-3">
                    <article @click="handleVisitClick(visit)" class="cursor-pointer post bg-gray-100 text-white relative pb-full md:mb-6">
                        <img class="w-full h-full absolute left-0 top-0 object-cover" :src="visit.picture" alt="Restaurant image"/>
                        <div class="bg-white bg-opacity-30 backdrop-blur-md absolute bottom-0 w-full py-2">
                            <p class="text-center">{{ visit.name }}</p>
                            <p class="text-center">{{ visit.date.toLocaleDateString("en-US") }}</p>
                            <p class="text-center"><strong>{{ visit.nbVisits }}</strong> total visits</p>
                        </div>
                    </article>
                </div>
            </div>
            <div v-if="!viewMoreIsLoading">
                <button v-if="nextPage >= 0" class="bg-amber-400 w-full hover:bg-amber-500 text-white font-bold py-2 px-4 rounded" @click="viewOtherVisits">
                    See more
                </button>
            </div>
            <div v-else class="flex justify-center items-center">
                <img src="../assets/loading-gif.gif" alt="Loading gif" style="width:48px;height:48px;">
            </div>
        </div>
        <div v-else-if="!isLoading" class="text-center">
            <div class="text-gray-500">No restaurants found</div>
            <br>
            <router-link class="bg-amber-400 hover:bg-amber-500 text-gray-600 font-bold py-3 px-6 rounded-lg" :to="'/'">Go back home</router-link>
        </div>
    <ReadOnlyReviewModal @close="toggleModal" :visit="selectedVisit" :modalActive="modalActive"/>
    </div>

</template>
<script>

import { onMounted } from 'vue';
import { useToast } from "vue-toastification";
import visitsService from '@/services/visitsService.js';
import restaurantService from '@/services/restaurantService.js';
import ReadOnlyReviewModal from '@/components/ReadOnlyReviewModal.vue';
import { ref } from 'vue';

export default {
    components: {
        ReadOnlyReviewModal,
    },
    setup() {
        const modalActive = ref(false);
        const selectedVisit = ref(null);

        const toggleModal = () => {
            modalActive.value = !modalActive.value;
        };
        const handleVisitClick = (visit) => {
            selectedVisit.value = visit;
            toggleModal();
        };
        return { modalActive, selectedVisit , toggleModal, handleVisitClick};
    },
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isLoading: false,
            viewMoreIsLoading: false,
            userVisits: [],
            visitInfo: [],
            totalNbVisits: 0,
            nextPage: 0,
            alreadyFetchVisits: {},
            dataParPage: 10,
        }
    },
    methods: {
        async viewOtherVisits() {
            this.viewMoreIsLoading = true
            try {
                const id = this.userInfo.id
                const newVisits = await visitsService.getUserVisits(id, this.nextPage)
                newVisits.items.reverse()

                this.nextPage = this.nextPage - 1

                let temp = []
                for (const visit of newVisits.items) {
                    if (!this.alreadyFetchVisits[visit.restaurant_id]) {
                        const restaurant = await restaurantService.getRestaurant(visit.restaurant_id)
                        const visitsSamePlace = await visitsService.getUserVisitsAtRestaurant(id, visit.restaurant_id)

                        this.alreadyFetchVisits[visit.restaurant_id] = {
                            name: restaurant.name,
                            date: visit.date,
                            picture: restaurant.pictures[0],
                            nbVisits: visitsSamePlace.total,
                            rating: visit.rating,
                            comment: visit.comment
                        }
                    }
                    temp.push({
                        name: this.alreadyFetchVisits[visit.restaurant_id].name,
                        date: new Date(visit.date),
                        picture: this.alreadyFetchVisits[visit.restaurant_id].picture,
                        nbVisits: this.alreadyFetchVisits[visit.restaurant_id].nbVisits,
                        rating: visit.rating,
                        comment: visit.comment
                    })
                }
                Array.prototype.push.apply(this.visitInfo,temp)
                Array.prototype.push.apply(this.userVisits, newVisits)
                this.viewMoreIsLoading = false
            } catch (e) {
                console.log(e)
                const toast = useToast()
                toast.error("Could not get user's other recent visits")
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
            
            this.totalNbVisits = await visitsService.getUserVisitsTotal(id)
            
            if(this.totalNbVisits<=0) {
                this.isLoading = false
                return
            }

            this.nextPage = Math.floor(this.totalNbVisits / this.dataParPage) -1
            const userVisits = await visitsService.getUserVisits(id, this.nextPage + 1)
            this.userVisits = (userVisits.items).reverse()

            this.userVisits = userVisits
            console.log(this.userVisits)

            let temp = []
            for (const visit of this.userVisits.items) {
                if (!this.alreadyFetchVisits[visit.restaurant_id]) {
                    const restaurant = await restaurantService.getRestaurant(visit.restaurant_id)
                    const visitsSamePlace = await visitsService.getUserVisitsAtRestaurant(id, visit.restaurant_id)

                    this.alreadyFetchVisits[visit.restaurant_id] = {
                        name: restaurant.name,
                        picture: restaurant.pictures[0],
                        nbVisits: visitsSamePlace.total,
                        rating: visit.rating,
                        comment: visit.comment
                    }
                }
                temp.push({
                    name: this.alreadyFetchVisits[visit.restaurant_id].name,
                    date: new Date(visit.date),
                    picture: this.alreadyFetchVisits[visit.restaurant_id].picture,
                    nbVisits: this.alreadyFetchVisits[visit.restaurant_id].nbVisits,
                    rating: visit.rating,
                    comment: visit.comment
                })
            }
            this.visitInfo = temp

            if(this.nextPage >= 0) await this.viewOtherVisits()
            this.isLoading = false
        } catch (e) {
            console.log(e)
            this.showToast("Could not get user's recent visits")
        }
    }
}
</script>
