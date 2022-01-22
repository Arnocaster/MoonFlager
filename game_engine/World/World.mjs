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
    this.updateWorld();
  }

  updateWorld() {
    //Process input player movement.
    
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
        this.addPlayer(newPlayer.id);
      }
    });
  }
  }

  // async updatePlayers(newClientsIds,lostClientsIds) {
  //   if (newClientsIds.length > 0) {
  //     await newClientsIds.forEach(id => {
  //       this.addPlayer(id);
  //     });
  //   }

  //   if (lostClientsIds.length > 0) {
  //     await lostClientsIds.forEach(id => {
  //       this.removePlayer(id);
  //     });
  //   }
  // }

  addPlayer(id) {
    this.world.players.push(new Player(id));
    console.log("New Player");
  }

  removePlayer(id) {
    const players = this.world.players;
    players.splice(players.findIndex(player => player.id === id), 1);
    console.log("Delete Player");
  }


}