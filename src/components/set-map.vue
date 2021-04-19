<template>
    <div @click="clickDiv" style="background: red">1241234</div>

    <button v-show="show">{{show}}</button>{{shows}}

    <button @click="addClick">增加</button>
    {{test}}   ------   {{tset1}}  ------    {{obj.a}}
    <p>{{count}} --- </p>
</template>

<script>
    import {ref, reactive, onMounted, getCurrentInstance, computed, watchEffect,watch} from 'vue'
    export default {
        name: "set-map",
        props: {
          show: {
              Boolean
          }
        },
        emits: ['remove'],
        setup(props, ctx) {
            // 提交
            const clickDiv = () => {
                ctx.emit('update:show', false);
                ctx.emit('remove', '组件提交')
            };
            let shows = ref(props.show);

            let test = reactive(2);
            let obj = reactive({a: 1});
            let tset1 = ref(2);

            const addClick = () => {
                test += 1;
                tset1.value += 1;
                obj.a += 1;
            };

            // compute 用法
            // 1
            let count = computed(() => {
               return obj.a += 1;
            });
            // 2 get set
            // let count1 = computed({
            //     get() {
            //         return obj.a += 1;
            //     },
            //     set() {
            //         tset1.value += 5;
            //     }
            // });

            let a = ref(2);

            // setTimeout(() => {
            //     a.value = 3;
            // }, 1000)
            //
            // setTimeout(() => {
            //     obj.a = 3;
            //     console.log(a.value);
            // }, 5000)

            // 整体叫做effect function  返回一个stop()函数停止监听   异步刷新
            // onInvalidate  其实有可能是 async  异步操作
            let stop = watchEffect((onInvalidate) => {
                // await data = getData()
                console.log('内部watchEffect调用');
                console.log(a.value); // 这里是effect
                onInvalidate(() => {   // 是在console之前和stop执行之前执行  目的  取消后面的影响  比如节流防抖  做相应的effect(副作用)处理
                    // console.log('取消');
                })
            });
            // ref
            watch(a, () => {
                // console.log('改变');
            });
            // reactive()
            watch(() => obj.a, () => {
                // console.log('reactive改变');
            });

            // setTimeout(() => {
            //     stop();
            //     // console.log('取消监听');
            // }, 3000);


            // count1 = 3;

            common();

            onMounted(() => {
                let {ctx} = getCurrentInstance();
                // console.log(test);
                // console.log(obj);
                // console.log(ctx.$show);
            })
            return {clickDiv, shows, test, addClick, tset1, obj, count}
        }
    }


    function common() {
        let state = reactive({
            b: 1
        });
        //
        setTimeout(() => {
            state.b = 5;
            console.log(state.b);
        }, 5000);

        // watchEffect(() => {
        //     console.log(state.b);
        //     console.log('外面watchEffect调用');
        // })
    }
</script>

<style scoped>

</style>
