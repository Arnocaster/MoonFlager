import {World} from '../../game_engine/index.mjs'

export default class Network {
  constructor(io){
    this.io = io;
    this.world = new World; 
    this.socket = null;
    this.connection_buffer = {
      newPlayers: [],
      lostPlayers: [],
      playersInputs: [],
    }
    io.on('connection',(socket)=>{
      this.world.addPlayer(socket.id);
      this.io.to(socket.id).emit('server_time',Date.now());
      console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
      console.log('Server world after new connection',this.world.world);

      socket.on('disconnect', (reason) => {
        this.world.removePlayer(socket.id);
        console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
      });

      socket.on('player_input', (data) => {
        console.log('player input',data);
        world.addInputBuffer(socket.id, data);
      });

      socket.on('ping_request', (ping_req) => {
        this.io.to(socket.id).emit('ping_response', {ping_req,ping_res : Date.now()});
      });
    });
    this.run();
  }

  // async updateConnections() {
  //   const newPlayers = this.connection_buffer.newPlayers;
  //   const lostPlayers = this.connection_buffer.lostPlayers;
  //   this.world.updatePlayers(newPlayers,lostPlayers);
  //   this.connection_buffer.newPlayers = [];
  //   this.connection_buffer.lostPlayers = [];
  // }

  async run() {
    const nowWorld = await this.world.updateWorld();
    this.io.emit('world_update',nowWorld);
    setTimeout(()=>{this.run()},250);
  }

  send(type,data){
    this.socket.emit(type,data);
  }
}