import * as Entities from './Entities/Entities.mjs'
import * as Components from './components/Components.mjs'

export default function entityFactory(world,type,socket) {
    const newEntity = {
      id : world.length,
      type : type,
    }
    //minimum props of an entitie
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
    newEntity.checkCollisions = Components.collisions(newEntity);
    
    
    
    //Builder
    if (Entities[type] !== undefined){
      const EntityRecipe = Entities[type]();
      Object.keys(EntityRecipe).forEach(param=>{
        
        //If it's not a component
        if(!EntityRecipe[type]){
          newEntity[param] = EntityRecipe[param];
        }
        
        //? Hack => Need to implement 'autoPlay' component
        Object.keys(EntityRecipe.position).includes('random') ? newEntity.position = {x:parseInt(Math.random()*400), y:parseInt(Math.random()*400),angle:(Math.random()*Math.PI)} : '';
        
        //If it's a component
        if (Object.keys(Components).includes(param)){
        const props = Components[param](EntityRecipe,newEntity);
        Object.keys(props).forEach(prop => {newEntity[prop]=props[prop]});
        console.log(newEntity.position)
        }
       
      });

     

      newEntity.actions ? delete newEntity.actions : '';
      //newEntity.move ? delete newEntity.move : '';

      if(type === 'player'){
        if (!socket){
          console.error('Player has no socket!');
          return
        }
        newEntity.socket = socket;
      } 

      console.log(newEntity);
      newEntity.addToWorld();
      return newEntity
    }
    console.error('Error : entity not builded');
   
}