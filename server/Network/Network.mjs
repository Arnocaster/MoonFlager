import World from '../../game_engine/World.mjs'
import PhysX from '../lib/physx-js-webidl.wasm.mjs';


export default async function Network(io) {
  const physX = PhysX;
  const serverWorld = new World(null,physX);
  const socket = null;
  //std 20, debug 3
  const worldRefreshRate = 30;
  const newtWorkRefreshRate = 10;
  let lastRefresh = Date.now();

  
  const synchroniseTime = async () => {
    let timeSync = [];
    let loop = 0;
    const timeReq = setInterval(() => {
      loop++;
      this.network.requestTime();
      (loop > 4) ? clearInterval(timeReq) : '';
    }, 1000);
  }


  io.on('connection', (socket) => {
    console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
    io.to(socket.id).emit('client_socket', socket.id);
    //INIT PLAYER
    const player = serverWorld.createPlayer(socket.id);
    //console.log('Server world after new connection', serverWorld.display({ type: '', id: '' }));
    io.to(socket.id).emit('server_time', Date.now());


    socket.on('disconnect', (reason) => {
      serverWorld.destroy({ socket: socket.id });
      console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
      console.log('Server world after new deconnection', serverWorld.display({ type: '', id: '' }));
    });

    socket.on('player_actions', (data) => {
      //console.log('Server Push to GameEngine',data);
      serverWorld.addActionToBuffer({ socket: socket.id, data});
    });
    
    socket.on('time_request',(time_req)=>{
      io.to(socket.id).emit('time_response', { time_req, time_res: Date.now()});
    })

    socket.on('ping_request', (ping_req) => {
      io.to(socket.id).emit('ping_response', { ping_req, ping_res: Date.now() });
    });

  });
  //NetWorldRefreshRate : Update world is refreshed independently of World send to client;
  const run = (start) => {
    const newWorld = serverWorld.updateWorld();
    if(Date.now()-lastRefresh > 1000/newtWorkRefreshRate){
    io.emit('world_update',newWorld);
    lastRefresh = Date.now();
    }
    setTimeout(()=>{run();},1000/worldRefreshRate);

  }

  run();


}