<template>
    <input v-model="inputVal"/>
</template>

<script>
    import {ref} from 'vue';
    export default {
        name: "MyInput",
        setup() {
            let inputVal = ref(12);



            return {inputVal};
        }
    }
</script>

<style scoped>
    input {
        border: 1px solid red;
    }
</style>
