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
            class="h11_em semibold">
            <span class="titulo">{{key}}:</span> {{value}}<span class="coma">,</span>
          </span>
        </aside>
      </section>
      
      <section class="divcol">
        <span class="h10_em bold">{{$t('informacionVendedor')}}</span>
        <aside class="grid">
          <span v-for="(value, key) in dataModalPedido.vendedor" :key="key"
            class="h11_em semibold">
            <span class="titulo">{{key}}:</span> {{value}}<span class="coma">,</span>
          </span>
        </aside>
      </section>
      
      <section class="last divcol">
        <span class="h10_em bold">{{$t('informacionDelivery')}}</span>
        <aside class="grid">
          <span v-for="(value, key) in dataModalPedido.delivery" :key="key"
            class="h11_em semibold">
            <span class="titulo">{{key}}:</span> {{value}}<span class="coma">,</span>
          </span>
        </aside>
      </section>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "modalPedido",
  i18n: require("./i18n"),
  data() {
    return {
      modalPedido: false,
      dataModalPedido: {
        pedido: {
          XYX: "XYZ",
          asd: "XsZ",
          ass: "XYZ",
          sad: "XYZ",
          qws: "XasdZ",
          qwd: "XasdZ",
          dwa: "XYZ",
          a12: "XYZ",
          ias: "XYZ",
          sh9: "XYZ",
          io9: "XYZ",
          ma9: "XYZ",
        },
        vendedor: {
          tienda: "XYz",
          calificacion: "XYZ",
          ubicacion: "XYZ",
          yy3: "XYZ",
          categoria: "XYZ",
          zz3: "XYZ"
        },
        delivery: {
          nombre: "XYz",
          calificacion: "XYZ",
          vehiculo: "XYZ",
          yy3: "XYZ",
          matricula: "XYZ",
          zz3: "XYZ"
        },
      }
    }
  },
  methods: {
  },
};
</script>

<style src="./Pedido.scss" lang="scss" />
