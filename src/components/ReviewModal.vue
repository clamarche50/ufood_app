<template>
  <div v-if="isOpen" class="overlay">
    <div class="popup-content">
      <h2 class="text-lg font-semibold mb-4">
        Add a visit for {{ restaurantName }}
      </h2>

      <label for="visitDate">Visit Date:</label>
      <input
        type="date"
        id="visitDate"
        v-model="visitDate"
        class="input-field"
      />

      <label for="rating">Rating:</label>
      <input
        type="number"
        id="rating"
        v-model="rating"
        min="1"
        max="5"
        class="input-field"
      />

      <label for="comment">Comment:</label>
      <textarea id="comment" v-model="comment" class="input-field"></textarea>

      <div class="flex justify-between mt-4">
        <button @click="submitReview" class="btn-primary">Submit Review</button>
        <button @click="$emit('close')" class="btn-secondary">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
export default {
  props: {
    isOpen: Boolean,
    restaurantId: {
      type: [String, Number],
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    handleReviewSubmit: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      visitDate: "",
      rating: "",
      comment: "",
    };
  },
  methods: {
    async submitReview() {
      if (this.visitDate && this.rating && this.comment) {
        const review = {
          restaurantId: this.restaurantId,
          visitDate: this.visitDate,
          rating: this.rating,
          comment: this.comment,
        };

        const toast = useToast();
        const result = await this.handleReviewSubmit(review)
        console.log("AAAAAAAAAAAAAAA")
        console.log(result)
        if(!result) {
          toast.error("Could not create visit");
          return
        }

        toast.success("Visit was created");
        this.visitDate = "";
        this.rating = "";
        this.comment = "";

        this.$emit("close");
      } else {
        console.error("Please fill in all fields.");
      }
    },
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
