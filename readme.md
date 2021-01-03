vue 3.0 添加setup  主要用于组合API
    /***
     * component API 与 option API(就是vue2 中data，methods中)
     * component API 可以和 option Api 混合一起使用
     * component API(组合或注入API) 本质  在运行的过程中 将component API 暴露出来的数据或方法注入到option API中
     * setUp 执行的时机： 在beforeCreate和create之间执行的
     * 注意： 执行setUp函数的时候还没有执行created所以在setUp中是没法使用data和methods中属性与方法的
     *       由于不能再setUp函数中使用data和methods，所以为了避免使用错误，vue直接将this设置成了undefined  不能用this
     *       setUp中的数据只能是同步的不能是异步 意思是setup前不能加async 而不是不能调用请求方法
     * reactive：
     *     reactive是vue3中提供实现相应话数据的
     *     在vue2中是通过object.defineProperty实现
     *     在vue3中是通过Proxy实现
     *     本质：将传入的数据包装成一个proxy对象
     * reactive注意：
     *     reactive接收的数据必须是对象（json，arr）
     *     如果给reactive传递了其他对象
     *         默认情况下修改对象，单界面不会自动更新
     *         如果想更新，可以通过重新复制的方式 也就是属性值是一个对象  不能用属性值中set方法  必须用 = 赋值
     * ref：一定要注意.value来获取数据
     *    监听基本属性类型  也能监听对象  但是推荐用reactive监听对象
     *    本质：还是reactive 给ref方法传递一个值，ref会将其转化成reactive ref(18) => reactive({value: 18}) reactive 会默认添加一个属性value
     *    所以直接修改ref定义的变量不行(如 age = 12) 必须 age.value = 12
     *    注意：如果是通过ref创建的数据在<template> 不用通过.value获取 vue会自动添加.value获取数据
     *
     * ref与reactive的区别：
     *    用reactive创建的数据  在<template>中vue中不会自动添加.value获取  而ref则会自动添加.value获取数据
     *    vue中通过ref中私有属性 __v_isRef(boolean) 属性来区分是否为ref定义变量
     *    也可通过isRef ， isReactive 来判断是否为ref或reactive   用法isRef(age)
     *
     * 递归监听   嵌套多层对象
     *    默认情况下ref和reactive都是递归监听
     *    问题： 嵌套多层对象，非常消耗性能
     *
     * 非递归监听  值监听第一层  只有在使用的数据量比较大的时候才使用非递归监听
     *   reactive --->>  shallowReactive   如果第一层更新了 就会发生页面的重新渲染
     *   ref --->>  shallowRef  vue监听的是.value的变化  并不是第一层的变化 state.value = ....
     *   triggerRef --->> 根据传入的数据主动更新界面  vue3 只提供ref的方法  没有提供triggerReactive方法

         ref和reactive  是递归Proxy  每一层都包装成了Proxy  reactive要判断数据是否为对象
         shallowRef与shallowReactive 内部只有一层Proxy，非递归
     *
     *  toRaw 作用从ref和reactive封装的数据中获取到原始数据
             ref和reactive封装的数据与原始数据应用地址是相同的，所以直接修改原始数据，封装后的数据也得到修改，但是不会更新页面
             toRaw直接拿到原始数据，修改数据，可以降低性能消耗任何时候都能拿到原始数据
             toRaw拿取ref封装的数据的原始数据，就必须这样 .value    因为ref的本质就是reactive给加value属性封装成的响应式

         markRaw 设置对象永远不能被跟踪就是不能变成响应式数据

         toRef 与 ref一样都是创建响应式数据
         用法：toRef(对象，某个属性)
         如果用ref将对象的一个属性变成响应式，修改.value不会改变原始对象中相应属性值
         如果利用toRef将对象的一个属性变成响应式，修改.value会改变原始对象中相应属性值，但是不会触发页面的更新
         区别：两者在修改数据的时候都要通过.value 来进行修改
         ref-> 复制，修改对象属性不会影响原始数据，数据发生变化会更新页面  在页面模板引用中不需要加.value
         toRef -> 引用，修改对象属性会影响原始数据，数据发生变化不会更新页面  在页面模板引用中需要加.value

         toRef 应用场景： 如果想让响应式数据与之前数据关联起来，并且更新数据不会刷新页面

         toRefs：用于多个创建响应式数据 toRefs(obj)


       customRef 自定义ref  返回一个ref对象，可以显示地控制依赖跟踪和触发相应
            注意：不能get中发送网络请求  这是就把请求逻辑放在return外面
            所以在vue3中也可以用ref来获取dom
            let box = ref(null);  变量名要与dom中ref一直

       readonly  将对象封装成只读的
       isReadonly  判断是否为只读
       shallowReadonly  第一次只读
       const和readonly 区别
       const: 赋值保护，不能给变量重新赋值  对于对象通过.方法是可以给属性重新赋值的，因为引用值没有变
       readonly: 属性保护，不能给属性重新赋值, 对于直接修改引用之是不会包警告的，在set中没有赋值逻辑


     *
     */


     function reactive(obj) {
        if (typeof obj === 'object') {
            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    if (typeof item === 'object') {
                    item[index] = reactive(item);
                    }
                })
            } else {
                for (let key in obj) {
                    if (typeof obj[key] === 'object') {
                        obj[key] = reactive(obj[key]);
                    }
                }
            }
        } else {
            console.warn('不是对象')
        }

        return new Proxy(obj {
            get(obj, key) {
                return obj[key]
            },
            set(obj, key, newValue) {
                obj[key] = newValue;
                return true; // 告诉完这个更新完成
            }
        });

     }
