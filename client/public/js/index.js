import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import { World } from '/game-engine/index.mjs'
import {io} from './socket.io.esm.min.js'

class app {
  constructor(socket) {
    this.refreshRate = 5;
    this.network = new Network(socket);
    this.world = new World(socket.id);
    this.inputs = new Inputs();
    this.render = new Render();
    setInterval(() => { this.update(); }, this.refreshRate);
  }

  async update() {
    const newWorld = this.network.getTempWorld();
    this.world.updateWorld(newWorld);
    this.network.ping();
    //this.render.render(this.world,this.network.latency);
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://109.14.79.91:3003');
  socket.on('client_socket',(res)=>{
    new app(socket);
  });  
});