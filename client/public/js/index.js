import Network from './Network/Network.mjs';


const app = {
  socket: null,
  canvas: document.getElementById('canvas-world'),

  refreshRate : 16,

 

  latency: [],
  latencyRate: 100,
  latencyHistory : 2000,
  lastPing: null,
  debug_slowClient : false,
  debug_pingMs : 150,
  init: (id) => {
    app.lastPing = { Client_req: Date.now() };
    const canvas = app.canvas;
    canvas.width = 400;
    canvas.height = 400;
    app.addListeners();
    console.log('Initialisation Complete');
    app.update();
  },
  render: () => {
    const canvas = app.canvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    if (app.latency.length === app.latencyHistory/app.latencyRate) {
      app.latency.forEach((ping, index) => {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.fillStyle = null;
        ctx.moveTo(5 + (index * (5)), 400);
        ctx.lineTo(5 + (index * (5)), 400 - (ping[0]) - 1);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#00FF41";
        ctx.fillStyle = null;
        ctx.moveTo(5 + (index * (5)), 400 - (ping[0]));
        ctx.lineTo(5 + (index * (5)), 400 - (ping[0] + ping[1]));
        ctx.fill();
        ctx.stroke();

      });

    }
    if (app.players) {
      app.players.forEach(player => {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillStyle = player.color;
        ctx.arc(player.position.x, player.position.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      });
    }
  },
  latence: () => {
    const Client_req = Date.now();
    if (Client_req - app.lastPing.Client_req > app.latencyRate) {
      if (app.debug_slowClient){
          //Fake ping for local test
        setTimeout(()=>{app.socket.volatile.emit('ping_request', Client_req);},app.debug_pingMs);
        return;
      } else {
      app.socket.volatile.emit('ping_request', Client_req);
      }
    }

    if (app.lastPing) {
      const lastPing = app.lastPing;
      const req_ping = lastPing.Server_res - lastPing.Client_req;
      const res_ping = lastPing.Client_end - lastPing.Server_res;
      const ping = [req_ping, res_ping];
      app.latency.unshift(ping);
       if (app.latency.length > app.latencyHistory/app.latencyRate) {
         app.latency.pop();
       }
    }

  },



  send: (data) => {
    app.socket.emit('player_input', data);
  },

  update: () => {
    const timeStart = Date.now();
    app.latence();
    app.inputManager();
    app.render();
    let timeEnd = Date.now();
    requestAnimationFrame(app.update);
  },
}

//!START HERE
document.addEventListener('DOMContentLoaded', () => {
  new Network();
  new Inputs();
 
});