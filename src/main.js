import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import Myutil from './libs/myUtils/plugin'

let app = createApp(App);

// app.config.errorHandler = (err, vm, info)  捕获错误信息
// app.config.globalProperties 添加一个全局的属性
app.config.globalProperties.$show = false;

app.use(Myutil, { // 是options  可以按需加载
    component: [
        'MyBtn'
    ]
});

app.mount('#app');
