<template>
{{name}}
</template>

<script>
    import {reactive, toRef, toRefs} from 'vue'
    export default {
        name: "ref-vue",
        setup() {
            /**
             * toRef  与  toRefs  都是将对象的属性构造成一个ref数据
             *
             * 两个都不能操作普通函数  toRef不会报错  但是获取值为undefined  toRefs  会报一个警告：toRefs() expects a reactive object but received a plain one.
             *
             * */

            let obj = {
                name: 'lisan'
            }

            let state = reactive({
                a: 1,
                name: '离散'
            });
            // 感觉是对于一个对象里某个属性单独实现响应式  两个数据不管谁改变都会影响相应数据值
            let aRef = toRef(state, 'a');
            aRef.value = 3;

            console.log(aRef);

            // toRefs  操作的是一个对象  所以在return中 可以用toRefs操作对象 解构出来  在模板中直接用属性
            let stateRefs = toRefs(state);

            console.log(stateRefs.a.value);


            let objRef = toRef(obj, 'name');

            console.log(objRef.name);

            let objRefs = toRefs(obj);

            console.log(objRefs.name);

            return {...toRefs(state)}
        }
    }
</script>

<style scoped>

</style>
