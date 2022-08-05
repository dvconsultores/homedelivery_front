//Cross-domain proxy prefix
// const API_PROXY_PREFIX='/api'
//const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX

const BASE_URL = 'http://127.0.0.1:8000/apis/v1'
// const BASE_URL = 'http://157.230.2.213:85/homedelivery/apis/v1'
const NODE_URL =  'http://157.230.2.213:3422/api'

// const BASE_URL = 'http://127.0.0.1:8000/apis/v1'
// const NODE_URL =  'http://127.0.0.1:3070/api'
const NETWORK = process.env.NODE_ENV === 'development' ? 'testnet' : 'testnet'

function CONFIG(keyStores) {
  switch (NETWORK) {
  case 'mainnet':
    return {
      networkId: 'mainnet',
      nodeUrl: 'https://rpc.mainnet.near.org',
      keyStore: keyStores,
      walletUrl: 'https://wallet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
    }
  case 'testnet':
    return {
      networkId: "testnet",
      keyStore: keyStores,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org"
    }
  default:
    throw Error(`Unconfigured environment '${NETWORK}'`)
  }
}


module.exports = {
  ORDERD:`${BASE_URL}/order-details`,
  ORDER:`${BASE_URL}/order`,
  ROUTES: `${BASE_URL}/menu-get`,
  PERFIL: `${BASE_URL}/verificar-perfil`,
  ORDER_CREATE:`${BASE_URL}/order-create`,
  ORDER_CANCEL:`${BASE_URL}/order-update-cancel`,
  ORDER_STATU:`${BASE_URL}/order-update-statu`,
  PENDING_ORDERS:`${BASE_URL}/pending-orders-client-side`,
  PENDING_ORDERS_DELIVER:`${BASE_URL}/pending-orders-delivery-side`,
  PROFILE: `${BASE_URL}/perfiles/`,
  MESSAGES: `${BASE_URL}/mensajes/`,
  CHATS: `${BASE_URL}/chats/`,
  NEWS: `${BASE_URL}/update-unread/`,
  IPFS: `${NODE_URL}/ipfs`,
  GOODS: `${BASE_URL}/goods`,
  GOODS_COLUMNS: `${BASE_URL}/columns`,
  BINANCE_NEAR: `https://api.binance.com/api/v3/ticker/24hr?symbol=NEARUSDT`,
  CONFIG,
}
