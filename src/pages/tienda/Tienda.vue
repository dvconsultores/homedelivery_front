<template>
  <section id="tienda" class="parent">
    <ModalTienda ref="menu"></ModalTienda>
    <v-col class="contup astart">
      <section class="contbanner jspace">
        <v-img
          :src="data.logo"
          class="white--text align-end scroll_h"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <v-card-title class="h6_em bold anim_moveup">
            {{data.name}}
            <v-tooltip right color="var(--clr-btn)">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="not_clr" icon v-bind="attrs" v-on="on" to="/mi-tienda" :ripple="false">
                  <v-icon class="not_clr" color="var(--clr-text-btn)">mdi-clipboard-edit</v-icon>
                </v-btn>
              </template>
              <span class="clr_text_btn">{{$t('editarTienda')}}</span>
            </v-tooltip>
          </v-card-title>
        </v-img>

        <aside class="contHistorial fill">
          <div v-for="n in 19" :key="n" class="decoration" :style="`--distance:${(n+1)*4}`" />
          <h3 class="h8_em tcenter not_clr">{{$t('historialOrdenes')}}</h3>
          <v-data-table
            id="dataTable"
            :headers="headersHistorial"
            :items="dataHistorial"
            hide-default-footer
            :mobile-breakpoint="1060"
          >
            <template v-slot:[`item.id`]="{ item }">
              <v-btn disabled icon small class="bold">
                {{ item.id }}
              </v-btn>
            </template>

            <template v-slot:[`item.statu`]="{ item }">
              <v-chip :color="item.statu=='A'?'#3CD4A0':'#ff4081'">
               <span v-if="item.statu==='R'" class="bold">{{$t('revisar')}}</span>
               <span v-if="item.statu==='N'" class="bold">{{$t('porPagar')}}</span>
               <span v-if="item.statu==='P'" class="bold">{{$t('preparando')}}</span>
               <span v-if="item.statu==='C'" class="bold">{{$t('enCamino')}}</span>
               <span v-if="item.statu==='E'" class="bold">{{$t('entregando')}}</span>
               <span v-if="item.statu==='B'" class="bold">{{$t('recibido')}}</span>
               <span v-if="item.statu==='X'" class="bold">{{$t('cancelado')}}</span>
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom color="var(--clr-btn)">
                <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-on="on" v-bind="attrs" @click=" $refs.menu.modalTienda=true, $refs.menu.get_orders_details(item.id), $refs.menu.get_orders(item.id)">
                  <v-icon small>mdi-eye-plus</v-icon>
                </v-btn>
                </template>
                <span class="clr_text_btn tnone">{{$t('verInformaciónCompleta')}}</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </aside>
      </section>
    </v-col>

    <v-col class="contdown divcol margin2top">
      <h2 class="h6_em center">{{$t('miMenu')}}
        <v-tooltip right color="var(--clr-btn)">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="not_clr margin1left" icon v-bind="attrs" v-on="on" to="/mi-menu" :ripple="false">
              <v-icon size="2em" class="not_clr" color="var(--clr-btn-2)">mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          <span class="clr_text_btn">{{$t('organizarMenu')}}</span>
        </v-tooltip>
      </h2>

      <!-- <aside class="contFilters divwrap acenter">
        <v-btn text class="searchBtn semibold">
          {{$t('filtrar')}}
        </v-btn>

        <v-text-field
          prepend-inner-icon="mdi-magnify"
          solo
          hide-details
          class="search"
        ></v-text-field>

        <v-btn class="filtro">
          <v-icon size="2.5em" color="var(--clr-text-btn)" class="not_clr">mdi-filter</v-icon>
        </v-btn>

        <v-select
          v-model="filters.filterName"
          :items="$t('filters.filterName.by')"
          :label="$t('filters.filterName.label')"
          hide-details
          filled
          class="select"
        ></v-select>

        <v-select
          v-model="filters.filterExcluir"
          :items="$t('filters.filterExcluir')"
          :label="$t('excluir')"
          filled
          hide-details
          multiple
          class="select"
        >
          <template v-slot:selection="{item, index}">
            <v-chip color="#FFFFFF" v-if="index === 0">
              <span class="semibold">{{item}}</span>
            </v-chip>
            <span
              v-if="index === 1"
              class="black--text text-caption"
            >
              (+{{ $t('filters.filterExcluir').length - 1 }})
            </span>
          </template>
        </v-select>

        <v-select
          v-model="filters.filterIncluir"
          :items="$t('filters.filterIncluir')"
          :label="$t('incluir')"
          hide-details
          filled
          multiple
          class="select"
        >
          <template v-slot:selection="{item, index}">
            <v-chip color="#FFFFFF" v-if="index === 0">
              <span class="semibold">{{item}}</span>
            </v-chip>
            <span
              v-if="index === 1"
              class="black--text text-caption"
            >
              (+{{ $t('filters.filterIncluir').length - 1 }})
            </span>
          </template>
        </v-select>
      </aside> -->

      <section class="contRestaurantList">
        <v-card v-for="(item,i) in dataMenuTienda" :key="i" class="card divcol" :style="WidthListener">
          <div class="contImages">
            <label class="h9_em">{{ item.name }}</label>
            <img class="images" :src="item.img" alt="Restaurant image">
          </div>

          <aside class="contcard space">
            <p class="h10_em semibold">{{item.description}}</p>

            <div class="contPrice divcol tend">
              <div class="acenter">
                <img class="logoNear" src="@/assets/logos/near.svg" alt="near">
                <span class="price normal">{{formatPrice(item.price)}}</span>
              </div>
              <!-- <span class="not_clr">(${{item.price}})</span> -->
            </div>
          </aside>
        </v-card>
      </section>
    </v-col>
  </section>
</template>

<script>
import ModalTienda from './ModalTienda.vue';
import * as nearAPI from "near-api-js";
import { ORDER, CONFIG, ORDERD} from "@/services/api";
const { connect, keyStores, WalletConnection, Contract, utils } = nearAPI;

export default {
  name: "tienda",
  i18n: require("./i18n"),
  components: { ModalTienda },
  data() {
    return {
      data: {},
      filters: {
        filterName: null,
        filterExcluir: [],
        filterIncluir: [],
      },
      perfil: {
        location:{
          direccion: 'direccion del lugar',
          coordinates: { lat:9.988903846136667, lng:-67.6891094161248 }
        }
      },
      dataMenuTienda: [],
      headersHistorial: [
        { value: "id", text: "Número de orden", align: "center" },
        { value: "client_name", text: "Nombre cliente", align: "center" },
        { value: "statu", text: "Estado", align: "center" },
        { value: "actions", align: "center", sortable: false },
      ],
      dataHistorial: [
      ],
      intervalo: null,
    }
  },
  mounted() {
    this.initComponentOrdersShop()
  },
  computed: {
    WidthListener() {if (this.dataMenuTienda.length <= 3) {return 'max-width: 20em'}}
  },
  methods: {
    async initComponentOrdersShop () {
      const re_1 = await this.VerifyStore();
      const re_2 =  await this.get_menu();
      this.intervalo = setInterval(this.get_orders, 3000);
    },
    get_orders() {
      this.axios.get(ORDER+"/?wallet_shop=" + this.data.wallet).then((response) => {
        // console.log(response)
        this.dataHistorial = response.data
      })
    },
    get_orders_details(id) {
        this.axios.get(ORDERD+"/?order=" + id).then(() => {
          // console.log(response)
        })
    },
    formatPrice(price) {
      return utils.format.formatNearAmount(
        price.toLocaleString("fullwide", { useGrouping: false })
      );
    },
    async get_menu() {
      try {
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
        if (wallet.isSignedIn()) {
          await contract
            .get_menu({
              user_id: wallet.getAccountId(),
            })
            .then((res) => {
              this.dataMenuTienda = res.platillos;
              return true
            });
        }
      } catch (e) {
        // Router
        console.log(e);
        return false
      }
    },
    async VerifyStore() {
      try {
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
        if (wallet.isSignedIn()) {
          await contract
            .get_store({
              user_id: wallet.getAccountId(),
            })
            .then((res) => {
              this.data = res;
              localStorage.setItem("store", JSON.stringify(this.data));
              return true
            });
        }
      } catch (e) {
        // Router
        this.$router.push({ name: "miTienda" });
        return false
      }
    },
  },
};
</script>

<style src="./Tienda.scss" lang="scss" />
