<template>
  <section id="alerts">
    <v-snackbar
      v-for="(item, index) in dataAlerts" :key="index"
      v-model="item.model"
      centered
      right
      transition="slide-x-reverse-transition"
      color="var(--clr-btn)"
    >
      <template v-slot:action="{ attrs }">
        <v-btn class="h10_em semibolbold" color="red" text rounded v-bind="attrs" @click="item.model=false">
          {{$t('close')}}
        </v-btn>
      </template>

      <aside class="alert-content divcol">
        <div class="divrow acenter">
          <v-icon :style="`color: ${item.color} !important`" size="2.5rem">{{ item.icon }}</v-icon>
          <h3 class="h8_em p bold" :style="`color: ${item.color} !important`">{{ $t(item.title) }}</h3>
        </div>

        <span class="h11_em semibold">{{ $t(item.desc) }}</span>
      </aside>
    </v-snackbar>
  </section>
</template>

<script>
export default {
  name: "alerts",
  i18n: require("./i18n"),
  data() {
    return {
      alert: true,
      dataAlerts: []
    };
  },
  methods: {
    ClearAlerts() {this.dataAlerts=[]},
    Alerts(key, title, desc) {

      // clear alerts
      setTimeout(() => {
        this.ClearAlerts()
      }, 5000);

      // create alert
      if (title&&desc) {
        var alert = {
          key: key,
          title: title,
          desc: desc,
          icon: key=='success'?'mdi-check-circle':key=='cancel'?'mdi-close-circle':null,
          color: key=='success'?'#A4FDDF':key=='cancel'?'rgb(200, 0, 0)':null,
          model: true,
        }
      } else if (title) {
        var alert = {
          key: key,
          title: title,
          desc: `text${key.replace(/^\w/, (c) => c.toUpperCase())}`,
          icon: key=='success'?'mdi-check-circle':key=='cancel'?'mdi-close-circle':null,
          color: key=='success'?'#A4FDDF':key=='cancel'?'rgb(200, 0, 0)':null,
          model: true,
        }
      } else if (desc) {
        var alert = {
          key: key,
          title: key,
          desc: desc,
          icon: key=='success'?'mdi-check-circle':key=='cancel'?'mdi-close-circle':null,
          color: key=='success'?'#A4FDDF':key=='cancel'?'rgb(200, 0, 0)':null,
          model: true,
        }
      } else {
        var alert = {
          key: key,
          title: key,
          desc: `text${key.replace(/^\w/, (c) => c.toUpperCase())}`,
          icon: key=='success'?'mdi-check-circle':key=='cancel'?'mdi-close-circle':null,
          color: key=='success'?'#A4FDDF':key=='cancel'?'rgb(200, 0, 0)':null,
          model: true,
        }
      }
      this.dataAlerts.push(alert)
    },
  }
};
</script>

<style src="./Alerts.scss" lang="scss"></style>
