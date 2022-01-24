import { Entities, Player, Flag } from '../index.mjs';

export default class World {
  #settings
  #actionsBuffer
  get settings() {
    return this.#settings;
  }
  get actionsBuffer() {
    return this.#actionsBuffer;
  }

  set actionsBuffer(action) {
   this.#actionsBuffer.push(action);
  }

  constructor(id) {
    this.id = id || 'server';
    this.entities = new Entities;
    this.#actionsBuffer = [];

    this.#settings = {
      width: 400,
      height: 400,
      refreshRate: 15,
    }


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
      console.log(id);
      this.entities.remove(id);
      console.log(this.entities);
      return
    }
    console.error('You need an Id to delete a player');
  }
  /** Update players and actions
   * Client = update Entities + (to be implemented process Input)
   * Server = process Inputs
   * @param {object} newWorld client-side only === fresh server entities
   * @returns {object} return all entitites
   */
  updateWorld(newWorld) {
    //Only Client side;
    if (newWorld) {
      //Ajoute les classes et mets a jours le monde 
      this.entities.entitiesWithClasses(newWorld);
    }
    //Process Actions
    //Actually only Players Actions
    this.entities.processActions(this.#actionsBuffer);
    this.#actionsBuffer = [];
    return this.entities.Entities;
  }

}