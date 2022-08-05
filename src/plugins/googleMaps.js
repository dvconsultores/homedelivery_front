import * as VueGoogleMaps from 'vue2-google-maps';
import VueGeolocation from 'vue-browser-geolocation';
import Vue from 'vue'

// google maps
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA8ZXhuqGTzEZY25fO5eM7Xxj-rotGs3JI',
    mapId: 'f5c4f66caa34617d',
    libraries: "places",
  },
  installComponents: true
})
// geolocation
Vue.use(VueGeolocation);

export default (VueGoogleMaps, VueGeolocation);