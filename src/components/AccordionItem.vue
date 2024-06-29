<template>
    <div>
        <div class="bg-gray-100 py-2 px-4 flex justify-between items-center cursor-pointer" @click="toggleItem">
            <span class="text-lg truncate ..."><slot name="title"></slot></span>
            <span v-if="isOpen" class="text-xl">-</span>
            <span v-else class="text-xl">+</span>
        </div>
        <div class="bg-white p-4" v-if="isOpen">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        isOpen: false
        }
    },
    methods: {
        toggleItem() {
        this.isOpen = !this.isOpen
    }
  }
}
</script>
