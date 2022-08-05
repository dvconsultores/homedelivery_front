<template>
  <section id="restaurante-tienda" class="parent">
    <Alerts ref="alerts"></Alerts>
    <v-col class="contup">
      <section class="contbanner jspace">
        <v-img :src="data.logo" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
          <aside class="backBtn">
            <v-btn icon @click="$router.push('/restaurantes')" :ripple="false">
              <v-icon class="not_clr">mdi-chevron-left</v-icon>
            </v-btn>
          </aside>
          <!-- <aside class="contLike">
            <button class="contimg center absolute not_clr" :class="{ contIconActive: perfil.like }"
              @click="perfil.like = !perfil.like">
              <img :src="require(`@/assets/icons/corazon${perfil.like == true ? '' : '-outline'}.svg`)" alt="Food icon">
            </button>
          </aside> -->
          <span class="h11_em">{{$t('horario')}}:</span>

          <v-card-title class="h6_em bold">
            {{ data.name }}
          </v-card-title>

        </v-img>

        <aside class="contmapa divcol jend">
          <div class="divcol">
            <label class="h10_em">{{ $t('direccion') }}</label>
            <span class="h11_em">{{ perfil.location.direccion }}</span>
          </div>

          <GoogleMap :UserCoordinates="perfil.location.coordinates" ref="map"></GoogleMap>
        </aside>
      </section>
    </v-col>

    <v-col class="contdown divcol">
      <!-- <aside class="contFilters divwrap acenter">
        <v-btn text class="searchBtn semibold">
          {{ $t('filtrar') }}
        </v-btn>

        <v-text-field prepend-inner-icon="mdi-magnify" solo hide-details class="search"></v-text-field>

        <v-btn class="filtro">
          <v-icon size="2.5em" color="var(--clr-text-btn)" class="not_clr">mdi-filter</v-icon>
        </v-btn>

        <v-select v-model="filters.filterName" :items="$t('filters.filterName.by')"
          :label="$t('filters.filterName.label')" hide-details filled class="select"></v-select>

        <v-select v-model="filters.filterExcluir" :items="$t('filters.filterExcluir')" :label="$t('excluir')" filled
          hide-details multiple class="select">
          <template v-slot:selection="{ item, index }">
            <v-chip color="#FFFFFF" v-if="index === 0">
              <span class="semibold">{{ item }}</span>
            </v-chip>
            <span v-if="index === 1" class="black--text text-caption">
              (+{{ $t('filters.filterExcluir').length - 1 }})
            </span>
          </template>
        </v-select>

        <v-select v-model="filters.filterIncluir" :items="$t('filters.filterIncluir')" :label="$t('incluir')"
          hide-details filled multiple class="select">
          <template v-slot:selection="{ item, index }">
            <v-chip color="#FFFFFF" v-if="index === 0">
              <span class="semibold">{{ item }}</span>
            </v-chip>
            <span v-if="index === 1" class="black--text text-caption">
              (+{{ $t('filters.filterIncluir').length - 1 }})
            </span>
          </template>
        </v-select>
      </aside> -->

      <section class="contRestaurantList">
        <v-card v-for="(item, i) in dataMenuRestaurant" :key="i" :style="WidthListener" class="card divcol"
          v-ripple="activeRipple ? { class: 'activeRipple' } : ''">
          <div class="contImages" @click="SelectMenu(item)" @mouseover="activeRipple = true"
            @mouseleave="activeRipple = false">
            <span class="customeTooltip h12_em not_clr">{{$t('agregarCarrito')}}</span>
            <img class="images" :src="item.img" alt="Restaurant image">
          </div>

          <aside class="contcard space">
            <p class="h10_em semibold">{{ item.description }}</p>

            <div class="contPrice divcol tend">
              <div class="acenter">
                <img class="logoNear" src="@/assets/logos/near.svg" alt="near">
                <span class="price normal">{{ formatPrice(item.price) }}</span>
              </div>
            </div>
          </aside>
        </v-card>
      </section>
    </v-col>
  </section>
</template>

<script>
import Alerts from '@/components/alerts/Alerts.vue'
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection, Contract, utils } = nearAPI;
import GoogleMap from '@/components/googleMaps/GoogleMap'
export default {
  name: "restauranteTienda",
  components: { GoogleMap, Alerts },
  i18n: require("./i18n"),
  mounted() {
    this.$refs.map.userCoordinates = this.perfil.location.coordinates;
    const el = document.querySelectorAll('.contImages');
    el.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        var x = e.offsetX;
        var y = e.offsetY;
        element.style.setProperty('--x', `${x}px`)
        element.style.setProperty('--y', `${y}px`)
      });
    });
    this.VerifyStore()
    this.get_menu()
  },
  data() {
    return {
      data: {},
      activeRipple: false,
      perfil: {
        like: false,
        location: {
          direccion: 'direccion del lugar',
          coordinates: { lat: 9.988903846136667, lng: -67.6891094161248 }
        }
      },
      filters: {
        filterName: null,
        filterExcluir: [],
        filterIncluir: [],
      },
      dataMenuRestaurant: [
      ]
    }
  },
  computed: {
    WidthListener() { if (this.dataMenuRestaurant.length <= 3) { return 'max-width: 20em' } }
  },
  methods: {
    // al hacer click en el menu
    SelectMenu(item) {
      var detalles_totales = 0;
      this.$store.state.dataModalShopCart.forEach(element=>{detalles_totales++;detalles_totales+=element.productos.length});

      item.wallet_shop = this.data.wallet;
      item.name_shop = this.data.name;
      item.wallet_seller = this.$store.state.OWNER_ID;

      this.$store.commit('ShoppingCart', item);

      var nuevos_detalles_totales = 0
      this.$store.state.dataModalShopCart.forEach(element=>{nuevos_detalles_totales++;nuevos_detalles_totales+=element.productos.length;
      });
      
      if (detalles_totales !== nuevos_detalles_totales) {
        this.$refs.alerts.Alerts('success', 'Añadido al carrito', 'Se ha agregado al carrito correctamente');
      } else {
        this.$refs.alerts.Alerts('cancel', 'Tienda ocupada', 'Ya tienes un pedido pendiente con esta tienda');
      };
    },
    formatPrice(price) {
      return utils.format.formatNearAmount(
        price.toLocaleString("fullwide", { useGrouping: false })
      );
    },
    async get_menu() {
      const CONTRACT_NAME = "contract1.ccoronel7.testnet";
      // Connect to NEAR
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // Create wallet connection
      const wallet = new WalletConnection(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ["get_menu"],
        sender: wallet.account(),
      });
      await contract
        .get_menu({
          user_id: this.$store.state.OWNER_ID,
        })
        .then((res) => {
          this.dataMenuRestaurant = res.platillos;
        });
    },
    async VerifyStore() {
      const CONTRACT_NAME = "contract1.ccoronel7.testnet";
      // Connect to NEAR
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      // Create wallet connection
      const wallet = new WalletConnection(near);
      const contract = new Contract(wallet.account(), CONTRACT_NAME, {
        viewMethods: ["get_store"],
        sender: wallet.account(),
      });
      await contract
        .get_store({
          user_id: this.$store.state.OWNER_ID,
        })
        .then((res) => {
          this.data = res;
          // console.log(this.data);
        });
    },
  },
};
</script>


<style src="./Restaurantes.scss" lang="scss" />
