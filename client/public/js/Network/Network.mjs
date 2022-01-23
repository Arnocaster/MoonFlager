import {io} from '../socket.io.esm.min.js'

export default class Network {
  constructor() {
    this.latency = [];
    this.lastPing = {ping_req : Date.now()};
    this.latencyRate = 100;
    this.latencyHistory  = 2000;
    this.debug_slowClient = false;

    this.tempWorld = [];

    this.socket = io('http://109.14.79.91:3003');

    
    if (this.socket) {
     
      this.socket.on('ping_response', (res) => {
        res.ping_end = Date.now();
        const ping_req = res.ping_res - res.ping_req;
        const ping_res = res.ping_end - res.ping_res;
        this.latency.unshift([ping_req,ping_res]);
        if (this.latency.length > (this.latencyHistory/this.latencyRate)){
          this.latency.pop();
        }
      });
      //! NEED BUFFER WORLD BEFORE UPDATE
      this.socket.on('world_update', (world) => {
        console.log("netCli",world);
        if ( Array.isArray(this.tempWorld)){
        this.tempWorld.push(world);
        }
      });
    }
  }
  getTempWorld(){
    console.log(this.tempWorld.flags);
    const tempWorld = this.tempWorld;
    this.tempWorld = [];
    return tempWorld
  }


  send(type,data){
    this.socket.emit(type,data);
  }

  sendInputs(inputs){
    //this.socket.emit('player_inputs',inputs);
  }

  latence() {
   //this.socket.emit('ping_request',Date.now());
  }

}