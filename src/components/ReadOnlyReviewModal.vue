<template>
        <transition name="modal-animation">
            <div v-show="modalActive" class="overlay">
                <transition name="modal-animation-inner">
                    <div class="modal">
                        <header class="modal-header">
                            <div name="Restaurant-name">Restaurant : {{ visit?.name || 'Error occured' }}</div>
                        </header>

                        <section class="modal-body">
                            <div name="visite-date">{{ formatDate(visit?.date) || "Error occured" }}</div><br>
                            <div name="rating">Rating : {{ visit?.rating || "Error occured"}}</div><br>
                            <div name="comment">Comment : {{ visit?.comment || "Error occured"}}</div><br>
                        </section>

                        <footer class="modal-footer">
                            <button type="button" class="btn" @click="close">Close</button>
                        </footer>
                    </div>
                </transition>
            </div>
        </transition>
</template>

<script>

export default {
    props: {
        modalActive: {
            type: Boolean,
            required: true
        },
        visit: {
            type: Object,
            required: false
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("close");
    };
    return { close };
    },
    methods: {
        formatDate(dateString){
            if(!dateString) return "Error occured"

            const date = new Date(dateString);
            const options = { month: "long", day: "numeric", year: "numeric" };
            return date.toLocaleDateString("en-US", options);
        }
    }

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

.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 500px;
    max-width: 90%;
}

.modal-header {
    border-bottom: 1px solid orange;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.modal-body {
    margin-bottom: 20px;
    }

.modal-footer {
    text-align: center;
}

.btn {
    background-color: #007bff;
    color: black;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {
    ackground-color: orange;
}

.modal-animation-enter-active, 
.modal-animation-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
    opacity: 0;
}

.modal-animation-inner-enter-active{
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
}
.modal-animation-inner-leave-active{
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-animation-inner-enter-from{
    opacity: 0;
    transform: scale(0.9);
}

.modal-animation-inner-leave-to{
    transform: scale(0.9);
}
</style>
