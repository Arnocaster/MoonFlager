export default class Network {
  constructor(socket) {
    this.socket = socket;
    this.latency = [];
    this.lastPing = {ping_req : Date.now()};
    this.latencyRate = 100;
    this.latencyHistory  = 2000;
    this.debug_slowClient = false;
    this.timeSync = [];
    this.offsetTime = 0;

    this.bufferWorld = [];
     
      this.socket.on('ping_response', (res) => {
        res.ping_end = Date.now();
        const ping_req = res.ping_res - res.ping_req;
        const ping_res = res.ping_end - res.ping_res;
        this.latency.unshift([ping_req,ping_res]);
        if (this.latency.length > (this.latencyHistory/this.latencyRate)){
          this.latency.pop();
        }
      });

      this.socket.on('time_response',(obj)=>{
        let offset = Date.now() - obj.time_req;
        this.timeSync.push(offset);
        let timeTemp = [...this.timeSync].sort((a,b)=> a-b);
        const middle = Math.floor(this.timeSync.length/2);
        this.offsetTime = (this.timeSync.length % 2 !== 0) ? this.timeSync[middle] : (this.timeSync[middle-1] + this.timeSync[middle])/2;
        //console.log(this.offsetTime);
      });
      //! NEED BUFFER WORLD BEFORE UPDATE
      this.socket.on('world_update', (newWorld) => {
        //console.log(newWorld);
        this.bufferWorld = newWorld;
      });
  }


  getbufferWorld(){
    if (this.bufferWorld.length > 0){
    const bufferWorld = this.bufferWorld;
    this.bufferWorld = [];
    return bufferWorld
    }
  }


  send(type,data){
    this.socket.emit(type,data);
  }

  requestTime(){
    this.socket.emit('time_request',Date.now());
  }
  sendActions(bufferInput){
      this.socket.emit('player_actions',bufferInput);
  }

  ping() {
   this.socket.emit('ping_request',Date.now());
  }

}