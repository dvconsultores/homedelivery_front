<template>
  <section id="miTienda" class="parentForm section">
    <Alerts ref="alerts"></Alerts>
    <MenuForms ref="menu"></MenuForms>
    <v-col class="contmiperfil divcol gap2">
      <aside class="contup divrow">
        <v-btn class="back" icon @click="$root.$children[0].$children[0].$children[0].$children[0].to('tienda')">
          <v-icon size="clamp(1.4em, 2.2vw, 2.2em)">mdi-arrow-left</v-icon>
        </v-btn>
        <div style="margin-left: 5mm" class="divcol">
          <h1 class="h7_em">Mi Delivery</h1>
          <h2 class="h9_em">Introduzca la información del Delivery</h2>
        </div>
      </aside>
      <aside class="contdown">
        <v-card color="transparent">
          <label for="type" class="h10_em"> Tipo de Vehículo </label>
          <v-select id="type" v-model="store.type" :items="v_type" solo></v-select>
        </v-card>
        
        <v-card color="transparent">
          <label for="mark" class="h10_em">Marca del vehículo</label>
          <v-text-field id="mark" v-model="store.mark" solo></v-text-field>
        </v-card>
        
        <v-card color="transparent">
          <label for="model" class="h10_em"> Modelo del Vehículo </label>
          <v-text-field id="model" v-model="store.model" solo></v-text-field>
        </v-card>

        <v-card color="transparent">
          <label for="color" class="h10_em"> Color del Vehículo </label>
          <v-text-field id="color" v-model="store.color" solo></v-text-field>
        </v-card>

        <v-card color="transparent">
          <label for="plaque" class="h10_em"> Placa del Vehículo </label>
          <v-text-field id="plaque" v-model="store.plaque" solo></v-text-field>
        </v-card>

        <v-card color="transparent" class="jstart">
          <div class="contcheckbox divcol acenter" @click="state=!state">
            <v-tooltip top color="var(--clr-btn)">
              <template v-slot:activator="{ on, attrs }">
                <label v-on="on" v-bind="attrs" for="delivery" class="h10_em delivery"> {{state?'Activo':'Inactivo'}} </label>
              </template>
              <span class="clr_text_btn">Activar para aparecer en búsquedas</span>
            </v-tooltip>

            <v-btn 
              id="delivery"
              v-model="perfil.delivery"
              color="var(--clr-card-2)">
              <img  v-if="state" src="@/assets/icons/check.svg" alt="check button for delivery">
            </v-btn>
          </div>
        </v-card>
      </aside>

      <aside class="contsubmit center">
        <v-btn v-if="save" @click="PutStore()">
          <span class="h10_em">Editar</span>
        </v-btn>
        <v-btn v-else @click="SetStore()">
          <span class="h10_em">Guardar</span>
        </v-btn>
      </aside>
    </v-col>
  </section>
</template>

<script>
import * as nearAPI from "near-api-js";
import { CONFIG, IPFS } from "@/services/api";
const { connect, keyStores, WalletConnection, Contract } = nearAPI;
import Alerts from '@/components/alerts/Alerts.vue'
import MenuForms from '../components/MenuForms.vue'

export default {
  name: "miDelivery",
  components: { MenuForms, Alerts },
  data() {
    return {
      url: null,
      image: null,
      walletid: null,
      save: false,
      // foto: false,
      // foto2: false,
      store: {},
      perfil: { wallet: localStorage.getItem("walletid"), direccion:null, location: null },
      v_type: ['Automovil', 'Moto', 'Bicicleta'],
      state: false,
    };
  },
  mounted() {
    this.$parent.$parent.$parent.$refs.navbar.to({ key: null });
    this.SaveData();
  },
  methods: {
    ImagePreview() {
      this.url = URL.createObjectURL(this.store.logo);
    },
    SaveData() {
      if (
        typeof localStorage.store !== "undefined" &&
        localStorage.store !== "null"
      ) {
        this.save = true;
        const d = JSON.parse(localStorage.store);
        // console.log(d)
        this.store = d;
        this.url =  d.logo,
        this.store.logo = d.logo
      }
    },
    async PutStore() {
      const data = localStorage.store;
      localStorage.store = JSON.stringify(this.store);
      try {
        const CONTRACT_NAME = "contract1.ccoronel7.testnet";
        // connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        );
        // create wallet connection
        const wallet = new WalletConnection(near);
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ["put_store"],
          sender: wallet.account(),
        });
        if (wallet.isSignedIn()) {
          await contract
            .put_store({
              owner_id: wallet.getAccountId(),
              name: this.store.name,
              address: this.store.address,
              phone: this.store.phone,
              wallet: this.store.wallet,
              logo: this.store.logo,
            })
            .then(() => {
              // console.log(res);
            });
        }
      } catch (e) {
        localStorage.store = data;
        console.log(e);
      }
    },
    async SetStore() {
      try {
        const CONTRACT_NAME = "contract1.ccoronel7.testnet";
        const direccionIpfs = ".ipfs.dweb.link";
        // Connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        );
        // Create wallet connection
        const wallet = new WalletConnection(near);
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ["set_store"],
          sender: wallet.account(),
        });
        if (wallet.isSignedIn()) {
          let horario = {inicio: this.store.apertura, cierre: this.store.inicio}
          const formData = new FormData();
          formData.append("file", this.store.logo);
          await this.axios.post(IPFS, formData).then((res) => {
            contract
              .set_store({
                owner_id: wallet.getAccountId(),
                name: this.store.name,
                address: this.store.address,
                phone: this.store.phone,
                wallet: this.store.wallet,
                schedule: JSON.stringify(horario),
                logo:
                  "https://" + res.data.data + direccionIpfs + "/" + res.data.nombre,
              })
               this.store.logo =
              "https://" + res.data.data + direccionIpfs + "/" + res.data.nombre;
              localStorage.setItem("store", JSON.stringify(this.store));
          });
        }
      } catch (e) {
        localStorage.removeItem("store");
        console.log(e);
      }
    },
    // AcceptVerificator(item) {
    //   if (item == "delivery") {
    //     this.perfil.delivery = true
    //     this.foto = true
    //   }
    //   if (item == "vendedor") {
    //     this.perfil.vendedor = true
    //     this.foto2 = true
    //   }
    // },
    // CancelVerificator(item) {
    //   if (item == "delivery") {
    //     this.perfil.delivery =  false
    //     this.foto = false
    //   }
    //   if (item == "vendedor") {
    //     this.perfil.vendedor = false
    //     this.foto2 = false
    //   }
    // }
  },
};
</script>

<style src="./MiDelivery.scss" lang="scss" />
