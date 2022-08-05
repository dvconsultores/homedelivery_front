<template>
  <v-dialog v-model="modalTienda" max-width="min(100%, 70em)">
    <v-card id="modalTienda" class="divcol jspace gap1">
      <v-btn icon class="close" @click.stop="modalTienda = false">
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>

      <section class="center tcenter">
        <h1 class="h7_em">Order Nº: {{order.id}}</h1>
      </section>

      <section class="contentModal grid">
        <div class="divcol">
          <span class="h10_em bold" style="text-indent: 24px">{{$t('informacionPedido')}}</span>
          <section class="contInformacion divcol gap1">
            <ul class="divcol gap1">
              <v-card
                v-for="(detail, i) in order_details"
                :key="i"
                v-ripple="{ class: 'activeRipple' }"
                class="fwrap"
                :ripple="true"
              >
                <div class="divcol">
                  <span class="h11_em semibold tnone">
                    <span class="titulo">Producto: </span>
                    {{detail.name}}
                  </span>
                  <div class="acenter" style="gap: 0.2em">
                    <span class="h11_em semibold">
                      <span class="titulo">Precio: </span>
                      {{ formatPrice(detail.price) }}
                    </span>
                    <img
                      src="@/assets/logos/near.svg"
                      width="14px"
                      alt="near"
                    >
                  </div>
                </div>
                <div class="divcol">
                  <span class="titulo">Comentario:</span>
                  <span class="tnone">{{ detail.comment }}</span>
                </div>
              </v-card>
            </ul>
          </section>
        </div>

        <aside class="contRightPanel">
          <section class="divcol">
            <span class="h10_em bold">{{ $t("precioPedido") }}</span>
            <aside class="divcol" style="gap: 0.2em">
              <span class="h11_em semibold acenter" style="gap: 0.2em">
                <span class="titulo">{{$t('precioDelivery')}}: </span>
                {{ formatPrice(order.delivery_price) }}
                <img
                  src="@/assets/logos/near.svg"
                  width="14px"
                  alt="near"
                />
              </span>
              <span class="h11_em semibold acenter" style="gap: 0.2em">
                <span class="titulo">{{$t('totalPedido')}}: </span>
                {{ formatPrice(order.total_price) }}
                <img
                  src="@/assets/logos/near.svg"
                  width="14px"
                  alt="near"
                />
              </span>
            </aside>
            <v-btn v-if="order.statu === 'R'" @click="OrderUpdate(order)" :disabled="bloqueoForzado" class="botones2 align maxsize_w margin1top">
              {{$t('aceptar')}}
            </v-btn>
            <v-btn v-else-if="order.statu === 'N'" disabled class="botones2 align maxsize_w margin1top">
              {{$t('esperando')}}
            </v-btn>
            <v-btn v-else-if="order.statu === 'P'" disabled class="botones2 align maxsize_w margin1top">
              {{$t('pagado')}}
            </v-btn>
            <v-btn v-else-if="order.statu === 'C'" @click="OrderUpdate(order)" :disabled="bloqueoForzado" class="botones2 align maxsize_w margin1top">
              {{$t('entregar')}}
            </v-btn>
            <v-btn v-else disabled class="botones2 align maxsize_w margin1top">
              {{$t('desconocido')}}
            </v-btn>
          </section>

          <section class="divcol">
            <span class="h10_em bold">{{ $t("direccionEntrega") }}</span>
            <aside class="divcol" style="gap: 0.2em">
              <GoogleMap
                :UserCoordinates="order.client_location"
                class="map"
              >
              </GoogleMap>
              <span class="h11_em semibold" style="margin-top: 15px">
                <span class="titulo">{{$t('nmmero')}}: </span>
                {{ order.client_number }}
              </span>
            </aside>
          </section>
        </aside>
      </section>
    </v-card>
  </v-dialog>
</template>

<script>
import GoogleMap from '@/components/googleMaps/GoogleMap'
import * as nearAPI from "near-api-js";
const { utils } = nearAPI;
import { ORDER, CONFIG, ORDERD, ORDER_STATU} from "@/services/api";
export default {
  name: "modalTienda",
  i18n: require("./i18n"),
  components: { GoogleMap },
  data() {
    return {
      modalTienda: false,
      order:{},
      order_details:[],
      bloqueoForzado: false,
    }
  },
  mounted() {
  },
  methods: {
    formatPrice(price) {
      return utils.format.formatNearAmount(
        price.toLocaleString("fullwide", { useGrouping: false })
      );
    },
    get_orders(id) {
      this.axios.get(ORDER+"/?id=" + id).then((response) => {
        this.order = response.data[0]
      })
    },
    get_orders_details(id) {
      this.axios.get(ORDERD+"/?order=" + id).then((response) => {
        this.order_details = response.data
      })
    },
    yoctoNEARNEAR: function(yoctoNEAR) {
      const amountInNEAR = utils.format.parseNearAmount((this.formatPrice(yoctoNEAR)).toString())
      console.log(amountInNEAR)
    },
    OrderUpdate(item) {
      this.bloqueoForzado = true
      var objeto = null
      if (item.statu === 'R') {
        objeto = {id: item.id, statu: 'N'}
      } else if (item.statu === 'P') {
        objeto = {id: item.id, statu: 'C'}
      }
      if (objeto) {
        this.axios.put(ORDER_STATU,objeto).then((res) => {
          if (res.status !== 202) {
            this.bloqueoForzado = false
          }
        })
      }
    },
  },
};
</script>

<style src="./Tienda.scss" lang="scss" />
