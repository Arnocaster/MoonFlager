import { Player, Flag } from '../index.mjs'

export default class Entities {
  #Entities
  #classes

  constructor() {
    this.#Entities = {};
    this.#classes = { Player, Flag };
    return this;
  }

  get classes() {
    return this.#classes;
  }

  get Entities() {
    return this.#Entities;
  }

  entitiesWithClasses(entities) {
    const wrappedEntities = {};
    Object.keys(entities).forEach(type => {
      entities[type].forEach(entitie => {
        if (!wrappedEntities[type]) {
          wrappedEntities[type] = [Object.assign(new this.classes[type], entitie)];
        } else {
          wrappedEntities[type].push(Object.assign(new this.classes[type], entitie));
        }
      });
    });
    this.#Entities = wrappedEntities;
  }

  add(entity, entityToCopy) {
    const entityType = entity.constructor.name;
    if (!this.Entities[entityType]) {
      this.Entities[entityType] = [entity];
      console.log(`New entitie ${entityType} added`);
      return;
    }
    this.Entities[entityType].push(entity);
    console.log(`New entitie ${entityType} added`);
  }

  remove(id) {
    Object.keys(this.Entities).forEach(entityType => {
      const index = this.Entities[entityType].find(entity => entity.id === id);
      if (index) {
        this.Entities[entityType].splice(index, 1);
        console.log(`Entitie ${entityType} removed`);
      }
    });
  }

  getById(id) {
    let found = undefined;
    for (const type of Object.keys(this.#Entities)) {
      found = this.#Entities[type].find(entity => entity.id === id);
      if (found) { return found };
    };
  }
  //pick
  drop(entity) {
    console.log("Drop:", entity);
  }

  processActions(actions) {
    if (Object.keys(actions).length > 0) {
      actions.forEach(stack => {
        console.log(stack.data, stack.data.length);
        for (const movment of stack.data[0]) {
          const entityElt = this.getById(stack.id)
          if (entityElt[movment]) {
            entityElt[movment]();
          }
        }
      });

    }

  }
  //use  
}