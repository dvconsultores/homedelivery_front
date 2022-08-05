<template>
  <section id="miTienda" class="parentForm section">
    <Alerts ref="alerts"></Alerts>
    <MenuForms ref="menu"
      @getDirection="(direccion,coordinates)=>{store.address=direccion; store.location=coordinates}"
    ></MenuForms>
    <v-col class="contmiperfil divcol gap2">
      <aside class="contup divrow">
        <v-btn class="back" icon @click="$root.$children[0].$children[0].$children[0].$children[0].to('tienda')">
          <v-icon size="clamp(1.4em, 2.2vw, 2.2em)">mdi-arrow-left</v-icon>
        </v-btn>
        <div style="margin-left: 5mm" class="divcol">
          <h1 class="h7_em">Mi Tienda</h1>
          <h2 class="h9_em">Introduzca la información de la tienda</h2>
        </div>
      </aside>
      <aside class="contdown">
        <v-card color="transparent">
          <label for="walet" class="h10_em"> Nombre de la tienda </label>
          <v-text-field id="wallet" v-model="store.name" solo></v-text-field>
        </v-card>
        <v-card color="transparent">
          <label for="walet" class="h10_em"> Wallet de la tienda </label>
          <v-text-field id="wallet" v-model="store.wallet" solo></v-text-field>
        </v-card>
        <v-card color="transparent">
          <label class="h10_em" @click="$refs.menu.modalDirection=true">
            Dirección
          </label>

          <v-sheet color="transparent" style="cursor:pointer" @click="$refs.menu.modalDirection=true">
            <v-text-field
              v-model="store.address"
              solo
              disabled
            ></v-text-field>
          </v-sheet>
        </v-card>
        <v-card color="transparent">
          <label for="telefono" class="h10_em"> Teléfono </label>

          <v-text-field id="telefono" v-model="store.phone" solo></v-text-field>
        </v-card>
        <v-card color="transparent">
          <label for="foto" class="h10_em"> Logo de la tienda </label>

          <v-file-input
            v-model="store.logo"
            id="foto"
            solo
            prepend-icon=""
            :clearable="false"
            class="input-file"
            @change="ImagePreview()"
          >
            <template v-slot:selection>
              <img :src="url" alt="Image selected" />
            </template>
          </v-file-input>
        </v-card>
        <v-card color="transparent" class="cardHorario" style="display:flex">
          <aside class="divcol">
            <label for="apertura" class="h10_em"> Horario de apertura </label>
            <v-menu
              ref="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="perfil.apertura"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  id="apertura"
                  v-model="perfil.apertura"
                  type="time" solo
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="store.apertura"
                full-width scrollable
                @click:minute="$refs.menu1.save(store.apertura)"
              ></v-time-picker>
            </v-menu>
          </aside>

          <aside class="divcol">
            <label for="cierre" class="h10_em"> Horario de cierre </label>
            <v-menu
              ref="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="perfil.cierre"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  id="cierre"
                  v-model="store.cierre"
                  type="time" solo
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="store.cierre"
                full-width scrollable
                @click:minute="$refs.menu2.save(store.cierre)"
              ></v-time-picker>
            </v-menu>
          </aside>
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
  name: "miTienda",
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
      perfil: { wallet: localStorage.getItem("walletid"), direccion:null, location: null,
        apertura: '', cierre: '' },
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
              this.$refs.alerts.Alerts('success');
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
          let horario = {inicio: this.store.apertura, cierre: this.store.cierre}
          const formData = new FormData();
          formData.append("file", this.store.logo);
          await this.axios.post(IPFS, formData).then((res) => {
            contract.set_store({
                owner_id: wallet.getAccountId(),
                name: this.store.name,
                address: "this.store.address",
                location: "JSON.stringify(this.store.location)",
                phone: this.store.phone,
                wallet: this.store.wallet,
                schedule: "JSON.stringify(horario)",
                logo:
                  "https://" + res.data.data + direccionIpfs + "/" + res.data.nombre,
              }).then((res) => {
                // console.log(res);
                this.$refs.alerts.Alerts('success');
                this.store.logo =
                "https://" + res.data.data + direccionIpfs + "/" + res.data.nombre;
                this.store.horario = horario
                localStorage.setItem("store", JSON.stringify(this.store));
              }
            );
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

<style src="./MiTienda.scss" lang="scss" />
