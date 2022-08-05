<template>
  <section class="mapContainer">
    <v-btn icon class="close"
      @click.stop="map.setCenter(myCoordinates); $emit('closeModal'); ClearMap()">
      <v-icon>mdi-close-circle-outline</v-icon>
    </v-btn>

    <v-btn icon class="searchIcon not_clr"><v-icon>mdi-magnify</v-icon></v-btn>
    <gmap-autocomplete
      :select-first-on-enter="true"
      class="inputGoogleSearch"
      @place_changed="updatePlace($event)"
    ></gmap-autocomplete>

    <v-text-field
      v-show="positionMarker[0]"
      v-model="direccion"
      placeholder="Introduce tu direccion"
      hide-details
      solo
      class="textField_direccion bold h10_em"
    ></v-text-field>

    <v-btn v-show="positionMarker[0]&&direccion!==''" class="botones2" height="40px"
      @click="$emit('getDirection',direccion,positionMarker[0].position); map.setCenter(myCoordinates); 
      $emit('closeModal'); ClearMap()">
      <span class="h10_em">Aceptar</span>
    </v-btn>

    <GmapMap
      ref="mapRef"
      :center="myCoordinates"
      :zoom="14"
      :options="{
        key: 'AIzaSyA8ZXhuqGTzEZY25fO5eM7Xxj-rotGs3JI',
        mapId: 'f5c4f66caa34617d',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
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
    </GmapMap>
  </section>
</template>

<script>
export default {
  name: "googleMapForms",
  data() {
    return {
      // map
      map: null,
      myCoordinates: {lat: 0,lng: 0,},
      // text-field
      direccion: '',
      //markers
      positionMarker: [],
      lastId: 1,
      clustering: true,
      gridSize: 50,
      markerCount: 0,
    }
  },
  computed: {
    activeMarkers() {
      if (this.markersEven) {return this.positionMarker.filter((v, k) => k % 2 == 0);}
      else {return this.positionMarker}
    },
  },
  created() {
    // get user's coordinates from browser request
    this.$getLocation()
    .then(coordinates => {this.myCoordinates = coordinates})
    .catch(error => alert(error));
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
    ClearMap() {setTimeout(() => {this.positionMarker.splice(0,1);this.markerCount=0;},500);this.direccion=''},
    mapClicked(mouseArgs) {
      if (this.markerCount < 1) {this.addMarker()}
      const createdMarker = this.positionMarker[this.positionMarker.length - 1];
      createdMarker.position.lat = mouseArgs.latLng.lat();
      createdMarker.position.lng = mouseArgs.latLng.lng();
      createdMarker.ifw2latText = mouseArgs.latLng.lat();
      createdMarker.ifw2lngText = mouseArgs.latLng.lng();
    },
    addMarker: function addMarker() {
      this.markerCount++
      this.lastId++;
      this.positionMarker.push({
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
    //   if (this.markerCount < 1) {
    //     const createdMarker = this.addMarker();
    //     createdMarker.position.lat = mouseArgs.latLng.lat();
    //     createdMarker.position.lng = mouseArgs.latLng.lng();
    //   }
    // },
    // addMarker: function addMarker() {
    //   this.markerCount++
    //   this.lastId++;
    //   this.positionMarker.push({
    //     id: this.lastId,
    //     position: {
    //       lat: 0,
    //       lng: 0
    //     },
    //     opacity: 1,
    //     draggable: true,
    //     enabled: true,
    //     ifw: true,
    //     ifw2text: 'This text is bad please change me :('
    //   });
    //   return this.positionMarker[this.positionMarker.length - 1];
    // },
    updatePlace(place) {
      if (place && place.geometry && place.geometry.location) {
        if (this.markerCount < 1) {this.addMarker()}
        const marker = this.PositionMarker[this.PositionMarker.length - 1];
        marker.position.lat = place.geometry.location.lat();
        marker.position.lng = place.geometry.location.lng();
        marker.ifw2latText = place.geometry.location.lat();
        marker.ifw2lngText = place.geometry.location.lng();
        this.map.setCenter(marker.position)
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
