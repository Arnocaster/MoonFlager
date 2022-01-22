import {io} from '../socket.io.esm.min.js'

export default class Network {
  constructor() {
    this.latency = [];
    this.lastPing = {ping_req : Date.now()};
    this.latencyRate = 100;
    this.latencyHistory  = 2000;
    this.debug_slowClient = false;

    this.timeOffset = null;

    this.tempWorld = {};

    this.socket = io('http://109.14.79.91:3003');

    
    if (this.socket) {
      this.socket.on('server_time',(serverTime)=>{
        this.timeOffset = (serverTime - Date.now);
        console.log(this.timeOffset);
      })
      this.socket.on('ping_response', (res) => {
        res.ping_end = Date.now();
        const ping_req = res.ping_res - res.ping_req;
        const ping_res = res.ping_end - res.ping_res;
        this.latency.unshift([ping_req,ping_res]);
        if (this.latency.length > (this.latencyHistory/this.latencyRate)){
          this.latency.pop();
        }
      });

      this.socket.on('world_update', (obj) => {
        this.tempWorld = obj;
      });
    }
  }

  async latence() {
   //console.log(this.lastPing);
   this.socket.emit('ping_request',Date.now());
  } 
}