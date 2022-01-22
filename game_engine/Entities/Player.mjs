import Entities from './Entitie.mjs';

export default class Player extends Entities {
  constructor(id,propreties) {
    super();
    this.id = id;
    if (!propreties){
    this.position = {
      x: parseInt(Math.random() * 400),
      y: parseInt(Math.random() * 400),
      angle: Math.PI,
      speed: 1,
      speed_rotation: 0.08
    };
    this.color = `rgb(${parseInt(Math.random() * 255)}, 
                      ${parseInt(Math.random() * 255)},
                      ${parseInt(Math.random() * 255)})`;
  } else {
    this.position = propreties.position;
    this.color = propreties.color;
  }
    

  }

  render(ctx){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x,this.position.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
}