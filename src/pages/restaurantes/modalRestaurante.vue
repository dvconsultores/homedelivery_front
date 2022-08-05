<template>
  <v-dialog
    v-model="modalPedido"
    max-width="min(100%, 60em)"
  >
    <v-card id="modalPedido" class="grid">
      <v-btn icon class="close" @click.stop="modalPedido=false">
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>

      <section class="first divcol">
        <span class="h10_em bold">{{$t('informacionPedido')}}</span>
        <aside class="grid">
          <span v-for="(value, key) in dataModalPedido.pedido" :key="key"
            class="h11_em semibold">{{key}}: {{value}}<span class="coma">,</span></span>
        </aside>
      </section>
      
      <section class="divcol">
        <span class="h10_em bold">{{$t('informacionVendedor')}}</span>
        <aside class="grid">
          <span v-for="(value, key) in dataModalPedido.vendedor" :key="key"
            class="h11_em semibold">{{key}}: {{value}}<span class="coma">,</span></span>
        </aside>
      </section>
      
      <section class="last divcol">
        <span class="h10_em bold">{{$t('informacionDelivery')}}</span>
        <aside class="grid">
          <span v-for="(value, key) in dataModalPedido.delivery" :key="key"
            class="h11_em semibold">{{key}}: {{value}}<span class="coma">,</span></span>
        </aside>
      </section>
    </v-card>
  </v-dialog>
</template>

<script>
// import GoogleMap from '@/components/googleMaps/GoogleMap'
export default {
  name: "restauranteTienda",
  // components: { GoogleMap },
  i18n: require("./i18n"),
  mounted() {
    // this.$refs.map.userCoordinates = this.perfil.location.coordinates
  },
  data() {
    return {
    }
  },
  methods: {
  },
};
</script>

<style src="./Restaurantes.scss" lang="scss" />
