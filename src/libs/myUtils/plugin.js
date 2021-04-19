import MyBtn from './MyBtn.vue'
import MyInput from './MyInput.vue'

const componentPool = [MyInput, MyBtn];

export default {
    install(app, options) {
        // componentPool.map((com) => {
        //     app.component(com.name, com);
        // })

        // 按需加载
        if (options.component) {
            options.component.map(item => {
                componentPool.map(items => {
                    if (items === items.name) {
                        app.component(items.name, items);
                    }
                }
                )
            })
        }
    }
}
