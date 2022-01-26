import * as Entities from './Entities/Entities.mjs'
import * as Components from './components/Components.mjs'

export default function entityFactory(world,type,socket) {
    const newEntity = {
      id : world.length,
      type : type,
    }

    newEntity.destroy = () => {
      world.splice(newEntity.id,1);
    }
    newEntity.addToWorld = ()=>{
      world.push(newEntity);
    }
    newEntity.findBy = (params)=>{

      if (Object.keys(params).length === 1){
        const proprety = Object.keys(params)[0];
        const value = params[Object.keys(params)[0]];
        const foundEntity = world.find(entity => entity[proprety] === value);
        return foundEntity;
      }
    }

    if (Entities[type] !== undefined){
      const Entity = Entities[type]();
      Object.keys(Entity).forEach(param=>{

        //If it's not a component
        if(!Entity[type]){
          newEntity[param] = Entity[param];
        }

        //If it's a component
        if (Object.keys(Components).includes(param)){
        const props = Components[param](Entity,newEntity);
        Object.keys(props).forEach(prop => {newEntity[prop]=props[prop]});
        }
       
      });

      //randomise position
      Object.keys(newEntity.position).includes('random') ? newEntity.position = {x:parseInt(Math.random()*400), y:parseInt(Math.random()*400)} : ''

      newEntity.actions ? delete newEntity.actions : '';

      if(type === 'player'){
        if (!socket){
          console.error('Player has no socket!');
          return
        }
        newEntity.socket = socket;
      } 


      newEntity.addToWorld();
      return newEntity
    }
    console.error('Error : entity not builded');
   
}