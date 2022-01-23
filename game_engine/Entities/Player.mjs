import Entities from './Entities.mjs';

export default class Player extends Entities {
  constructor(id, propreties) {
    super();
    this.id = id;
    if (!propreties) {
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
    //this.equipped = new Flag(world,this.id,this.position);
    this.add(this);
  }

  use() {
    if (this.equipped !== null) {
      this.equipped.use(this);
    }
  }

  render(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }


  move(movment) {
    if (movment.includes('moveForward')) {
      this.position.x = this.position.x + (Math.cos(this.position.angle) * this.position.speed);
      this.position.y = this.position.y + (Math.sin(this.position.angle) * this.position.speed);
    }
    if (movment.includes('moveBackward')) {
      this.position.x = this.position.x - (Math.cos(this.position.angle) * this.position.speed);
      this.position.y = this.position.y - (Math.sin(this.position.angle) * this.position.speed);
    }
    if (movment.includes('turnLeft')) {
      this.position.angle -= this.position.speed_rotation;
    }
    if (movment.includes('turnRight')) {
      this.position.angle += this.position.speed_rotation;
    }
    if (this.position.x > 400) {
      this.position.x = 400
    }
    if (this.position.y > 400) {
      this.position.y = 400
    }
    if (this.position.x < 0) {
      this.position.x = 0
    }
    if (this.position.y < 0) {
      this.position.y = 0
    }
  }
}