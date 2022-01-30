import * as Entities from './Entities/Entities.mjs'
import * as Components from './components/Components.mjs'


export default function entityFactory(world,type,param) {
    const newEntity = {
      type : type,
      //positionBuffer : [],
      actionBuffer : [],
      lastProcessedAction : 0
    }

    const uniqueId = ()=>{
      let id = ``;
      for(let i=0;i<3;i++){
        id += `${parseInt(Math.random()*999)}`;
        (i<2)? id +='-' : '';
      }
      if(!world.map(x=>x.id).includes(id)){return id}
      console.error('not unique');
      uniqueId();
    }
  
    //minimum props of an entitie
    newEntity.destroy = () => {
      const newEntityIndex = world.findIndex(entity => entity.id === newEntity.id);
      world.splice(newEntityIndex,1);
    }
    newEntity.addToWorld = (entity)=>{
      if (entity){
        world.push(entity);
      } else {
      world.push(newEntity);
      }
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
          Object.keys(props).forEach(prop => { 
            if (typeof props[prop] === 'function') { 
              newEntity[prop]=props[prop];
              (!newEntity['cooldown']) ? newEntity['cooldown'] = {} : '';
              newEntity['cooldown'][prop] = props.cooldown[prop];
            } else {
              newEntity[prop]=props[prop];
            }

        });
          }
         
        });

     

      newEntity.actions ? delete newEntity.actions : '';
      //newEntity.move ? delete newEntity.move : '';

      (!param.id)? newEntity.id = uniqueId() : newEntity.id = param.id;
      (param.socket) ? newEntity.socket = param.socket : '';

      console.log('new :',newEntity);
      newEntity.addToWorld();
      return newEntity
    }
    console.error('Error : entity not builded');
   
}