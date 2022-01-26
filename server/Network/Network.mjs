import world from '../../game_engine/World.mjs'


export default function Network(io){
  const serverWorld = world();
  const socket = null;



  io.on('connection',(socket)=>{
    console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
    io.to(socket.id).emit('client_socket', socket.id);
    const player = serverWorld.createPlayer(socket);

  });
 
  
}


// export default class Network {
//   constructor(io){
//     this.io = io;
//     this.world = world();
//     console.log(this.world());
//     this.socket = null;

  //   io.on('connection',(socket)=>{
  //     console.log(`New connection with Id : ${socket.id} and Ip : ${socket.handshake.address}`);
  //     this.io.to(socket.id).emit('client_socket', socket.id);
  //     const player = this.world.create('Player', { socket:socket.id });
  //     const flag = this.world.create('Flag');
  //     this.world.equip(flag,player);
  //     this.io.to(socket.id).emit('server_time',Date.now());
   
  //     Object.keys(this.world.world).forEach(type=>{
  //       this.world.world[type].forEach(entity =>{console.log(entity.class,'id',entity.id)});
  //     });

  //     socket.on('disconnect', (reason) => {
  //       this.world.destroy({socket : socket.id});
  //       console.log(`Client disconnected with Id ${socket.id} and IP ${socket.handshake.address} ${reason}`);
  //       console.log('Server world after new deconnection',this.world.world);
  //     });

  //     socket.on('player_actions', (data) => {
  //       this.world.actionsBuffer.push({socket : socket.id, data});
  //     });

  //     socket.on('ping_request', (ping_req) => {
  //       this.io.to(socket.id).emit('ping_response', {ping_req,ping_res : Date.now()});
  //     });
  //   });
  //   let start = Date.now();
  //   setInterval(()=>{this.run(start);},16);
  // }

  // getMethods (obj) {
  //   let properties = new Set()
  //   let currentObj = obj
  //   do {
  //     Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  //   } while ((currentObj = Object.getPrototypeOf(currentObj)))
  //   return [...properties.keys()].filter(item => typeof obj[item] === 'function')
  // }

  // run(start) {
  //   // console.clear();
  //   // console.log(this.world.entities);
  //   const newWorld = this.world.updateWorld();
  //   this.io.emit('world_update',newWorld);
  // }
// }