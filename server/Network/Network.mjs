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
      //this.world.addPlayer(socket.io);
      //Stocke la connection dans le serveur pour MAJ dans run
      this.connection_buffer.newPlayers.push(socket.id);
      this.io.emit('New_Client_Connected',socket.id);
      this.updateConnections();
      console.log(this.world);
      console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
      
      socket.on('disconnect', (reason) => {
        //this.world.removePlayer(socket.io);
        this.connection_buffer.lostPlayers.push(socket.id);
        this.io.emit('New_Client_Disconnected',socket.id);
        this.updateConnections();
        console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
      });

      socket.on('player_input', (data) => {
        console.log('player input',data);
        world.addInputBuffer(socket.id, data);
      });

      socket.on('ping_request', (Client_req) => {
        const Server_res = Date.now();
        this.io.to(socket.id).emit('ping_response', { Client_req, Server_res });
      });
    });
    this.run();
  }

  async updateConnections() {
    const newPlayers = this.connection_buffer.newPlayers;
    const lostPlayers = this.connection_buffer.lostPlayers;
    this.world.updatePlayers(newPlayers,lostPlayers);
    this.io.emit('update_player',[newPlayers,lostPlayers]);
    this.connection_buffer.newPlayers = [];
    this.connection_buffer.lostPlayers = [];
  }

  run() {
    const nowWorld = this.world.updateWorld();
    
    //console.log('conn',this.world.world.players);
    this.io.emit('world_update',nowWorld);
    setTimeout(()=>{this.run()},16);
  }

  send(type,data){
    this.socket.emit(type,data);
  }
}