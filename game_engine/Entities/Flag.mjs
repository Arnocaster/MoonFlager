import { Entities } from '../index.mjs';

export default class Flag extends Entities {
  constructor(ownerId, position) {
    super();
    this.class = this.constructor.name;
    this.position = position ? {x:position.x,y:position.y} : {x:200,y:200};
    this.owner = ownerId || parseInt(Math.random() * 5000000);
    this.isInWorld = false;
    this.text = `xxxI MADE ITxxx`;
    this.color = `rgb(${parseInt(Math.random() * 255)}, 
    ${parseInt(Math.random() * 255)},
    ${parseInt(Math.random() * 255)})`;
    return this;
  }

  usage(parent) {
    parent.drop(this);
  }

  render(ctx) {
    const x = this.position.x;
    const y = this.position.y;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 16);
    ctx.lineTo(x + 5, y - 13);
    ctx.lineTo(x + 5, y - 10);
    ctx.fill();
    ctx.stroke();
  }
}