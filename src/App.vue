<template>
    <div>
        {{state.name}}
        {{state.num}}
        <button @click="clickName">按钮</button>
        <button @click="add">加法</button>
        <br/>
        {{data.name.value}} --- {{data.age.value}}

        <br/>
        {{age}}


        <br/>
        <div ref="box">我是ref</div>

        <br/>
        <button @click="readFun">readonly</button>
    </div>
    <button @click="showClick">显示</button>
    {{show}}
    <set-map @remove="remove" :show="show"></set-map>
    <HelloWorld></HelloWorld>


    <my-btn></my-btn>

    <ref-vue></ref-vue>
</template>

<script>
    import {ref, reactive, toRaw, toRefs, customRef, onMounted,
    readonly, getCurrentInstance} from 'vue';
    import HelloWorld from "./components/HelloWorld.vue";
    import SetMap from "./components/set-map.vue";
    import RefVue from "./components/ref-vue.vue";

    /**
     * 自定义组件API
     * 自定义ref 闭包函数
     * @param value
     * @returns {Ref<*>}
     */
    function myRef(value) {
        return customRef((track, trigger) => {
            return {
                get() {
                    track(); // 是否需要跟踪
                    return value;
                },
                set(newValue) {
                    value = newValue;
                    trigger(); // 是否需要触发
                }
            }
        })
    }

    export default {
        name: 'App',
        components: {RefVue, SetMap, HelloWorld},
        setup() {
            let show = ref(false);
            let obj = {
                name: 'vue3',
                age: '12'
            }
            let state = reactive({
                name: 'vue3',
                num: 1
            });
            let data = toRefs(obj);
            let age = ref(12);
            function clickName() {
                // console.log(this);
                state.name = '这是vue2->vue3'
            }
            let add = addNum(state);
            const showClick = () => {
                show.value = true;
            };
            /**
             * 获取dom元素
             */
            let box = ref(null);
            onMounted(() => {
                // 通过.value 获取数据
                // console.log("获取元素",box.value);
            });

            let read = readonly({name: 'vue', age: 12});
            function readFun() {
                read.name = 'vue3';
                read = {name: 'vue1'};
                // console.log(read);
            }

            const remove = (desc) => {
                console.log(desc);
            }
            return {state, clickName, add, data, age, box, readFun, remove, show, showClick};
        }
    }

    function addNum(state) {
        return function () {
            state.num += 1;
        }
    }
</script>
