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

  constructor() {
    this.id = parseInt(Math.random() * 500000);
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
            const found = oldWorld[type].find(oldEnt => oldEnt.id === entity.id);
            if (!found) {
              const thisClass = new this.entities.classes[type];
              this.entities.add(thisClass, entity);
              console.log('!found');
            }
          }



        });
      });

    }
    //Update each entitie;
    return this.entities.get();
  }

}