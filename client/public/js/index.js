import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import {World} from '/game-engine/index.mjs'


class app{
  constructor(){
    this.clientWorld= new World;
    this.refreshRate = 16;
    this.network = new Network();
    this.network.tempWorld = this.clientWorld;
    this.inputs = new Inputs();
    this.render = new Render();
    
    setInterval(()=>{this.update();},this.refreshRate);
  }

  update() {
    this.clientWorld.updatePlayers(this.network.tempWorld);
    const timeStart = Date.now();
    this.network.latence();
    this.inputs.inputManager();
    this.render.render(this.clientWorld.world,this.network.latency);
    let timeEnd = Date.now();
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
    new app;
});