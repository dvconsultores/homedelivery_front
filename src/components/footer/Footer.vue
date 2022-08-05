<template>
  <v-footer id="footer" color="transparent"
    height="100px" absolute>
    <v-row no-gutters class="space">
      <!-- content -->
      <aside class="divrow">
        <div v-for="(item, index) in dataIconos" v-bind:key="index"
          class="padd2 paddvertical">
          <a :href="item.link" target="_blank">
            <v-icon large>{{ item.icon }}</v-icon>
          </a>
        </div>
      </aside>

      <aside class="divrow" style="gap: 5em">
        <div class="divrow" style="cursor: pointer">
          <span class="h10_em" style="font-weight: bold">EN</span>
          <v-icon small>mdi-chevron-down</v-icon>
        </div>
        <span class="h10_em center" style="font-weight: bold; gap: 5px">Powered by 
          <img class="filter" src="" alt="near">
        </span>
      </aside>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      dataIconos: [
        {
          icon: "discord",
          link: "https://discord.com"
        },
        {
          icon: "mdi-twitter",
          link: "https://twitter.com"
        },
        {
          icon: "mdi-youtube",
          link: "https://www.youtube.com"
        },
        {
          icon: "mdi-instagram",
          link: "https://www.instagram.com"
        },
      ]
    }
  }
}
</script>

<style src="./Footer.scss" lang="scss" />
