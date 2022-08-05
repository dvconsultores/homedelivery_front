<template>
  <v-app id="layout" :style="`background-image: url('${$store.state.baseURL}themes/${$store.state.theme}/bg.png')`">
    <Navbar ref="navbar" style="z-index: 11" />
    <Header ref="header" style="z-index: 10" />
    <DrawerChats style="z-index: 20"></DrawerChats>
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import DrawerChats from "@/components/drawerChats/DrawerChats.vue"
import Navbar from "@/components/navbar/Navbar";
import Header from "@/components/header/Header";
// import Footer from "@/components/footer/Footer";
import "./Layout.scss";
/*
--Uso del GSAP:

1-npm install gsap

2-
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

3-
mounted() {
  gsap.to(".animation1", {
    scrollTrigger: {
      trigger: ".animation1",
      endTrigger: ".animationSection1",
      start: "bottom 80%",
      end: "top 20%",
      toggleActions: "restart pause reverse"
    },
    x: -400,
    opacity: 0,
    rotate: 80,
    duration: 0.3
  });
}
*/
export default {
  name: "layout",
  // components: { Footer, Header, Navbar },
  components: { Header, Navbar, DrawerChats },
  mounted() {if (this.$router.currentRoute.path == '/') {this.$refs.navbar.to('inicio')}},
}
</script>
