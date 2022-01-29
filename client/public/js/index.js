import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import World from '/game-engine/World.mjs'
import { io } from './socket.io.esm.min.js'

class App {
  constructor(socket) {
    //Std : 60 , debug 3, 
    this.refreshRate = 60;
    this.network = new Network(socket);
    this.clientWorld = new World(socket);
    this.inputs = new Inputs();
    this.render = new Render();
    this.startTime = Date.now();
    this.synchroniseTime();
    setInterval(() => {
      this.update();
    }, (this.refreshRate));
  }
     update() {
    this.inputs.inputManager();
    const actions = this.inputs.getActions();
    if (actions.length > 0) {
      this.network.sendActions(actions);
      this.clientWorld.addActionToBuffer({ socket: this.network.socket.id, data: actions.map(action => action.value) });
    }
    const newWorld = this.network.getTempWorld();
    (newWorld) ? this.clientWorld.updateWorld(newWorld) : this.clientWorld.updateWorld();
    this.network.ping();
    this.render.render(this.clientWorld.world, this.network.latency);
  }

  async synchroniseTime() {
    let timeSync = [];
    let loop=0;
    const timeReq = setInterval(() => {
      loop++;
      this.network.requestTime();
      (loop > 4) ? clearInterval(timeReq) : '';
    }, 1000);
  }

  run() {
    synchroniseTime();
    setInterval(() => { update(); }, 1000/refreshRate);
  }

}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://109.14.79.91:3003');
  socket.on('client_socket', (res) => {
    const app = new App(socket);
  });
});