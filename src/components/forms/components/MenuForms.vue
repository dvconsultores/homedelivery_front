<template>
  <section>
    <v-dialog
      v-model="modalDirection"
      max-width="min(95%, 80em)"
    >
      <v-card id="modalDirection">
        <GoogleMapForms ref="map"
          @closeModal="modalDirection=false"
          @getDirection="(direccion,coordinates)=>{$emit('getDirection',direccion,coordinates)}"
        ></GoogleMapForms>
      </v-card>
    </v-dialog>

    <v-menu
      v-model="item.closeMenu"
      v-for="(item, index) in dataVerificators" :key="index"
      transition="scale-transition"
      offset-y
      offset-x
      top
      :activator="item.activator"
      :close-on-content-click="false"
    >
      <v-col class="verificatorMiPerfil">
        <h6 class="h11_em">{{ $t(item.key) }}</h6>
        <div class="spacea">
          <v-btn color="var(--clr-card-2)" @click="AcceptVerificator(item.key)">
            <img src="@/assets/icons/check.svg" alt="accept button">
          </v-btn>
          <v-btn color="var(--clr-card-2)" @click="CancelVerificator(item.key)">
            <img src="@/assets/icons/cancel.svg" alt="cancel button">
          </v-btn>
        </div>
      </v-col>
    </v-menu>
  </section>
</template>

<script>
import GoogleMapForms from '@/components/googleMaps/GoogleMapForms.vue'
export default {
  name: "menuForms",
  i18n: require("./i18n"),
  components: { GoogleMapForms },
  data() {
    return {
      modalTimePicker: false,
      picker: null,
      modalDirection: false,
      closeMenu: true,
      dataVerificators: [
        {
          key: "delivery",
          activator: ".openDeliveryAlert",
          closeMenu: false,
        },
        {
          key: "vendedor",
          activator: ".openVendedorAlert",
          closeMenu: false,
        },
      ]
    };
  },
  methods: {
    AcceptVerificator(item) {
      this.$parent.AcceptVerificator(item);
      this.dataVerificators.forEach(element => {
        element.closeMenu = false;
      });
    },
    CancelVerificator(item) {
      this.$parent.CancelVerificator(item);
      this.dataVerificators.forEach(element => {
        element.closeMenu = false;
      });
    },
  }
};
</script>

<style src="./MenuForms.scss" lang="scss"></style>
