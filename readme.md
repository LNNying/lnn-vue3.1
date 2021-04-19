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
     *    本质：还是reactive. 给ref方法传递一个值，ref会将其转化成reactive ref(18) => reactive({value: 18}) reactive 会默认添加一个属性value
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


  $emit  提交方法    在子组件中name 同下 emits: ['on-change'] 可以没有 但是会报警告
  在setup(props, ctx) { // ctx 俄日上下文 或者{emit}
    ctx.emit('on-change')
  }

  注意： setup 参数props 不能解构 也不能在下面解构  会丢失响应式   注意解构对响应式的影响


  watchEffect 最初执行一次  变化也监听   监听所有变量  自动监听依赖(数据)改变  并且在组件被卸载的时候停止
              会返回一个停止函数    执行stop函数  就停止监听
              回调函数中有一个参数 onInvalidate 这也是一个回调函数  执行在循序是在改变之前和stop之前执行
              目的是取消后面的操作  比如节流防抖
              在beforeUpdate(所有组件更新)生命周期之前调用

              第二个选项 {flush: 'pre'} 默认pre  在beforeUpdate之前调用  post 是之后调用   sync 是同步执行

              获取dom 或refs的话  要在onMounted生命周期中调用   比如 refs  是要用ref 定义一个ref 和dom挂在  会调用两次

              选项
              watchEffect(() => {},
              {
                flush,// 规定调用顺序
                // 在以下两个函数下debugger  但只在开发环境下有效
                onTrack(e){}, // 被追踪到 就是依赖第一次以及后面的改变
                onTrigger(e){} // 依赖改变的时候才执行
              }
              )

              watchEffect具有模块化  意思就是 在setup外函数中只能监听当前函数中数据变化  也可以认为是局部监听

  watch 写法
  参数一  监听的数据项
  参数二  监听的操作
    watchEffect 它与 watch 的区别主要有以下几点：

    不需要手动传入依赖
    每次初始化时会执行一次回调函数来自动获取依赖  会存到队列中
    无法获取到原值，只能得到变化后的值

  watch(() => {
    return  data;  // 监听的数据
  }, (newVal) => {
       数据操作
  });
  必须有一个特定数据来源
  监听ref类型变量   加不加.value 取决于写法
  watch(变量, () => {}) // 不用加  这种方式只能用于ref变量
  watch(() => 变量.value, () => {}) // 加

  监听reactive类型变量
    watch(() => 变量.value, () => {})

  监听多个
  watch(() => {
  return [val1.value, val2.value]},
  ([newVal1, oldVal1], [newVal2, oldVal2]) => {

  })

  拥有与watchEffect一样的执行顺序和配置选项

  watch(()=> data, () => {})  或者  监听一个对象  watch(state, (newVal, oldVal) => {})



  setup 返回的是对象  对象的属性会放到render函数中

  getCurrentInstance() 钩子  可以获取当前实例 中有一个proxy 应该可以获取到vue原型连


  子组件中不写props  可以用ctx.attrs获取’


  app下有一个config  app.config.globalProperties.  添加全局属性  通过getCurrentInstance();(获取当前实例) 解构出来{ctx}.调用 看set-map.vue
  组件内部的属性优先级大于全局中属性


  use与plugin
    主要是在main.js中  通过app.use() 引入

    reactive() 与vue 2中 Vue.observe()   只接受对象   基本类型会报警告  可以声明但不是响应式的

    readonly  只读  可以套用reactive 深度监听

    ref  可以监听对象   但是方式必须  obj.value.a 才能访问数据  在模板中不需要.value  会自动展开打开
         ref数据赋值给reactive  ref数据也会自动展开
         如 let react = ref(0)   reactive({react})
         let arr = reactive([ref(0)])   不会展开ref 访问.value   所以 arr[0].value

    unref(info) === isRef(info) ? info.value : info


    toRef 可以创建一个ref 更多的是针对响应式对象的
    toRefs  见ref-vue
    isRef  判断是否是一个ref属性

    compute 用法

    let arr = compute(() => item.id)




    vuex
    // 这种写法与vue中引入类似
   import {createNamespacedHelpers, useStore} from 'vuex'
   const {mapState, mapActions} = createNamespacedHelpers('user');// 通过这个函数来辅助我们找到user模块

   // 这种写法与this.$store.user.name 类似
  import {useStore} from 'vuex';
  const store = useStore();
  let name = computed(() => store.state.user.name); // 这里注意指定user模块
        return {
            name,
            // 调用mutation方法
            store.dispatch('user/setToken') // 调用actions
            setToken: () => store.commit('user/SET_TOKEN', new Date().getTime() / 1000),
                                    // 这里注意指定user模块
        }
