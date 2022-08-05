<template>
  <router-view />
</template>

<script>
  import { PERFIL,PROFILE } from '@/services/api.js'
  import * as nearAPI from "near-api-js";
  import { CONFIG } from "@/services/api";
  const { connect, keyStores, WalletConnection } = nearAPI;

  export default {
    name: 'app',
    data(){
      return {
        user: null,
      }
    },
    beforeCreate(){},
    created(){this.isSigned()},
    methods: {
      async isSigned() {
        // Connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        );
        // Create wallet connection
        const wallet = new WalletConnection(near);
        if (wallet.isSignedIn()) {
          // Returns account Id as string
          const walletAccountId = wallet.getAccountId();
          this.user = walletAccountId;
        }
        this.VerifyProfile(this.user)
        localStorage.setItem('walletid' ,this.user)
      },
      // Check if the user has an associated profile by: Dinoir
      VerifyProfile(user) {
        this.axios.post(PERFIL,{'wallet':user,'password':'super'}).then((response) => {
          this.axios.defaults.headers.common.Authorization = 'token ' + response.token
          if (response.data.id) {
            if (response.data.vendedor) {
              this.$router.addRoute('layout', { path: '/tienda', name: 'tienda', component: () => import('@/pages/tienda/Tienda') })
              this.$router.addRoute('layout', { path: '/mi-tienda', name: 'miTienda', component: () => import('@/components/forms/miTienda/MiTienda') })
            }
            if (response.data.delivery) {
              this.$router.addRoute('pedido', { path: '/pedido', name: 'pedido', component: () => import('@/pages/pedido/Pedido'), })
            }
            // Set profile.id as localStorage item
            localStorage.setItem('profileid',response.data.id)
            localStorage.setItem("data_profile", JSON.stringify(response.data))
          } else {
            if (this.$route.name !== 'perfil') {
              this.$router.push({name: 'perfil'})
            }
          }
        }).catch((e) => {
          console.log(e) // **
        })
      }
    },
  };
</script>

<style src="./styles/app.scss" lang="scss"/>
