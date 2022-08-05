<template>
  <section id="home" class="parent section">
    <!-- <v-col class="contup relative divrow">
      <aside class="conttag jcenter divcol">
        <h1 class="h7_em">Categorías</h1>
        <h2 class="h9_em">Populares</h2>
      </aside>

      <aside class="sectright">
        <v-carousel
          v-model="carouselCategories"
          hide-delimiters
          :show-arrows="false"
        >
          <template v-for="(item, index) in sliderCategories">
            <v-carousel-item
              v-if="(index + 1) % columnsCategories === 1 || columnsCategories === 1"
              :key="index"
            > 
              <v-row class="fill-height spacea padd2 gap2">
                <template v-for="(n,i) in columnsCategories">
                  <template v-if="(+index + i) < sliderCategories.length">
                    <v-col :key="i" class="paddlateral">
                      <v-card color="var(--clr-card)" class="cartasHome gap2" style="display: flex"
                        :class="{ contIconActive: sliderCategories[+index + i].active }"
                        @click="SelectCardCategories(sliderCategories[+index + i])">
                        <div class="contimg center relative">
                          <img :src="sliderCategories[+index + i].img" alt="Food icon">
                          <div class="square" />
                        </div>
                        <span class="h10_em bold">{{sliderCategories[+index + i].title }}</span>
                      </v-card>
                    </v-col>
                  </template>
                </template>
              </v-row>
            </v-carousel-item>
          </template>
        </v-carousel>

        <aside class="contcontrols end centermobile">
          <v-btn class="left marginrightmobile" icon @click="ChangeSlidesCategories('prev')">
            <v-icon medium style="color: #A4FDDF !important">mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="right marginleftmobile" icon @click="ChangeSlidesCategories('next')">
            <v-icon medium style="color: #A4FDDF !important">mdi-chevron-right</v-icon>
          </v-btn>
        </aside>
      </aside>
    </v-col> -->

    <v-col class="contdown">
      <h1 class="h7_em divwrap bold">{{$t('restaurantes')}}
        <h2 class="h12_em p acenter anim_slide" style="line-height: var(--distance) !important">
          <span>{{$t('mas')}}<br>{{$t('populares')}}</span>
        </h2>
      </h1>

      <aside class="contslider">
        <v-carousel
          v-model="carouselRestaurant"
          hide-delimiters
          :show-arrows="false"
        >
          <template v-for="(item, index) in sliderRestaurant">
            <v-carousel-item
              v-if="(index + 1) % columnsRestaurant === 1 || columnsRestaurant === 1"
              :key="index"
            > 
              <v-row class="fill-height spacea padd2 gap2">
                <template v-for="(n,i) in columnsRestaurant">
                  <template v-if="(+index + i) < sliderRestaurant.length">
                    <v-col class="contslides relative divcol paddlateral" :key="i">
                      <!-- <aside class="contLike">
                        <v-btn icon class="contimg center absolute not_clr"
                          :class="{ contIconActive: sliderRestaurant[+index + i].like }"
                          @click="sliderRestaurant[+index + i].like = !sliderRestaurant[+index + i].like">
                          <img :src="require(`@/assets/icons/corazon${sliderRestaurant[+index + i].like==true?'':'-outline'}.svg`)" alt="Food icon">
                        </v-btn>
                      </aside> -->

                      <img class="images" :src="sliderRestaurant[+index + i].img" alt="Restaurant image">

                      <aside class="divcol" style="padding-inline: 1em">
                        <a @click="$router.push(sliderRestaurant[+index + i].to)" class="h10_em bold">{{sliderRestaurant[+index + i].title }}</a>
                        <p class="h11_em semibold p">{{sliderRestaurant[+index + i].desc }}</p>
                      </aside>
                    </v-col>
                  </template>
                </template>
              </v-row>
            </v-carousel-item>
          </template>
        </v-carousel>

        <aside class="contcontrols end centermobile">
          <v-btn class="left marginrightmobile" icon @click="ChangeSlidesRestaurant('prev')">
            <v-icon medium style="color: #A4FDDF !important">mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="right marginleftmobile" icon @click="ChangeSlidesRestaurant('next')">
            <v-icon medium style="color: #A4FDDF !important">mdi-chevron-right</v-icon>
          </v-btn>
        </aside>
      </aside>
    </v-col>
  </section>
</template>

<script>
export default {
  name: "inicio",
  i18n: require("./i18n"),
  data() {
    return {
      carouselRestaurant: 0,
      sliderRestaurant: [
        {
          img: require("@/assets/images/r1.png"),
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r2.png"),
          title: "Nodoo",
          desc: "Asiático // Ramen",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r3.png"),
          title: "La casa de Lola",
          desc: "Comida Mediterránea",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r1.png"),
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r2.png"),
          icon: "-outline",
          like: false,
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          to: "/"
        },
        {
          img: require("@/assets/images/r3.png"),
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r1.png"),
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r2.png"),
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          like: false,
          to: "/"
        },
        {
          img: require("@/assets/images/r3.png"),
          title: "La Tagliatella",
          desc: "Especialidad en pasta",
          like: false,
          to: "/"
        },
      ]
    }
  },
  computed: {
    columnsRestaurant() {
      if (this.$vuetify.breakpoint.xl) {return 3}
      if (this.$vuetify.breakpoint.lg) {return 3}
      if (this.$vuetify.breakpoint.md) {return 3}
      if (this.$vuetify.breakpoint.sm) {return 2}
      return 1;
    }
  },
  methods: {
    ChangeSlidesRestaurant(item) {
      if (item == "next") {this.carouselRestaurant++}
      if (item == "prev") {this.carouselRestaurant--}
    },
  },
};
</script>

<style src="./Home.scss" lang="scss" />
