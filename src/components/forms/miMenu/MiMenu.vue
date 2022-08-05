<template>
  <section id="miMenu" class="parentForm section">
    <Alerts ref="alerts"></Alerts>
    <MenuForms ref="menu"></MenuForms>
    <v-col class="contmimenu divcol gap2">
      <aside class="contup divrow">
        <v-btn class="back" icon to="/tienda">
          <v-icon size="clamp(1.4em, 2.2vw, 2.2em)">mdi-arrow-left</v-icon>
        </v-btn>

        <div class="divcol">
          <h1 class="h7_em">Mi Menú</h1>
          <h2 class="h9_em">Organiza tu menu</h2>
        </div>
      </aside>

      <aside class="contdown">
        <v-card color="transparent">
          <label for="foto" class="h10_em"> Foto del platillo </label>

          <v-file-input
            v-model="menu.img"
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
        <v-card color="transparent">
          <label for="nombre" class="h10_em"> Nombre del plato </label>

          <v-text-field v-model="menu.name" id="telefono" solo></v-text-field>
        </v-card>
        <v-card color="transparent">
          <aside>
            <label for="categoria" class="h10_em"> Categoria </label>
          </aside>
          <v-select
            v-model="menu.category"
            :items="listCategoria"
            item-text="name"
            item-value="name"
            id="categoria"
            solo
          >
          </v-select>
        </v-card>
        <v-card color="transparent">
          <label for="descripcion" class="h10_em"> Descripción </label>

          <v-text-field
            v-model="menu.description"
            id="descripcion"
            solo
          ></v-text-field>
        </v-card>
        <v-card
          color="transparent"
          style="display: flex"
          class="space contprecio"
        >
          <aside>
            <label for="precio" class="h10_em"> Precio </label>

            <v-text-field v-model="menu.price" id="precio" type="number" solo></v-text-field>
          </aside>
          <v-btn @click="Addmenu()" class="h11_em"> Agregar </v-btn>
        </v-card>
      </aside>

      <aside class="contListMenu divcol">
        <v-card
          v-for="(item, i) in listmenu" :key="i"
          color="transparent"
          class="space"
          style="display: flex"
        >
          <aside class="firstAside acenter gap1">
            <img class="foto" :src="item.img" alt="Menu Image" />
            <div class="child1 divcol jcenter">
              <label class="h9_em">{{ item.name }}</label>
              <span class="h9_em semibold">{{ item.category }}</span>
              <div class="acenter gap1">
                <span class="h10_em semibold center">{{ formatPrice(item.price) }} 
                  <img class="near" src="@/assets/logos/near.svg" alt="near">
                </span>
                <span class="h10_em clr_label_2">(${{ item.dollar }})</span>
              </div>
            </div>
          </aside>

          <p class="h10_em semibold p tcentermobile">{{ item.description }}</p>

          <aside class="controls divcol acenter spacee" style="gap: 0.5em">
            <!-- <v-tooltip bottom color="var(--clr-btn)">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="add" icon v-bind="attrs" v-on="on">
                  <img src="@/assets/icons/pencil.svg" alt="Add Menu" />
                </v-btn>
              </template>
              <span class="clr_text_btn">Editar</span>
            </v-tooltip> -->

            <v-tooltip bottom color="#ff4081">
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="delete_menu(item.id)" icon v-bind="attrs" v-on="on">
                  <img src="@/assets/icons/eliminar.svg"  />
                </v-btn>
              </template>
              <span style="color: #ffffff !important">Eliminar</span>
            </v-tooltip>
          </aside>
        </v-card>
      </aside>
    </v-col>
  </section>
</template>

<script>
import Alerts from "@/components/alerts/Alerts.vue";
import MenuForms from "../components/MenuForms.vue";
import * as nearAPI from 'near-api-js'
import { CONFIG, IPFS } from "@/services/api";
const { connect, keyStores, WalletConnection, Contract, utils } = nearAPI;
export default {
  name: "miMenu",
  components: {
    MenuForms,
    Alerts,
  },
  data() {
    return {
      categoria: "",
      listCategoria: ["uno", "dos", "tres"],
      listmenu: [],
      url: null,
      image: null,
      menu: {},
      walletid: null,
      foto: false,
      // dataSlideMenu: [
      //   {
      //     img: require("@/assets/icons/inicio.svg"),
      //     nombre: "LUMPIAS CON QUESO",
      //     categoria: "Chino",
      //     dollar: 80,
      //     near: 3,
      //     desc: "rico platillo para toda la familia pues",
      //   },
      //   {
      //     img: require("@/assets/icons/inicio.svg"),
      //     nombre: "HAMBURGUESAS TIRPLE CARNE",
      //     categoria: "Fritura",
      //     dollar: 50,
      //     near: 2,
      //     desc: "compra y lleva ahora 20% de descuenta para ¿, oferta limitada",
      //   },
      // ],
    };
  },
  mounted() {
    this.GetCategorys()
    this.get_menu()
  },
  methods: {
    formatPrice (price) {
      return utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false }))
    },
    ImagePreview() {
      this.url = URL.createObjectURL(this.menu.img);
    },
    async GetCategorys() {
      try {
        const CONTRACT_NAME = 'contract1.ccoronel7.testnet'
        // Connect to NEAR
        const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
        // Create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          viewMethods: ['get_category'],
          sender: wallet.account()
        })
        if (wallet.isSignedIn()) {
          await contract.get_category({
          }).then((res) => {
            // console.log(res)
            this.listCategoria = res
          })
        }
      } catch (e) {
        // Router
        console.log(e)
      }
    },
    async get_menu() {
      try {
        const CONTRACT_NAME = 'contract1.ccoronel7.testnet'
        // Connect to NEAR
        const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
        // Create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          viewMethods: ['get_menu'],
          sender: wallet.account()
        })
        if (wallet.isSignedIn()) {
          await contract.get_menu({
            user_id: wallet.getAccountId()
          }).then((res) => {
            // console.log(res)
            this.listmenu = res.platillos
            this.menu = {}
          })
        }
      } catch (e) {
        // Router
        console.log(e)
      }
    },
    async delete_menu(id) {
      try {
        const CONTRACT_NAME = 'contract1.ccoronel7.testnet'
        // Connect to NEAR
        const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
        // Create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['delete_platillo'],
          sender: wallet.account()
        })
        if (wallet.isSignedIn()) {
          await contract.delete_platillo({
            id: id
          }).then((res) => {
            this.$refs.alerts.Alerts('success');
            this.get_menu()
          })
        }
      } catch (e) {
        // Router
        console.log(e)
      }
    },
    async Addmenu () {
        const CONTRACT_NAME = 'contract1.ccoronel7.testnet'
        const direccionIpfs = '.ipfs.dweb.link'
        // connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        )
        // create wallet connection
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ['set_platillo'],
          sender: wallet.account()
        })
        const formData = new FormData()
        formData.append('file', this.menu.img)
        // console.log(this.menu.img)
        await this.axios.post(IPFS, formData).then((res) => {
  
          contract.set_platillo({
            name: this.menu.name,
            img: 'https://' + res.data.data + direccionIpfs + '/' + res.data.nombre,
            description: this.menu.description,
            price: utils.format.parseNearAmount(String(this.menu.price)),
            category: this.menu.category
          }).then((res) => {
            this.$refs.alerts.Alerts("success", "Menu creado");
            this.get_menu()
          })
        })
        

},
    showAlert() {
      this.$refs.alerts.Alerts("success");
      this.$refs.alerts.Alerts("cancel");
    },
  },
};
</script>

<style src="./MiMenu.scss" lang="scss" />
