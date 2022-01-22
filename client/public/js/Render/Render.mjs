//! GET VALID WORLD AND RENDER IT
import {Player} from '/game-engine/index.mjs'
export default class render{
  constructor(){
    this.canvas = document.getElementById('canvas-world');
    this.canvas.width = 400;
    this.canvas.height = 400;
  }

  render(world){

    const getMethods = (obj) => {
      let properties = new Set()
      let currentObj = obj
      do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
      } while ((currentObj = Object.getPrototypeOf(currentObj)))
      return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    }
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    //!Render each entities/object of the world
    if (world){
    
     Object.keys(world).forEach(element=>{
        const entities = world[element]
        entities.forEach(entitie =>{
          //!GET PLAYER.RENDER();
          entitie.render(ctx);
          

        })
     });
    }
  }
}


