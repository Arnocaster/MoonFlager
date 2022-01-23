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

  async update() {

    const timeStart = Date.now();

    this.inputs.inputManager();
    const actions = this.inputs.getActions();
    if (actions.length > 0) {
      this.network.send('player_input', actions);
    }
    if (this.network.tempWorld.length > 0){
      console.log('new world reveived');
    const tempWorld = await this.network.getTempWorld(); 
      tempWorld.forEach(world => {
      this.clientWorld.updatePlayers(world);
    });
    }
    console.log(this.clientWorld,this.clientWorld.players);
    this.network.tempWorld = [];
    this.network.latence();
    this.render.render(this.clientWorld.world, this.network.latency);
    let timeEnd = Date.now();
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  new app;
});