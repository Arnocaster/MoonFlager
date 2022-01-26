import World from '../../game_engine/World.mjs'


export default function Network(io) {
  const serverWorld = new World();
  const socket = null;



  io.on('connection', (socket) => {
    console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
    io.to(socket.id).emit('client_socket', socket.id);
    //INIT PLAYER
    const player = serverWorld.createPlayer(socket.id);
    console.log('Server world after new connection', serverWorld.display({ type: '', id: '' }));
    io.to(socket.id).emit('server_time', Date.now());


    socket.on('disconnect', (reason) => {
      serverWorld.destroy({ socket: socket.id });
      console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
      console.log('Server world after new deconnection', serverWorld.display({ type: '', id: '' }));
    });

    socket.on('player_actions', (data) => {
      this.world.actionsBuffer.push({ socket: socket.id, data });
    });

    socket.on('ping_request', (ping_req) => {
      io.to(socket.id).emit('ping_response', { ping_req, ping_res: Date.now() });
    });

  });

    const run = (start) => {
    const newWorld = this.world.updateWorld();
    this.io.emit('world_update',newWorld);
  }


}