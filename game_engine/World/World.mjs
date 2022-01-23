import { Entities, Player } from '../index.mjs';

export default class World {
  #settings
  #actionsBuffer
  get settings() {
    return this.#settings;
  }
  get actionsBuffer() {
    return this.#actionsBuffer;
  }

  constructor(id) {
    this.id = id;
    this.entities = new Entities;

    this.#settings = {
      width: 400,
      height: 400,
      refreshRate: 15,
    }

    this.#actionsBuffer = [];
  }

  addPlayer(id) {
    if (id) {
      this.entities.add(new Player(id));
      return
    }
    console.error('You need an Id to create a player');
  }

  removePlayer(id) {
    if (id) {
      this.entities.remove(id);
      return
    }
    console.error('You need an Id to delete a player');
  }

  updateWorld(newWorld) {
    const oldWorld = this.entities.get();

    if (newWorld) {
      Object.keys(newWorld).forEach(type => {
        newWorld[type].forEach(entity => {
          if (Object.keys(oldWorld).length<1){
            const thisClass = new this.entities.classes[type];
            this.entities.add(thisClass, entity);
            console.log('length');
          }
          if (oldWorld[type]) {
            const foundInOld = oldWorld[type].find(oldEnt => oldEnt.id === entity.id);
            if (!foundInOld) {
              const thisClass = new this.entities.classes[type];
              this.entities.add(thisClass, entity);
            }
          }
        });
      });

      Object.keys(oldWorld).forEach(type=>{
        oldWorld[type].forEach(oldEntity => {
          const lostClient = newWorld[type].filter(NewEntity => NewEntity.id === oldEntity.id);
          console.log(lostClient[0].id);
          this.entities.remove(lostClient[0].id);

        });
        // const lostClients = oldWorld[type].filter(oldEnt => newWorld[type].includes(oldEnt.id));
        // console.log('lost',lostClients);
      });

    }
    //Update each entitie;
    return this.entities.get();
  }

}