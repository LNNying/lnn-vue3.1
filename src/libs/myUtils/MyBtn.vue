<template>
    <button @click="clickBtn">按钮</button>
</template>

<script>
    export default {
        name: "MyBtn",
        setup() {
            const clickBtn = () => {
                alert('这是一个按钮');
            }

            return {clickBtn}
        }
    }
</script>

<style scoped>

</style>
