<template>
  <section id="restaurantes" class="parent relative">
    <v-col class="contup relative divcol">
      <h1 class="h7_em vermobile">{{$t('restaurantes')}}</h1>
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
    </v-col>

    <v-col class="contdown">
      <aside class="conttag jcenter divcol eliminarmobile">
        <h1 class="h7_em">{{$t('restaurantes')}}</h1>
      </aside>
      <section class="contRestaurantList">
        <v-card v-for="(item,i) in dataRestaurant" :key="i" :style="WidthListener"
          class="card divcol" v-ripple="activeRipple?{class: 'activeRipple'}:''">
          <img class="images" :src="item.logo" alt="Restaurant image">

          <aside class="contcard space">
            <a class="h10_em bold" @click="ToTienda(item)"
              @mouseover="activeRipple=true" @mouseleave="activeRipple=false" >
              {{item.name}}
            </a>
            <span class="normal tnone tend">{{item.hours}}</span>
          </aside>
        </v-card>
      </section>
    </v-col>
  </section>
</template>

<script>
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection, Contract } = nearAPI;
export default {
  name: "restaurantes",
  i18n: require("./i18n"),
  data() {
    return {
      activeRipple: false,
      filters: {
        filterName: null,
        filterExcluir: [],
        filterIncluir: [],
      },
      dataRestaurant: []
    }
  },
  mounted() {
    this.get_all_stores()
  },
  computed: {
    WidthListener() {
      if (this.dataRestaurant.length <= 3) {return 'max-width: 20em'}
    }
  },
  methods: {
    async get_all_stores() {
      try {
        const CONTRACT_NAME = 'contract1.ccoronel7.testnet'
        // Connect to NEAR
        const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
        // Create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          viewMethods: ['get_all_stores'],
          sender: wallet.account()
        })

          await contract.get_all_stores({
          }).then((res) => {
            // console.log(res)
            this.dataRestaurant = res
          })
      } catch (e) {
        // Router
        console.log(e)
      }
    },
    ToTienda(item) {
      // console.log(item)
      this.$store.commit("get_owner", item.owner_id)
        this.$router.push({path: '/restaurante-tienda'})
    }
  },
};
</script>

<style src="./Restaurantes.scss" lang="scss" />
