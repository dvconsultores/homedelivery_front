<template>
  <section>
    <Alerts ref="alerts"></Alerts>
    <MenuHeader ref="menu"></MenuHeader>
    <!-- desktop -->
    <v-app-bar
      id="headerApp"
      color="transparent"
      height="100px"
    >
      <v-row class="jend">
        <v-col class="contheader space">
          <aside class="contleft acenter">
            <v-text-field
              v-model="search"
              solo
              hide-details="true"
              maxlength="20"
              class="eliminarmobile"
            >
            <template v-slot:prepend-inner>
              <img src="@/assets/icons/lupa.svg" alt="icon">
            </template>

              <template v-slot:label>
                <span class="label">{{$t('labelBuscar')}}</span>
              </template>
            </v-text-field>

            <v-btn class="botones openOptions">
              <img width="100%" src="@/assets/icons/options.svg" alt="options">
            </v-btn>

            <v-btn
              class="botones vermobile openSearch">
              <img src="@/assets/icons/lupa.svg" alt="icon">
            </v-btn>
          </aside>

          <aside class="contright center">
            <v-btn v-for="(item, index) in dataLogin" :key="index" @click="item.key=='login'?loginNear(item.key):null"
              v-show="item.show" :class="{ openMenuLogout: item.key == 'logout' }"
              class="walletButton center">
              <span v-if="item.key=='login'">{{ $t(item.text) }}</span>
              <span v-if="item.key=='logout'">{{ item.text }}</span>
            </v-btn>

            <v-btn
              class="botones"
              @click="verifyDataShopCart()"
            >
              <v-badge
                :content="$store.state.dataModalShopCart.length"
                :value="$store.state.dataModalShopCart.length"
                color="#3E2185"
              >
                <img width="100%" src="@/assets/icons/cart.svg" alt="shopping cart">
              </v-badge>
            </v-btn>
          </aside>
        </v-col>
      </v-row>
    </v-app-bar>
  </section>
</template>

<script>
  import Alerts from '@/components/alerts/Alerts.vue'
  import MenuHeader from './MenuHeader.vue'
  import { PERFIL,PROFILE,PENDING_ORDERS} from '@/services/api.js'
  import * as nearAPI from "near-api-js";
  import { CONFIG } from "@/services/api";
  const { connect, keyStores, WalletConnection } = nearAPI;

  export default {
    name: "header",
    i18n: require("./i18n"),
    components: { MenuHeader, Alerts },
    data() {
      return {
        nearid: false,
        user: null,
        search: "",
        intervalo: null,
        dataLogin: [
          {
            key: "login",
            text: "sesion",
            show: false,
          },
          {
            key: "logout",
            text: this.user,
            show: false,
          },
        ]
      };
    },
    mounted(){
      this.axios.defaults.headers.common.Authorization = 'token '
      if (localStorage.walletid && localStorage.walletid !== 'null') {
        this.nearid = true
      }
      this.intervalo = setInterval(this.fetchPendingOrders_client,3000)
      // Configure button/menu by: Csar
      this.ChangeMenu(this.nearid)
    },
    methods: {
      fetchPendingOrders_client () {
        var id = parseInt(localStorage.getItem('profileid'))
        this.axios.get(PENDING_ORDERS + '/?id=' + id + '&').then((res) => {
          res.data.forEach(element => {
            this.$store.commit('ShoppingCart', element)
          });
        })
      },
      verifyDataShopCart () {
        if (this.$store.state.dataModalShopCart.length !== 0) {
          this.$refs.menu.modalShopCart = true
        } else {
          this.$refs.alerts.Alerts('cancel', 'Sin registros', 'No hay registros disponibles')
        }
      },
      async loginNear(action) {
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        )
        const wallet = new WalletConnection(near);
        if (action === 'login') {
          wallet.requestSignIn(
            "contract1.ccoronel7.testnet",
          );
        } else if (action === 'logout') {
          wallet.signOut()
          this.nearid = false;
          this.ChangeMenu(this.nearid)
        }
      },
      // Change buttom/menu by: Csar/Angel
      ChangeMenu(nearid){
        if (nearid === false){
          this.dataLogin[0].show = true;
          this.dataLogin[1].show = false;
          // localStorage.clear()
        }
        if (nearid === true){
          this.dataLogin[0].show = false;
          this.dataLogin[1].show = true;
          this.dataLogin[1].text = localStorage.walletid
        }
      },
    },
  };
</script>

<style src="./Header.scss" lang="scss"></style>
