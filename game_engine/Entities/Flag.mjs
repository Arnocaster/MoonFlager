import { Entities } from '../index.mjs';

export default class Flag extends Entities {
  constructor(ownerId, position) {
    super();
    this.id = parseInt(Math.random() * 5000000);
    this.position = { x: position.x, y: position.y };
    this.owner = ownerId;
    this.isInWorld = false;
    this.text = `xxxI MADE ITxxx`;
    this.color = `rgb(${parseInt(Math.random() * 255)}, 
    ${parseInt(Math.random() * 255)},
    ${parseInt(Math.random() * 255)})`;
    this.add(this);
  }

  use() {
    //=DROP FOR A FLAG
    this.drop();
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