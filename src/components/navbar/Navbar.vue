<template>
  <v-row id="navbar" class="alignmobile" :style="hideNavbarOnChats">
    <!-- logo -->
    <a class="contlogo align eliminarmobile">
      <img class="logo" src="@/assets/logos/logo.svg" alt="Logo" @click="to('inicio')">
    </a>
    <!-- content -->
    <aside class="contnavbar divcol divrowmobile spacea align">
      <div class="slideSquare" />
      <template v-for="(item, index) in dataNavbar">
        <a v-if="item.mostrar" :key="index" @click="to(item)"
          class="conticon center" :class="{ conticonActive: item.active }">
          <button class="divcol center">
            <img :src="item.icon" alt="Icono">
            <span>{{ $t(item.key) }}</span>
          </button>
        </a>
      </template>
    </aside>
  </v-row>
</template>

<script>
import { PERFIL,PROFILE } from '@/services/api.js'
const icon1 = require("@/assets/icons/inicio-outline.svg");
const icon1Active = require("@/assets/icons/inicio.svg");
const icon2 = require("@/assets/icons/restaurantes-outline.svg");
const icon2Active = require("@/assets/icons/restaurantes.svg");
const icon3 = require("@/assets/icons/tienda-outline.svg");
const icon3Active = require("@/assets/icons/tienda.svg");
const icon4 = require("@/assets/icons/delivery-outline.svg");
const icon4Active = require("@/assets/icons/delivery.svg");

export default {
  name: "navbar",
  i18n: require("./i18n"),
  data() {
    return {
      dataNavbar: [
        {
          key: "inicio",
          icon: icon1,
          active: false,
          mostrar: true,
        },
        {
          key: "restaurantes",
          icon: icon2,
          active: false,
          mostrar: true,
        },
        {
          key: "tienda",
          icon: icon3,
          active: false,
          mostrar: false,
        },
        {
          key: "pedido",
          icon: icon4,
          active: false,
          mostrar: true,
        },
      ]
    };
  },
  mounted () {
    this.VerifyProfile(localStorage.walletid)
    // navbar route verificator
    this.to(this.$router.currentRoute.name)
  },
  computed: {
    hideNavbarOnChats() {
      if (window.innerWidth<=880) {return this.$store.state.drawerChats?'transform:translateY(200px)':null}
    },
  },
  methods: {
    VerifyProfile(user) {
      this.axios.post(PERFIL,{'wallet':user}).then((response) => {
        if (response.data.id) {
          if (response.data.vendedor) {
            var index = this.dataNavbar.findIndex((data) => data.key === 'tienda')
            this.dataNavbar[index].mostrar = true
          }
          if (response.data.pedido) {
            var index = this.dataNavbar.findIndex((data) => data.key === 'pedido')
            this.dataNavbar[index].mostrar = true
          }
          // Set profile.id as localStorage item
          localStorage.setItem('profileid',response.data.id)
        }
      }).catch((e) => {
        console.log(e) // **
      })
    },
    clearAll() {
      this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'inicio')].icon = icon1
      this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'restaurantes')].icon = icon2
      this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'tienda')].icon = icon3
      this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'pedido')].icon = icon4
      this.dataNavbar.forEach(element => {element.active = false});
    },
    to(item) {
      this.clearAll();
      const route = this.$router.currentRoute.name;
      if (item.key == 'inicio' || item == 'inicio') {
        // if external or internal navbar call
        if (item == "inicio") {
          const index = this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'inicio')]
          index.active = true;
          index.icon = icon1Active;
            // push select
            if (item == "inicio"&&route!=='inicio') {this.$router.push({name:'inicio'})}
        } else {
          item.active = true;
          item.icon = icon1Active
          this.$router.push({name:'inicio'})
        }
      } else if (item.key == 'restaurantes' || item == 'restaurantes' || item == 'restauranteTienda') {
        // if external or internal navbar call
        if (item == "restaurantes" || item == 'restauranteTienda') {
          const index = this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'restaurantes')]
          index.active = true;
          index.icon = icon2Active;
            // push select
            if (item == "restaurantes"&&route!=='restaurantes') {this.$router.push('/restaurantes')}
            else if (item == "restaurante-tienda"&&route!=='restaurante-tienda') {this.$router.push('/restaurante-tienda')}
        } else {
          item.active = true;
          item.icon = icon2Active
          this.$router.push('/restaurantes')
        }
      } else if (item.key == 'tienda' || item == 'tienda' || item == 'miMenu') {
        // if external or internal navbar call
        if (item == "tienda" || item == 'miMenu') {
          const index = this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'tienda')]
          index.active = true;
          index.icon = icon3Active;
            // push select
            if (item == "tienda"&&route!=='tienda'
            || item == "miMenu"&&route!=='miMenu') {this.$router.push('/tienda')}
        } else {
          item.active = true;
          item.icon = icon3Active
          this.$router.push('/tienda')
        }
      } else if (item.key == 'pedido' || item == 'pedido') {
        // if external or internal navbar call
        if (item == "pedido") {
          const index = this.dataNavbar[this.dataNavbar.findIndex(data => data.key == 'pedido')]
          index.active = true;
          index.icon = icon4Active;
            // push select
            if (item == "pedido"&&route!=='pedido') {this.$router.push('/pedido')}
        } else {
          item.active = true;
          item.icon = icon4Active
          this.$router.push('/pedido')
        }
      }
    }
  },
};
</script>

<style src="./Navbar.scss" lang="scss" />
