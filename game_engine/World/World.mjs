import { Player } from "../index.mjs";

export default class World {
  constructor() {
    this.world = {
      players: [],
      flags: []
    }

    this.settings = {
      width: 400,
      height: 400,
      refreshRate: 15,
    }

    this.actionsBuffer = [];
  }

  processActions() {
    const start = Date.now();
    const move = ['moveForward', 'moveBackward', 'turnLeft', 'turnRight'];
    //Lit toutes les actions stackées, les applique au monde
    if (this.actionsBuffer.length > 0) {
      this.actionsBuffer.forEach(player => {
        const playerElt = this.findPlayerById(player.id);
        player.data.forEach(actionType => {
          //!BTM actions = players input, need to insert action type:  message,?...
          actionType.forEach(action => {
            if (move.includes(action)) {
              playerElt.move(action);
            }
            if (action === 'use') {
              playerElt.use();
            }
          });
        })
        this.actionsBuffer = [];
      });
      console.log(Date.now() - start);

    }
  }

  updateWorld() {
    //Process input player movement.
    this.processActions();

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
    if (newWorld.players) {
      //Pour chaque joueur de l'ancien monde
      this.world.players.forEach(oldPlayer => {
        //S'il n'existe plus dans le nouveau monde on le supprime;
        if (!this.findPlayerById(oldPlayer.id, newWorld.players)) {
          this.removePlayer(oldPlayer.id);
        }

      });
      //Pour chaque joueur du nouveau monde
      newWorld.players.forEach(newPlayer => {
        //On regare s'il existe déjà dans l'ancien monde
        if (!this.findPlayerById(newPlayer.id)) {
          this.addPlayer(newPlayer.id, newPlayer);
        }
      });
    }
    //Pour chaque joueur on change les valeurs de la propriété
    //Liste chaque joueur de l'ancien monde
    this.world.players.forEach(player => {
      //On cherche la nouvelle position du joueur dans le nouveau monde
      //Postition du nouveau joueur
      //const newP = newWorld.players.array.find(player => player.id === id);
      const newP = newWorld.players.find(nPlayer => nPlayer.id === player.id);
      if (newP) {
        player.position = newP.position;
        return
      }
      console.log("This player cannot be found in the new world");
      //player.position.x = 50;


    });
  }

  addPlayer(id, propreties) {
    if (!propreties) {
      this.world.players.push(new Player(id));
      return;
    }
    this.world.players.push(new Player(id, propreties));
    console.log("New Player");
  }

  removePlayer(id) {
    const players = this.world.players;
    players.splice(players.findIndex(player => player.id === id), 1);
    console.log("Delete Player");
  }


}