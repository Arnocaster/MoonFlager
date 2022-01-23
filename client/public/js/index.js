import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import { World } from '/game-engine/index.mjs'


class app {
  constructor() {
    this.world = new World;
    this.refreshRate = 5;
    this.network = new Network();
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
  new app;
});