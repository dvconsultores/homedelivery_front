import Vue from 'vue';
import Vuex from 'vuex';
import * as nearAPI from "near-api-js";
const { utils } = nearAPI;
Vue.use(Vuex);

export default new Vuex.Store({

  namespace: true,
  state: {
    baseURL: process.env.BASE_URL,
    theme: "light",
    drawerChats: false,
    OWNER_ID: null,
    dataModalShopCart: [],
    editedItem: null,
  },
  mutations: {
    get_owner(state, item) {
      state.OWNER_ID = item
    },
    CambiarTheme(state, theme) {
      state.theme = theme
    },
    DrawerChats(state, key) {
      if (key == 'open') {
        state.drawerChats = true
      }
      if (key == 'close') {
        state.drawerChats = false
      }
    },
    ChangeLocation(state, object){
      state.editedItem = state.dataModalShopCart.indexOf(object.item)
      const index = state.editedItem
      state.dataModalShopCart[index].location.lat = object.location.lat()
      state.dataModalShopCart[index].location.lng = object.location.lng()
    },
    ShoppingCart(state, item) {
      let pedidos = state.dataModalShopCart;
      var pedido_encontrado = pedidos.find(pedido => pedido.wallet_shop === item.wallet_shop) || {};
      if (pedido_encontrado) {
        if (pedido_encontrado.statu) {
          return false;
        }
      };
      if (!item.igualacion_rapida) {
        if (Object.keys(pedido_encontrado).length !== 0) {
          pedido_encontrado.sub_total = pedido_encontrado.sub_total + item.price;
          pedido_encontrado.productos.push({
            name: item.name,
            price: item.price,
            comment: ''
          });
        } else {
          let data_profile = JSON.parse(localStorage.getItem("data_profile"));
          state.dataModalShopCart.push({
            client: localStorage.getItem("walletid"),
            name_shop: item.name_shop,
            wallet_shop: item.wallet_shop,
            wallet_seller: item.wallet_seller,
            productos: [{
              name: item.name,
              price: item.price,
              comment: ''
            }],
            direccion: data_profile.direccion,
            location: JSON.parse(data_profile.location),
            telefono: data_profile.telefono,
            sub_total: item.price
          });
        };
        return true;
      } else {
        state.dataModalShopCart.push(item);
        return true;
      };
      //   // this.$refs.alerts.Alerts('success', 'Añadido al carrito', 'Se ha agregado al carrito correctamente')
      // } catch (e) {
      //   console.log(e)
      //   this.$refs.alerts.Alerts('cancel', 'Hubo un error', 'Ha habido un error al guardar')
    }
  },
  actions: {
    yoctoNEARNEAR: function(yoctoNEAR) {
      const amountInNEAR = utils.format.parseNearAmount((this.formatPrice(yoctoNEAR)).toString())
      this.yoctoNEARNEAR2(amountInNEAR)
      this.precio_yocto = amountInNEAR
    },
    CambiarTheme({state, commit}, {theme, element}) {
      element.href = `${state.baseURL}themes/${theme}/theme.css`;
      localStorage.setItem("theme", theme);
      commit( "CambiarTheme", theme)
    },
    DrawerChats({commit}, {key}) {
      commit( "DrawerChats", key)
    },
  },
});
