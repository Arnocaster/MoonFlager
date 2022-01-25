import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import { World } from '/game-engine/index.mjs'
import {io} from './socket.io.esm.min.js'

class app {
  constructor(socket) {
    this.refreshRate = 15;
    this.network = new Network(socket);
    this.world = new World(socket.id);
    this.inputs = new Inputs();
    this.render = new Render();
    let start = Date.now();
    setInterval(() => { this.update(); }, this.refreshRate);
  }

  async update() {
    this.inputs.inputManager();
    const actions = this.inputs.getActions();
    this.network.sendActions(actions);
    if (actions.length > 0){
    this.world.actionsBuffer.push({socket:this.network.socket.id,data:actions});
    }
    const newWorld = this.network.getTempWorld();
    this.world.updateWorld(newWorld);
    this.network.ping();
    this.render.render(this.world.world,this.network.latency);
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://109.14.79.91:3003');
  socket.on('client_socket',(res)=>{
    new app(socket);
  });  
});