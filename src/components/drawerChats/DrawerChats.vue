<template>
  <section id="drawerChats" v-if="currentUserId">
    <v-badge
      :content="pending"
      :value="pending"
      color="red"
      class="floatingButton"
      overlap
    >
      <v-btn icon @click="openDrawer()">
        <v-icon color="#FFFFFF !important">mdi-chat</v-icon>
      </v-btn>
    </v-badge>

    <v-navigation-drawer
      v-model="$store.state.drawerChats"
      right
      fixed
      temporary
      width="max-content"
      height="100vh"
      hide-overlay
    >
      <section class="contPedidos divcol acenter">
        <!-- caja de pedidos -->
        <h3 class="h10_em tcenter">{{ $t('pedidosPendientes') }}</h3>
      </section>

      <chat-window
        ref="noir"
        :current-user-id="currentUserId"
        :rooms="rooms"
        :rooms-loaded="roomsLoaded"
        :loading-rooms="loadingRooms"
        :messages="messages"
        :messages-loaded="messagesLoaded"
        @fetch-messages="fetchMessages($event)"
        @room-action-handler="test($event)"
        :show-audio="false"
        :show-files="false"
        :width="'max-content'"
        :responsive-breakpoint="3000"
        @send-message="handleMessage"
      />
    </v-navigation-drawer>
  </section>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import { MESSAGES, CHATS, NEWS } from '@/services/api.js'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
export default {
  name: "drawerChats",
  components: { ChatWindow },
  i18n: require("./i18n"),
  data() {
    return {
      pending: 0,
      currentUserId: '',
      // Chats
      loadingRooms: false,
      roomsLoaded: true,
      rooms: [],
      esperando: false,
      esperando_msg: false,
      // Mensajes
      messagesLoaded: false,
      messages: [],
      intervalo_chats: null,
      intervalo_msges: null,
      room_id: null,
      sesion_abierta: null,
      chat_abierto: null,
      notifications: false,
      verifyCurrentUserValue: null,
      chatSocket: WebSocket = new WebSocket(`ws://${window.location.host}/ws/chat/${this.roomName}/`),
    }
  },
  mounted () {
    this.verifyCurrentUserValue = setInterval(this.verifyCurrentUser,1000)
    this.initChatComponent()
    // this.chatSocket.onmessage = e => {
    //   const data = JSON.parse(e.data);
    //   const message = data.message;
    //   this.messages.push(message);
    // };
    // this.chatSocket.onclose = e => {
    //   console.error("chat socket closed unexpectedly!");
    // };
  },
  methods: {
    verifyCurrentUser () {
      this.currentUserId = parseInt(localStorage.getItem('profileid'))
    },
    openDrawer () {
      this.$store.dispatch('DrawerChats', {key: 'open'})
    },
    initChatComponent(){
      if (localStorage.getItem('profileid') !== this.sesion_abierta) {
        this.sesion_abierta = localStorage.getItem('profileid')
        this.intervalo_chats = setInterval(this.fetchChats,3000)
      }
    },
    handleChats(){
      this.axios.post(CHATS).then((res) => {
        if (res.status !== 201) {
          console.log(res)
        }
      }).catch((e)=>console.log(e))
    },
    fetchChats() {
      var e = this.sesion_abierta
      this.roomsLoaded = true
      // vue-advanced-chat component is performance oriented, hence you have to follow specific rules to make it work properly
      const habs = []; // El componente necesita igualar un array lleno con la variable de las rooms
      if (!this.esperando) {
        this.esperando = true
        this.axios.get(CHATS+'?usuario='+e+'&').then((res) => {
          var news = 0
          res.data.forEach((element) => {
            if (element.unreadCount !== 0) {
              news = news + element.unreadCount
            }
            habs.push(element);
          })
          this.esperando = false
          this.pending = news
          this.rooms = habs
          this.roomsLoaded = false
        }).catch((e)=>console.log(e))
      }
    },
    handleMessage(data){
      this.esperando = true
      var msgs = this.messages
      this.axios.post(MESSAGES,{content:data.content,replyMessage:data.replyMessage,roomId:data.roomId,usuario:localStorage.getItem('profileid')}).then((res) => {
        msgs.push(res.data)
        this.messages = msgs
        this.esperando = false
      }).catch((e)=>console.log(e))
      // this.esperando = true
      // var msgs = this.messages
      // var msg = {content:data.content,replyMessage:data.replyMessage,roomId:data.roomId,usuario:localStorage.getItem('profileid')}
      // var respuesta = this.chatSocket.send(
      //   JSON.stringify({
      //     message: msg
      //   })
      // );
      // console.log(respuesta)
      // // this.axios.post(MESSAGES,msg).then((res) => {
      // msgs.push(respuesta.data)
      // this.messages = msgs
      // //   this.esperando = false
      // // }).catch((e)=>console.log(e))
    },
    initMsgComponent (data) {
      var msgs = []
      if (this.chat_abierto !== data.room.roomId){
        this.chat_abierto = data.room.roomId
        clearInterval(this.intervalo_msges)
        this.intervalo_msges = setInterval(()=>{
          this.axios.get(MESSAGES+'?chat='+data.room.roomId+'&usuario='+this.currentUserId+'&').then((res) => {
            // res.data.sort(function (a, b) {
            //   if (a.id < b.id) {
            //     return 1;
            //   }
            //   if (a.id > b.id) {
            //     return -1;
            //   }
            //   return 0;
            // });
            res.data.forEach((element) => {
              msgs.push(element);
            });
            this.messages = msgs
            this.esperando_msg = false
            this.messagesLoaded = true
            msgs = []
          })
        },1000)
      }
    },
    fetchMessages(data) {
      this.messages = []
      this.esperando_msg = true
      this.messagesLoaded = false
      var obj = {chat:data.room.roomId}
      if (data.room.unreadCount) { 
        this.axios.put(NEWS,obj).then((res) => {
          this.pending = this.pending - res.data.reads
        })
      }
      this.initMsgComponent(data)
    },
    // onFetchMessages() {
    //   this.axios.get(MESSAGES).then((res) => {
    //     this.messages = res.data
    //     this.messagesLoaded = true;
    //   })
    // },
  },
};
</script>

<style src="./DrawerChats.scss" lang="scss" />
