import axios from '@/plugins/axios'
import {i18n} from '@/plugins/i18n'
import apexchart from '@/plugins/apexchart'
import googleMaps from '@/plugins/googleMaps'
import Toast from '@/plugins/toastification'
import router from './Routes'
import store from './store/index'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'

Vue.component('GmapCluster', GmapCluster)


Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  i18n,
  googleMaps,
  axios,
  apexchart,
  Toast,
  render: h => h(App), store
}).$mount('#app')
