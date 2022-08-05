<template>
  <section class="mapContainer">
    <v-btn icon class="searchIcon not_clr"><v-icon>mdi-magnify</v-icon></v-btn>
    <gmap-autocomplete
      :select-first-on-enter="true"
      class="inputGoogleSearch"
      @place_changed="updatePlace($event)"
    ></gmap-autocomplete>

    <GmapMap
      ref="mapRef"
      :center="UserCoordinates.location"
      :zoom="14"
      :options="{
        key: 'AIzaSyA8ZXhuqGTzEZY25fO5eM7Xxj-rotGs3JI',
        mapId: 'f5c4f66caa34617d',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
        disableDefaultUi: false,
      }"
      @click="mapClicked"
      @zoom_changed="update('zoom', $event)"
      @center_changed="update('reportedCenter', $event)"
      @maptypeid_changed="update('mapType', $event)"
      @bounds_changed="update('bounds', $event)"
    >
      <gmap-cluster :grid-size="gridSize" v-if="clustering">
        <template v-for="item in activeMarkers">
          <gmap-marker
            :key="item.id"
            v-if="item.enabled"
            :position="item.position"
            :opacity="item.opacity"
            :draggable="item.draggable"
            @click="item.ifw=!item.ifw"
            @dragend="mapClicked">
            <gmap-info-window :opened="item.ifw">
              <section class="marker jcenter">
                <div class="divcol">
                  <h4>latitud</h4>
                  <span>{{item.ifw2latText}}</span>
                </div>
                <div class="divcol">
                  <h4>Longitud</h4>
                  <span>{{item.ifw2lngText}}</span>
                </div>
              </section>
            </gmap-info-window>
          </gmap-marker>
        </template>
      </gmap-cluster>

      <gmap-custom-marker
        :marker="UserCoordinates"
        @click.native="someFunction()"
      >
        <img class="localImg" src="@/assets/logos/logo.svg" />
      </gmap-custom-marker>
    </GmapMap>
  </section>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker';
export default {
  name: "googleMap",
  components: { 'gmap-custom-marker': GmapCustomMarker },
  props: { UserCoordinates: Object },
  data() {
    return {
      // map
      map: null,
      //markers
      PositionMarker: [],
      lastId: 1,
      clustering: true,
      gridSize: 50,
      markerCount: 0,
    }
  },
  computed: {
    activeMarkers() {
      if (this.markersEven) {return this.PositionMarker.filter((v, k) => k % 2 == 0);}
      else {return this.PositionMarker}
    },
    // mapCoordinates() {
    //   if (!this.map) {
    //     return {lat: 0,lng: 0}
    //   }
    //   return {
    //     lat: this.map.getCenter().lat().toFixed(4),
    //     lng: this.map.getCenter().lng().toFixed(4)
    //   }
    // }
  },
  mounted() {
    //add the map to a data object
    this.$refs.mapRef.$mapPromise.then(map => this.map = map);
    // hide and show search
    const item = document.querySelector('.inputGoogleSearch');
    item.addEventListener('click', ()=>{item.classList.add('active')})
    document.addEventListener('click', (e)=>{
      if (!item.contains(e.target)) {item.classList.remove('active')}
    });
  },
  methods: {
    // someFunction() {
    //   console.log('alguna funcion')
    // },
    mapClicked(mouseArgs) {
      if (this.markerCount < 1) {this.addMarker()}
      const createdMarker = this.PositionMarker[this.PositionMarker.length - 1];
      createdMarker.position.lat = mouseArgs.latLng.lat();
      createdMarker.position.lng = mouseArgs.latLng.lng();
      createdMarker.ifw2latText = mouseArgs.latLng.lat();
      createdMarker.ifw2lngText = mouseArgs.latLng.lng();
      let object = {
        location: mouseArgs.latLng,
        item: this.UserCoordinates
      }
      this.$store.commit('ChangeLocation', object)

    },
    addMarker: function addMarker() {
      this.markerCount++
      this.lastId++;
      this.PositionMarker.push({
        id: this.lastId,
        position: {lat: 0,lng: 0},
        opacity: 1,
        draggable: true,
        enabled: true,
        ifw: true,
        ifw2latText: 0,
        ifw2lngText: 0,
      });
    },
    updatePlace(place) {
      if (place && place.geometry && place.geometry.location) {
        if (this.markerCount < 1) {this.addMarker()}
         const marker = this.PositionMarker[this.PositionMarker.length - 1];
        marker.position.lat = place.geometry.location.lat();
        marker.position.lng = place.geometry.location.lng();
        marker.ifw2latText = place.geometry.location.lat();
        marker.ifw2lngText = place.geometry.location.lng();
        this.map.setCenter(marker.position)
        this.$store.commit('ChangeLocation', place.geometry.location)
      }
    },
    update(field, event) {
      if (field === 'reportedCenter') {
        // N.B. It is dangerous to update this.center
        // Because the center reported by Google Maps is not exactly
        // the same as the center you pass it.
        // Instead we update this.center only when the input field is changed.
        this.reportedCenter = {
          lat: event.lat(),
          lng: event.lng(),
        };
        // If you wish to test the problem out for yourself, uncomment the following
        // and see how your browser begins to hang:
        // this.center = _.clone(this.reportedCenter)
      } else if (field === 'bounds') {
        this.mapBounds = event;
      } else {
        this.$set(this, field, event);
      }
    },
  },
};
</script>

<style src="./GoogleMap.scss" lang="scss" />
