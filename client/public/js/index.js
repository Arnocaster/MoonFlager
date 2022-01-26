import Network from './Network/Network.mjs';
import Inputs from './Inputs/Inputs.mjs';
import Render from './Render/Render.mjs'
import world  from '/game-engine/World.mjs'
import { io } from './socket.io.esm.min.js'

const app = (socket) => {
  const refreshRate = 15;
  const network= new Network(socket);
  const clientWorld = world();
  const inputs= new Inputs();
  const render= new Render();
  const startTime= Date.now();
  const update = () => {
    inputs.inputManager();
    const actions = inputs.getActions();
    network.sendActions(actions);
    if (actions.length > 0) {
      clientWorld.actionsBuffer.push({ socket: network.socket.id, data: actions });
    }
    const newWorld = network.getTempWorld();
    console.log(world);
    clientWorld.updateWorld(newWorld);
    network.ping();
    //render.render(clientWorld, network.latency);
    console.log(clientWorld);
  };

  return {
  
  run: () => { setInterval(() => { update(); }, refreshRate); },
  
}
}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://109.14.79.91:3003');
  socket.on('client_socket', (res) => {
    const runner = app(socket).run();
  });
});