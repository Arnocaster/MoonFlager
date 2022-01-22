import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import { World } from '/game-engine/index.mjs'


class app {
  constructor() {
    this.clientWorld = new World;
    this.refreshRate = 5;
    this.network = new Network();
    //PAS JOLI
    this.network.tempWorld = this.clientWorld;
    this.inputs = new Inputs();
    this.render = new Render();

    setInterval(() => { this.update(); }, this.refreshRate);
  }

  update() {

    const timeStart = Date.now();
    this.clientWorld.updatePlayers(this.network.tempWorld);
    if (Object.keys(this.inputs.actions).length > 0) {
      this.network.send('player_input', this.inputs.actions);
    }
    this.inputs.inputManager();
    this.network.latence();
    this.render.render(this.clientWorld.world, this.network.latency);
    let timeEnd = Date.now();
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  new app;
});