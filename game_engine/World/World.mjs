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
    this.entities = new Entities();
    this.world = {};
    this.#actionsBuffer = [];

    this.#settings = {
      width: 400,
      height: 400,
      refreshRate: 5,
    }


  }
  getMethods (obj) {
    let properties = new Set()
    let currentObj = obj
    do {
      Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
  }

  create(type, params) {
    const newEntity = this.entities.create(type, params);
    if (!this.world[type]) {
      this.world[type] = [newEntity];
      return newEntity;
    }
    this.world[type].push(newEntity);
    console.log(`New entity${newEntity.constructor.name} added`);
    return newEntity;
  }

  destroy(obj) {
    let searchType = Object.keys(obj);
    if (searchType.length === 1 || searchType.includes('id')) {
      searchType.includes('id') ? searchType = 'id' : searchType = searchType[0];
      for (const type of Object.keys(this.world)){
        const foundIndex = this.world[type].findIndex(entity => entity[searchType] === obj[searchType]);
        if (foundIndex !== -1){
          const removed = this.world[type].splice(foundIndex,1);
          console.log(`Destroy : Removed Entity ${removed[0].constructor.name} with id ${removed.id}`);
          return removed[0];
        }
      }
      console.error(`Destroy : Entity not found, remove fail `);
    }
  }

  find(obj) {
    //NEEDImplement multiple research type ({obj.id obj.class obj.alive}).
    //NEEDImplement multiple return fonctionnement. 
    let searchType = Object.keys(obj);
    if (searchType.length === 1 || searchType.includes('id')) {
      searchType.includes('id') ? searchType = 'id' : searchType = searchType[0];
      for (const type of Object.keys(this.world)) {
        const found = this.world[type].find(entity => entity[searchType] === obj[searchType]);
        if (found) { return found }
      }
      console.error(`Find : Something went wrong ${obj}`);
    }
    console.error(`Find : I can't find this type of data (need to be implemented)`);
  }

  equip(what,who){
    console.log("equipbrut",what.id,who.id);
    if(what.id && who.id){
    const whatElt = this.find({...what});
    this.destroy({...whatElt});
    const whoElt = this.find({...who});
    whoElt.equip(whatElt);
    console.log('foundElts',whatElt.id,whoElt.id);
    return
    }
    console.error(`Equip : This entity doesn't have an id`);
  }

  



  processActions(){
    if(Object.keys(this.actionsBuffer).length > 0){
      this.actionsBuffer.forEach(stack =>{
        const player = this.find({socket:stack.socket});
        stack.data[0].forEach(action =>{
          if (player[action]){
            player[action]();
          } else {
            console.error(`${player.constructor.name} can not do ${action}`);
          }
        });
      });
    }
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
      //Suprime les anciennes classes dans 
      this.world = this.entities.entitiesWithClasses(newWorld);
    }
    //Process Actions
    this.processActions();
    this.#actionsBuffer = [];
    return this.world;
  }

}