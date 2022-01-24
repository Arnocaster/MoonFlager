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
    this.id = id || 'server';
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
      console.log(id);
      this.entities.remove(id);
      console.log(this.entities.get());
      return
    }
    console.error('You need an Id to delete a player');
  }

  updateWorld(newWorld) {
    const oldWorld = this.entities.get();

    //Only Client side;
    if (newWorld) {
       //Si des entités sont présentes dans oldWorld mais pas dans le nouveau on les supprime
       Object.keys(oldWorld).forEach(type=>{
         oldWorld[type].forEach(oldEnt =>{
          const found  = newWorld[type].find(newEnt => newEnt.id === oldEnt.id);
          if (!found){
            this.entities.remove(oldEnt.id);
          }
         });
        
      
      });


      Object.keys(newWorld).forEach(type => {
        newWorld[type].forEach(entity => {
          //Si oldWorld est vide et qu'on a recu un monde avec une entité :on ajoute une entité
          if (Object.keys(oldWorld).length<1){
            const thisClass = new this.entities.classes[type];
            this.entities.add(thisClass, entity);
          }
          //Si la propriété existe déjà dans le monde
          if (oldWorld[type]) {
            //On regarde si l'entité existe déjà dans l'ancien monde
            const foundInOld = oldWorld[type].find(oldEnt => oldEnt.id === entity.id);
            //Si l'entité n'est pas trouvée dans l'ancien monde on l'ajoute
            if (!foundInOld) {
              const thisClass = new this.entities.classes[type];
              this.entities.add(thisClass, entity);
            }
          } else {
            //?sinon on la rajoute???
          }
        });
      });

     



      // Object.keys(oldWorld).forEach(type=>{
      //   oldWorld[type].forEach(oldEntity => {
      //     //On cherche dans l'ancien monde si des joueurs ne sont pas présent dans le nouveau;
      //     const lostClient = newWorld[type].filter(NewEntity => NewEntity.id !== oldEntity.id && NewEntity.id !== this.id);
      //     if (lostClient.length > 0){
      //       this.entities.remove(lostClient[0].id);
      //     }
      //   });
      // });

    }
    //Update each entitie;
    return this.entities.get();
  }

}