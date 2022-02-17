import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import World from '/game-engine/World.mjs'
import { io } from './lib/socket.io.esm.min.js'
import PhysX from './lib/physx-js-webidl.wasm.mjs';

class App {
  constructor(socket) {
    //Std : 60 , debug 3, 
    this.refreshRate = 60;
    this.physX = PhysX();
    this.network = new Network(socket);
    this.world = new World(socket.id,PhysX);
    //this.server = new World();
    this.inputs = new Inputs();
    this.render = new Render();
    this.startTime = Date.now();
    this.init();
 
  }

  init(){
    if (this.network.started) {
      console.log(this.network.started);
      setInterval(() => {
        this.update();
      }, (1000 / this.refreshRate));
      return;
    }
    setTimeout(()=>{this.init()},50);
  }
  update() {
    const bufferWorlds = this.network.getbufferWorld();
    this.world.updateWorld(bufferWorlds);
    this.inputs.inputManager();
    const actions = this.inputs.getBufferInput();
    if (actions.length > 0) {
      this.network.sendActions(actions);
      //APPLY INPUT (PREDICTION);
      this.world.addActionToBuffer({ socket: this.network.socket.id, data: actions });
    }
    this.network.ping();
    this.render.render(this.world.world, this.network.latency);
    (bufferWorlds) ? this.render.render(bufferWorlds,undefined,true) : '';
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://109.14.79.91:3003');
  socket.on('client_socket', (res) => {
    const app = new App(socket);
  });
});