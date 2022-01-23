export default class Entities {
  constructor() {
    this.Entities = [];
    return this;
  }

  get(type) {
    if (type) {
      if (this.Entities.type) {
        return this.Entities[type];
      }
      console.error('This type has not been found');
    }
    return this.Entities;
  }

  add(entity) {
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
    //Chercher l'entité
    Object.keys(this.Entities).forEach(entityType => {
      const index = this.Entities[entityType].find(entity => entity.id === id);
      if (index) {
        this.Entities[entityType].splice(index, 1);
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