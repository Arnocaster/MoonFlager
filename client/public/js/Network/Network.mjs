import {io} from '../socket.io.esm.min.js'

export default class Network {
  constructor() {
    this.connection_buffer = {
      newPlayers: [],
      lostPlayers: [],
      playersInputs: [],
    }
    this.latency = [];
    this.latencyRate = 100;
    this.latencyHistory  = 2000;
    this.lastPing= null;
    this.tempWorld = null;
    //Socket.io Managment => Maybe a module later
    this.socket = io('http://109.14.79.91:3003');
    // const socket = this.io("http://109.14.79.91:3003");
    // console.log("Connected, starting app");
    if (this.socket) {
      this.socket.on('ping_response', (res) => {
        //Here obj = Client_now,Server_now
        res.Client_end = Date.now();
        this.lastPing = res;
      });

      this.socket.on('New_Client_Connected',(newId) =>{
        this.connection_buffer.newPlayers.push(newId);
      });

      this.socket.on('New_Client_Disconnected',(newId) =>{
        this.connection_buffer.lostPlayers.push(newId);
      });


      this.socket.on('world_update', (obj) => {
        this.tempWorld = obj;
      });
    }
  }


  latence() {
    const Client_req = Date.now();
    if (Client_req - app.lastPing.Client_req > app.latencyRate) {
      if (app.debug_slowClient){
          //Fake ping for local test
        setTimeout(()=>{app.socket.volatile.emit('ping_request', Client_req);},app.debug_pingMs);
        return;
      } else {
      app.socket.volatile.emit('ping_request', Client_req);
      }
    }

    if (app.lastPing) {
      const lastPing = app.lastPing;
      const req_ping = lastPing.Server_res - lastPing.Client_req;
      const res_ping = lastPing.Client_end - lastPing.Server_res;
      const ping = [req_ping, res_ping];
      app.latency.unshift(ping);
       if (app.latency.length > app.latencyHistory/app.latencyRate) {
         app.latency.pop();
       }
    }
  }
}