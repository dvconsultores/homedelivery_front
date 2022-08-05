<template>
  <section id="menuHeader">
    <!-- menu search -->
    <v-menu
      bottom
      transition="scroll-y-transition"
      offset-y
      z-index="10"
      activator=".openSearch"
      :close-on-content-click="false"
    >
      <v-text-field
        v-model="search"
        solo
        hide-details="true"
        maxlength="20"
        class="searchMobile"
      >
        <template v-slot:prepend-inner>
          <img src="@/assets/icons/lupa.svg" alt="icon" />
        </template>

        <template v-slot:label>
          <span class="label">{{ $t("labelBuscar") }}</span>
        </template>
      </v-text-field>
    </v-menu>

    <!-- menu options -->
    <v-menu
      v-model="optionMenu"
      bottom
      transition="scroll-y-transition"
      offset-y
      z-index="10"
      activator=".openOptions"
      :close-on-content-click="false"
    >
      <v-expansion-panels focusable class="menuGlobal">
        <!-- expansion -->
        <template v-if="dataMenuOptions.expansion">
          <v-expansion-panel
            v-for="(item, i) in dataMenuOptions.expansion"
            :key="i"
          >
            <v-expansion-panel-header>
              {{ $t(item.key) }}
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-list v-for="(item2, i) in item.selection" :key="i">
                <v-list-item
                  @click="
                    CambiarLanguaje(item2.key);
                    optionMenu = false;
                  "
                  class="activeClass"
                >
                  <v-list-item-title class="center">
                    <span class="not_clr">{{ $t(item2.name) }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>

        <!-- list -->
        <!--<template v-if="dataMenuOptions.list">
          <v-list class="intoExpansion">
            <v-list-item v-for="(item,i) in dataMenuOptions.list" :key="i"
              @click="SelectOptionItem(item.key)">
              <v-list-item-title>
                <v-badge
                  :content="messages"
                  :value="messages"
                  color="#3E2185"
                  inline
                  class="not_clr"
                  style="margin: 0"
                >
                  {{ item.key }}
                </v-badge>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </template>-->
      </v-expansion-panels>
    </v-menu>

    <!-- menu logout -->
    <v-menu
      v-model="logout"
      bottom
      transition="scroll-y-transition"
      offset-y
      z-index="10"
      activator=".openMenuLogout"
      :close-on-content-click="false"
    >
      <v-expansion-panels focusable class="menuGlobal">
        <!-- expansion -->
        <template v-if="dataMenuLogout.expansion">
          <v-expansion-panel
            v-for="(item, i) in dataMenuLogout.expansion"
            :key="i"
          >
            <v-expansion-panel-header>
              {{ $t(item.key) }}
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-list v-for="(item2, i) in item.selection" :key="i">
                <v-list-item
                  class="activeClass"
                  :to="item2.to"
                  @click.stop="logout = false"
                >
                  <v-list-item-title class="center">
                    <span class="not_clr">{{ $t(item2.key) }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>

        <!-- list -->
        <template v-if="dataMenuLogout.list">
          <v-list class="intoExpansion">
            <v-list-item
              v-for="(item, i) in dataMenuLogout.list"
              :key="i"
              @click.stop="Logout()"
            >
              <v-list-item-title>
                <span class="not_clr">{{ $t(item.key) }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </template>
      </v-expansion-panels>
    </v-menu>

    <!-- carrito de compras -->
    <v-dialog v-model="modalShopCart" max-width="min(100%, 70em)">
      <v-card id="modalShopCart" class="divcol jspace">
        <v-btn icon class="close" @click.stop="modalShopCart = false">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>

        <v-window v-model="ventanaTiendas">
          <v-window-item
            v-for="(pedido, i) in $store.state.dataModalShopCart"
            :key="`card-${i}`"
            class="padd1block relative"
          >
            <section class="center">
              <h1 class="h7_em">{{ pedido.name_shop }}</h1>
            </section>

            <section class="contentModal grid">
              <div class="divcol">
                <span class="h10_em bold" style="text-indent: 24px">{{
                  $t("informacionPedido")
                }}</span>
                <section class="contInformacion divcol gap1">
                  <ul class="divcol gap1">
                    <v-card
                      v-for="(producto, i) in pedido.productos"
                      :key="i"
                      v-ripple="{ class: 'activeRipple' }"
                      class="fwrap"
                      :style="`--numeration: '${i + 1}-'`"
                      :ripple="true"
                    >
                      <div class="divcol">
                        <span class="h11_em semibold"
                          ><span class="titulo">{{$t('producto')}}: </span
                          >{{ producto.name }}</span
                        >
                        <div class="acenter" style="gap: 0.2em">
                          <span class="h11_em semibold"
                            ><span class="titulo">{{$t('precio')}}: </span
                            >{{ formatPrice(producto.price) }}</span
                          >
                          <img
                            src="@/assets/logos/near.svg"
                            width="14px"
                            alt="near"
                          />
                        </div>
                      </div>

                      <v-text-field
                        placeholder="Opcional"
                        hide-details
                        v-model="producto.comment"
                      >
                        <template v-slot:label>
                          <span class="titulo h11_em">{{$t('comentario')}}:</span>
                        </template>
                      </v-text-field>

                      <v-btn icon class="cancelBtn not_clr align">
                        <img
                          src="@/assets/icons/eliminar.svg"
                          alt="cancel order"
                        />
                      </v-btn>
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
                      2
                      <img
                        src="@/assets/logos/near.svg"
                        width="14px"
                        alt="near"
                      />
                    </span>
                    <span class="h11_em semibold acenter" style="gap: 0.2em">
                      <span class="titulo">{{$t('totalPedido')}}: </span>
                      {{ formatPrice(pedido.sub_total) }}
                      <img
                        src="@/assets/logos/near.svg"
                        width="14px"
                        alt="near"
                      />
                    </span>
                  </aside>
                  <!-- <v-btn v-else-if="pedido.statu === 'N'" @click="OrderPay(pedido)" :disabled="bloqueoForzado" class="botones2 align maxsize_w margin1top"> -->
                  <v-btn
                    v-if="pedido.statu === 'R'"
                    class="botones2 align maxsize_w margin1top"
                  >
                    {{$t('enRevision')}}
                  </v-btn>
                  <v-btn
                    v-else-if="pedido.statu === 'N'"
                    @click="payorder(pedido)"
                    class="botones2 align maxsize_w margin1top"
                  >
                    {{$t('pagar')}}
                  </v-btn>
                  <v-btn
                    v-else-if="pedido.statu === 'P'"
                    disabled
                    class="botones2 align maxsize_w margin1top"
                  >
                    {{$t('preparando')}}
                  </v-btn>
                  <v-btn
                    v-else-if="pedido.statu === 'C'"
                    disabled
                    class="botones2 align maxsize_w margin1top"
                  >
                    {{$t('encamino')}}
                  </v-btn>
                  <v-btn
                    v-else-if="pedido.statu === 'E'"
                    :disabled="bloqueoForzado"
                    class="botones2 align maxsize_w margin1top">
                    {{$t('confirmar')}}
                  </v-btn>
                  <v-btn
                    v-else
                    @click="OrderCreate(pedido)"
                    :disabled="bloqueoForzado"
                    class="botones2 align maxsize_w margin1top"
                  >
                  </v-btn>
                  <!-- <v-btn
                    v-else-if="pedido.statu === 'E'"
                    class="botones2 align maxsize_w margin1top"
                  >
                    Confirmar
                  </v-btn>
                  <v-btn
                    v-else
                    @click="OrderCreate(pedido)"
                    class="botones2 align maxsize_w margin1top"
                  >
                    Aceptar
                  </v-btn> -->
                </section>

                <section class="divcol">
                  <span class="h10_em bold">{{ $t("direccionEntrega") }}</span>
                  <aside class="divcol" style="gap: 0.2em">
                    <GoogleMapCart :UserCoordinates="pedido" class="map">
                    </GoogleMapCart>

                    <span class="h11_em semibold tnone">
                      <v-text-field v-model="pedido.direccion" hide-details>
                        <template v-slot:label>
                          <span class="titulo">{{$t('direccion')}}:</span>
                        </template>
                      </v-text-field>
                    </span>
                    <span class="h11_em semibold">
                      <span class="titulo">{{$t('numero')}}: </span>
                      {{ pedido.telefono }}
                    </span>
                  </aside>
                </section>
              </aside>
            </section>
          </v-window-item>
        </v-window>

        <v-card-actions class="center">
          <v-item-group v-model="ventanaTiendas" mandatory>
            <v-item
              v-for="n in $store.state.dataModalShopCart.length"
              :key="`btn-${n}`"
              v-slot="{ active, toggle }"
            >
              <v-btn
                :input-value="active"
                icon
                @click="toggle"
                :class="active ? '' : 'not_clr'"
              >
                <v-icon>mdi-record</v-icon>
              </v-btn>
            </v-item>
          </v-item-group>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { i18n } from "@/plugins/i18n";
import GoogleMapCart from "@/components/googleMaps/GoogleMapCart";
import {
  ORDER_CREATE,
  ORDER_STATU,
  ORDER_CANCEL,
  CONFIG,
} from "@/services/api.js";
import * as nearAPI from "near-api-js";
const { Contract, utils, connect, keyStores, WalletConnection } = nearAPI;
export default {
  name: "headerMenu",
  i18n: require("./i18n"),
  components: { GoogleMapCart },
  // created() {
  //   this.element = document.getElementById("theme");
  //   const theme = localStorage.getItem("theme");
  //   if (theme) {
  //     this.CambiarTheme(theme);
  //   }
  // },
  mounted() {
    this.CambiarLanguaje(localStorage.language);
  },
  data() {
    return {
      modalShopCart: false,
      ventanaTiendas: 0,
      logout: false,
      optionMenu: false,
      messages: 1,
      search: "",
      bloqueoForzado: false,
      dataMenuOptions: {
        expansion: [
          {
            key: "idioma",
            selection: [
              { name: "ingles", key: "US" },
              { name: "español", key: "ES" },
            ],
          },
        ],
      },
      dataMenuLogout: {
        expansion: [
          {
            key: "ajustes",
            selection: [
              {
                key: "perfil",
                to: "/mi-perfil",
              },
              {
                key: "tienda",
                to: "/mi-tienda",
              },
              {
                key: "delivery",
                to: "/mi-delivery",
              },
            ],
          },
        ],
        list: [{ key: "logout" }],
      },
    };
  },
  methods: {
    // CambiarTheme(theme) {
    //   if (theme == 'light') {
    //     this.$store.dispatch("CambiarTheme", { theme, element: this.element });
    //   }
    //   if (theme == 'dark') {
    //     this.$store.dispatch("CambiarTheme", { theme, element: this.element });
    //   }
    // },
    OrderPay(item) {
      var objeto = { id: item.id, statu: "P" };
      this.axios.post(ORDER_STATU, objeto).then(() => {
        // console.log(response)
      });
    },
    OrderPay(item) {
      var objeto = { id: item.id, statu: "P" };
      this.axios.post(ORDER_STATU, objeto).then(() => {
        // console.log(response)
      });
    },
    async payorder(id) {
      console.log(id);
      try {
        const CONTRACT_NAME = "contract1.ccoronel7.testnet";
        // Connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        );
        // Create wallet connection
        const wallet = new WalletConnection(near);
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ["order_payment"],
          sender: wallet.account(),
        });
        if (wallet.isSignedIn()) {
          await contract
            .order_payment(
              {
                id_orden: id.id,
                id_tienda: id.wallet_shop,
              },
              "300000000000000", // attached GAS (optional)
              id.sub_total
            )
            .then((res) => {
              this.$refs.alerts.Alerts("success");
            });
        }
      } catch (e) {
        // Router
        console.log(e);
      }
    },
    formatPrice(price) {
      return utils.format.formatNearAmount(
        price.toLocaleString("fullwide", { useGrouping: false })
      );
    },
    yoctoNEARNEAR: function (yoctoNEAR) {
      const amountInNEAR = utils.format.parseNearAmount(
        this.formatPrice(yoctoNEAR).toString()
      );
      // console.log(amountInNEAR)
    },
    CambiarLanguaje(lang) {
      if (lang === "ES") {
        localStorage.language = lang;
        i18n.locale = lang;
      } else {
        localStorage.language = lang;
        i18n.locale = lang;
      }
    },
    OrderCreate(item) {
      this.bloqueoForzado = true
      this.axios.post(ORDER_CREATE,item).then((res) => {
        var i = this.$store.state.dataModalShopCart.findIndex((obj) => obj.wallet_shop === res.data.orden.wallet_shop)
        this.$store.state.dataModalShopCart[i].statu = res.data.orden.statu
        if (res.status !== 201) {
          this.bloqueoForzado = false
        }
      })
    },
    Logout() {
      localStorage.removeItem("profileid");
      this.$parent.loginNear("logout");
      this.logout = false;
      if (this.$route.name !== "inicio") {
        localStorage.removeItem("store");
        this.$parent.$parent.$parent.$parent.$refs.navbar.to("inicio");
      }
    },
  },
};
</script>

<style src="./Header.scss" lang="scss"></style>
