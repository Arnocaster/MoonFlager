import {Player,Flag} from '../index.mjs'

export default class Entities {
  #Entities

  constructor() {
    this.#Entities = [];
    this.classes = {Player,Flag};
    return this;
  }

  get(type) {
    // if (type) {
    //   if (this.#Entities.type) {
    //     return this.#Entities[type];
    //   }
    //   console.error('This type has not been found');
    //   return;
    // }
    return this.#Entities;
  }

  add(entity,entityToCopy) {
    const entityType = entity.constructor.name;
    if (entityToCopy){
      Object.assign(entity,entityToCopy);
    }
    if (!this.#Entities[entityType]) {
      this.#Entities[entityType] = [entity];      
      console.log(`New entitie ${entityType} added`);
      return;
    }
    this.#Entities[entityType].push(entity);
    console.log(`New entitie ${entityType} added`);
  }

  remove(id) {
    //Chercher l'entité
    Object.keys(this.#Entities).forEach(entityType => {
      const index = this.#Entities[entityType].find(entity => entity.id === id);
      if (index) {
        this.#Entities[entityType].splice(index, 1);
        console.log(`New entitie ${entityType} added`);
      }
    });
  }

  //pick
  drop(entity) {
    console.log("Drop:", entity);
  }
  //use  
}