import {io} from '../socket.io.esm.min.js'

export default class Network {
  constructor() {
    this.latency = [];
    this.latencyRate = 100;
    this.latencyHistory  = 2000;
    this.lastPing: null;
    //Socket.io Managment => Maybe a module later
    this.socket = io('http://109.14.79.91:3003');
    // const socket = this.io("http://109.14.79.91:3003");
    // console.log("Connected, starting app");
    if (this.socket) {
      this.socket.on('ping_response', (res) => {
        //Here obj = Client_now,Server_now
        res.Client_end = Date.now();
        app.lastPing = res;
      });

      this.socket.on('world_update', (obj) => {
        //! For the moment World = Players
        //console.log(obj);
        app.players = obj;
      });
    }
  }
}