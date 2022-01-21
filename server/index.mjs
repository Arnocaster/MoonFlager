import {World} from '../game_engine/index.mjs'
import Network from './Network/Network.mjs'

//DOTENV
import dotenv from 'dotenv';
dotenv.config();
const Express_port = process.env.EXPRESS_PORT || 3000;
const Socket_port = process.env.SOCKET_PORT || 3001;

//EXPRESS
import Express from 'express';
const app = Express();

//HTTP
import http from 'http';
const server = http.createServer(app);

//SOCKET.IO
import * as socketio from 'socket.io';

//CORS
import cors from 'cors';
app.use(cors());

app.set('view engine','ejs');
app.set('views','../client');
app.use(Express.static('../client/public'));
app.use('/game-engine',Express.static('../game_engine'));

app.get('/',(req,res)=>{
  res.render('index');
});

const io = new socketio.Server({cors: {origin: "*"}});
new Network(io);

try {
  io.listen(Socket_port);
  console.log(`Socket Started on port ${Socket_port}`);
  server.listen(Express_port,()=>{
  console.log(`Express Started on port ${Express_port}`);
  });
} catch(err){
  console.error(err);
}

