import {World} from '../../game_engine/index.mjs'

export default class Network {
  constructor(io){
    this.world = new World; 
    console.log(this.world);
    this.connection_buffer = {
      newPlayers: [],
      lostPlayers: [],
      playersInputs: [],
    }
    io.on('connection',(socket)=>{
      console.log("Connected, starting app");
      this.connection_buffer.newPlayers.push(socket.id);
      this.updateConnections();
      socket.emit('New_Client_Connected',this.world);
      
      socket.on('disconnect', (reason) => {
        this.connection_buffer.lostPlayers.push(socket.id);
        console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
      });
      

    
      io.on('ping_response', (res) => {
        //Here obj = Client_now,Server_now
        res.Client_end = Date.now();
        app.lastPing = res;
      });
    
      io.on('world_update', (obj) => {
        //! For the moment World = Players
        //console.log(obj);
        app.players = obj;
      });
    })
   
  }

  async updateConnections() {
    const newPlayers = this.connection_buffer.newPlayers;
    const lostPlayers = this.connection_buffer.lostPlayers;
    if (newPlayers.length > 0) {
      await newPlayers.forEach(id => {
        this.world.addPlayer(id);
      });
      this.connection_buffer.newPlayers = [];
    }

    if (lostPlayers.length > 0) {
      await lostPlayers.forEach(id => {
        this.world.removePlayer(id);
      });
      this.connection_buffer.lostPlayers = [];
    }
  }

  send(type,data){
    this.socket.emit(type,data);
  }
}