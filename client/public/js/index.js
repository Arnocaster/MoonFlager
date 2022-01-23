import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import { World } from '/game-engine/index.mjs'


class app {
  constructor() {
    this.refreshRate = 5;
    this.network = new Network();
    const id = Object.assign({},this.network.socket);
    console.log(this.network.getId());
    this.world = new World(this.network.socket.id);
    this.inputs = new Inputs();
    this.render = new Render();

    setInterval(() => { this.update(); }, this.refreshRate);
  }

  async update() {
    const newWorld = this.network.getTempWorld();
    //console.log(this.world);
    this.world.updateWorld(newWorld);
    this.network.ping();
    //this.render.render(this.world,this.network.latency);
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  new app;
});