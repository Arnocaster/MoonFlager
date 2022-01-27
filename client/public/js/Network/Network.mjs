export default class Network {
  constructor(socket) {
    this.socket = socket;
    this.latency = [];
    this.lastPing = {ping_req : Date.now()};
    this.latencyRate = 100;
    this.latencyHistory  = 2000;
    this.debug_slowClient = false;

    this.tempWorld = null;
     
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
      this.socket.on('world_update', (newWorld) => {
        //console.log(newWorld);
        this.tempWorld = newWorld;
      });
  }


  getTempWorld(){
    if (this.tempWorld !== null && this.tempWorld.length > 0){
    const tempWorld = this.tempWorld;
    
    this.tempWorld = [];
    return tempWorld
    }
  }


  send(type,data){
    this.socket.emit(type,data);
  }

  sendActions(actions){
    if (actions.length > 0){
    this.socket.emit('player_actions',actions);
    }
  }

  ping() {
   this.socket.emit('ping_request',Date.now());
  }

}