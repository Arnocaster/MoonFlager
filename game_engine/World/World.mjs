import { Player } from "../index.mjs";

export default class World {
  constructor() {
    this.world = {
      players : [],
      flags :[]
    }

    this.settings = {
      width: 400,
      height: 400,
      refreshRate: 15,
    }

    this.actionsBuffer = [];
  }

  processActions(){
    //Lit toutes les actions stackées, les applique au monde
    this.actionsBuffer.forEach(player=>{

      console.log(this.findPlayerById(player.id), player.data);
    });
    this.actionsBuffer = [];
    //Reset des actions stackées
  }

  updateWorld() {
    //Process input player movement.
    this.processActions();

    //setTimeout(() => { this.updateWorld() }, this.settings.refreshRate);
    //!WORLDS OUT
    return this.world
  }

  findPlayerById(id, array) {
    if (array) {
      return array.find(player => player.id === id);
    }
    return this.world.players.find(player => player.id === id);
  }

  updatePlayers(newWorld) {
    if (newWorld.players){
      //Pour chaque joueur de l'ancien monde
      this.world.players.forEach(oldPlayer =>{
        //S'il n'existe plus dans le nouveau monde on le supprime;
        if (!this.findPlayerById(oldPlayer.id,newWorld.players)){
          this.removePlayer(oldPlayer.id);
        }

      });
    //Pour chaque joueur du nouveau monde
    newWorld.players.forEach(newPlayer => {
      //On regare s'il existe déjà dans l'ancien monde
      if(!this.findPlayerById(newPlayer.id)){
        this.addPlayer(newPlayer.id,newPlayer);
      }
    });
  }
  }

  addPlayer(id,propreties) {
    if (!propreties){
    this.world.players.push(new Player(id));
    return;
    }
    this.world.players.push(new Player(id,propreties));
    console.log("New Player");
  }

  removePlayer(id) {
    const players = this.world.players;
    players.splice(players.findIndex(player => player.id === id), 1);
    console.log("Delete Player");
  }


}