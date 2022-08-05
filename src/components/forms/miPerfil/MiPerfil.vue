<template>
  <section id="miPerfil" class="parentForm section">
    <Alerts ref="alerts"></Alerts>
    <MenuForms ref="menu"
      @getDirection="(direccion,coordinates)=>{perfil.direccion=direccion; perfil.location=coordinates}"
    ></MenuForms>
    <v-col class="contmiperfil divcol gap2">
      <aside class="contup divcol">
        <h1 class="h7_em">{{$t('miPerfil')}}</h1>
        <h2 class="h9_em">{{$t('subtitle')}}</h2>
      </aside>

      <aside class="contdown">
        <v-card color="transparent">
          <label for="username" class="h10_em">
            {{$t('nombre')}}
          </label>

          <v-text-field
            id="username"
            v-model="perfil.nombre"
            solo
          ></v-text-field>
        </v-card>
        <v-card color="transparent">
          <label for="walet" class="h10_em">
            Wallet
          </label>

          <v-text-field
            id="wallet"
            v-model="perfil.wallet"
            solo
            disabled
          ></v-text-field>
        </v-card>
        <v-card color="transparent">
          <label for="telefono" class="h10_em">
            {{$t('telefono')}}
          </label>

          <v-text-field
            id="telefono"
            v-model="perfil.telefono"
            solo
          ></v-text-field>
        </v-card>
        <v-card color="transparent">
          <label class="h10_em" @click="$refs.menu.modalDirection=true">
            {{$t('direccion')}}
          </label>

          <v-sheet color="transparent" style="cursor:pointer" @click="$refs.menu.modalDirection=true">
            <v-text-field
              v-model="perfil.direccion"
              solo
              disabled
            ></v-text-field>
          </v-sheet>
        </v-card>
        <v-card color="transparent">
          <label for="foto" class="h10_em">
            {{$t('foto')}}
          </label>
            <v-file-input
              v-model="image"
              id="foto"
              class="input-file"
              prepend-icon=""
              solo
              :clearable="false"
              @change="ImagePreview()"
            >
              <template v-slot:selection>
                <img :src="url" alt="Image selected">
              </template>
            </v-file-input>
          </v-card>
          <v-card color="transparent" class="gap_checkbox">
          <div 
            class="contcheckbox acenter">
            <v-btn 
              v-model="perfil.delivery"
              color="var(--clr-card-2)"
              id="delivery"
              class="openDeliveryAlert">
              <img  v-if="foto == true" src="@/assets/icons/check.svg" alt="check button for delivery">
            </v-btn>
            <label for="delivery" class="h10_em">
              {{$t('preguntaDelivery')}}
            </label>
          </div>
          <div
            class="contcheckbox acenter">
            <v-btn 
              v-model="perfil.vendedor"
              color="var(--clr-card-2)"
              id="vendedor"
              class="openVendedorAlert">
              <img v-if="foto2 == true" src="@/assets/icons/check.svg" alt="check button for merchant">
            </v-btn>
            <label for="vendedor" class="h10_em">
              {{$t('preguntaVendedor')}}
            </label>
          </div>
        </v-card>
      </aside>

      <aside class="contsubmit center">
        <v-btn @click="SaveProfile(perfil)">
          <span class="h10_em">{{$t('guardar')}}</span>
        </v-btn>
      </aside>
    </v-col>
  </section>
</template>

<script>
import Alerts from '@/components/alerts/Alerts.vue'
import MenuForms from '../components/MenuForms.vue'
import { PERFIL,PROFILE } from '@/services/api.js'
export default {
  name: "miPerfil",
  components: { MenuForms, Alerts },
  i18n: require("./i18n"),
  data() {
    return {
      url: null,
      image: null,
      walletid: null,
      foto: false,
      foto2: false,
      perfil: {wallet: localStorage.getItem('walletid'), direccion:null, location: null},
    }
  },
  mounted(){
    this.$parent.$parent.$parent.$refs.navbar.to({key: null});
    this.VerifyProfile({wallet:this.perfil.wallet})

    if (this.perfil.wallet && this.perfil.wallet !== 'null') {
      this.VerifyProfile({wallet:this.perfil.wallet})
    } else {
      this.$router.push({name:'inicio'})
    }
  },
  methods: {
    ImagePreview() {
      this.url= URL.createObjectURL(this.image)
    },
    VerifyProfile(item) {
      this.axios.post(PERFIL,item).then((response) => {
        this.perfil=response.data
        this.foto = response.data.delivery
        this.foto2 = response.data.vendedor
      }).catch((e) => {
        console.log(e)
      })
    },
    SaveProfile(item) {
      if (item.id){
        item.location = JSON.stringify(item.location)
        this.axios.put(PROFILE+item.id+'/',item).then((response) => {
          this.perfil=response.data
          this.$refs.alerts.Alerts('success');
        })
      } else {
        item.location = JSON.stringify(item.location)
        // console.log(item)
        this.axios.post(PROFILE,item).then((response) => {
          this.perfil=response.data
          this.$router.push({name:'inicio'})
          this.$refs.alerts.Alerts('success');
        })
      }
    },
    AcceptVerificator(item) {
      if (item == "delivery") {
        this.perfil.delivery = true
        this.foto = true
      }
      if (item == "vendedor") {
        this.perfil.vendedor = true
        this.foto2 = true
      }
    },
    CancelVerificator(item) {
      if (item == "delivery") {
        this.perfil.delivery =  false
        this.foto = false
      }
      if (item == "vendedor") {
        this.perfil.vendedor = false
        this.foto2 = false
      }
    },
    showAlert() {
      // mostrar alerta completado
      this.$refs.alerts.Alerts('success');
      // mostrar alerta cancelado
      this.$refs.alerts.Alerts('cancel');
    }
  },
};
</script>

<style src="./MiPerfil.scss" lang="scss" />
