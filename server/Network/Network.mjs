import {World} from '../../game_engine/index.mjs'


export default class Network {
  constructor(io){
    this.io = io;
    this.world = new World; 
    this.socket = null;

    io.on('connection',(socket)=>{
      this.world.addPlayer(socket.id);
      this.io.to(socket.id).emit('server_time',Date.now());
      console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
      console.log('Server world after new connection',this.world.entities.get());

      socket.on('disconnect', (reason) => {
        this.world.removePlayer(socket.id);
        console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
        console.log('Server world after new deconnection',this.world.entities.get());
      });

      socket.on('player_input', (data) => {
        this.world.actionsBuffer.push({id : socket.id, data});
      });

      socket.on('ping_request', (ping_req) => {
        this.io.to(socket.id).emit('ping_response', {ping_req,ping_res : Date.now()});
      });
    });
    let start = Date.now();
    setInterval(()=>{this.run(start);},500);
  }

  run(start) {
    const newWorld = Object.assign({}, this.world.updateWorld());
    this.io.emit('world_update',newWorld);
  }
}