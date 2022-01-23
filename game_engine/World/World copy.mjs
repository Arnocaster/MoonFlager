import { Flag, Player } from "../index.mjs";

export default class World {
  #settings
  #actionsBuffer
  get settings() {
    return this.#settings;
  }
  get actionsBuffer(){
    return this.#actionsBuffer;
  }

  constructor() {
    this.id = parseInt(Math.random()*500000);
    this.entities = {};

    this.#settings = {
      width: 400,
      height: 400,
      refreshRate: 15,
    }

    this.#actionsBuffer = [];
  }

  processActions() {
    const start = Date.now();
    const move = ['moveForward', 'moveBackward', 'turnLeft', 'turnRight'];
    //Lit toutes les actions stackées, les applique au monde
    if (this.#actionsBuffer.length > 0) {
      this.#actionsBuffer.forEach(player => {
        const playerElt = this.findEntitieById(player.id);
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
        this.#actionsBuffer = [];
      });
      //console.log(Date.now() - start);
    }
  }

  updateWorld(start) {
    //Process input player movement.
    //this.processActions();
    if (Date.now()-start > 1000){
      // console.clear();
      // console.log(this.#world);
      start = Date.now();
    }
    //!WORLDS OUT
    console.log(this.entities);
    return this.entities;
  }

  findEntitieById(id, array) {
    if (array) {
      return array.find(entitie => entitie.id === id);
    }
    return this.entities.Player.find(entitie => entitie.id === id);
  }

  updatePlayers(newWorld) {
    if (newWorld.entities) {
      //Pour chaque joueur de l'ancien monde
      this.entities.forEach(oldEntity => {
        //S'il n'existe plus dans le nouveau monde on le supprime;
        if (!this.findEntitieById(oldEntity.id, newWorld.players)) {
          this.removeEntitie(oldEntity.id);
        }
      });
      //Pour chaque joueur du nouveau monde
      newWorld.entities.forEach(newEntity => {
        //On regare s'il existe déjà dans l'ancien monde
        if (!this.findPlayerById(newEntity.id)) {
          this.addPlayer(newEntity.id, newEntity);
        }
      });
    }
    //Pour chaque joueur on change les valeurs de la propriété
    //Liste chaque joueur de l'ancien monde
    this.entities.forEach(entity => {
      //On cherche la nouvelle position du joueur dans le nouveau monde
      //Postition du nouveau joueur
      //const newP = newWorld.players.array.find(player => player.id === id);
      const newEnt = newWorld.entities.find(nEntity => nEntity.id === entity.id);
      if (newP) {
        entity.position = newEnt.position;
        return
      }
      console.log("This player cannot be found in the new world");
    });
  }

  addPlayer(id, propreties) {
    new Player(id, propreties,this);
    console.log("New Player");
  }

  removeEntity(id,type) {
    if (this.entities[type]){
    this.entities[type].splice(players.findIndex(player => player.id === id), 1);
    console.log("Delete Player");
    return
    }
    console.log('This entity has not been found');
  }

  addToWorld(entity) {
    const entityType = entity.constructor.name;
    //console.log("addToworld",entity);
    if(!this.entities[entityType]){
      this.entities[entityType] = [entity];
      return
    }
    this.entities[entityType].push(entity);
    
    // if (entity.position && !entity.isInWorld) {
    //   entity.isInWorld = true;
    //   if (!this.#world[entityType]) {
    //     this.#world[entityType] = [entity];
    //     console.log(`New entitie ${entityType} added at : x:${entity.position.x},y:${entity.position.y}`);
    //     console.log('after add',this.#world);
    //     return
    //   }
    //   this.#world[entityType].push(entity);
    //   console.log(`New entitie ${entityType} added at : x:${entity.position.x},y:${entity.position.y}`);
    //   return
    // }
    // console.log(`This entity hasn't be added to the world`);
    return entity;
  }

}