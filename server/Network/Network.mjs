import {World} from '../../game_engine/index.mjs'


export default class Network {
  constructor(io){
    this.io = io;
    this.world = new World();
    this.socket = null;

    io.on('connection',(socket)=>{
      this.io.to(socket.id).emit('client_socket', socket.id);
      this.world.create('Player', { socket:socket.id });
      this.world.create('Flag');
      this.io.to(socket.id).emit('server_time',Date.now());
      console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
      console.log('Server world after new connection',this.world.world);

      socket.on('disconnect', (reason) => {
        this.world.destroy({socket : socket.id});
        console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
        console.log('Server world after new deconnection',this.world.world);
      });

      socket.on('player_actions', (data) => {
        this.world.actionsBuffer.push({socket : socket.id, data});
      });

      socket.on('ping_request', (ping_req) => {
        this.io.to(socket.id).emit('ping_response', {ping_req,ping_res : Date.now()});
      });
    });
    let start = Date.now();
    setInterval(()=>{this.run(start);},16);
  }

  run(start) {
    // console.clear();
    // console.log(this.world.entities);
    const newWorld = this.world.updateWorld();
    this.io.emit('world_update',newWorld);
  }
}