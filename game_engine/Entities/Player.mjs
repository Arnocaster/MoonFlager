import Entities from './Entities.mjs';
import Flag from './Flag.mjs';

export default class Player extends Entities {
  constructor(id, propreties) {
    super();
    this.id = id;
    this.class = this.constructor.name;
    if (!propreties) {
      this.position = {
        x: parseInt(Math.random() * 400),
        y: parseInt(Math.random() * 400),
        angle: Math.PI,
        speed: 4,
        speed_rotation: 0.08
      };
      this.color = `rgb(${parseInt(Math.random() * 255)}, 
                      ${parseInt(Math.random() * 255)},
                      ${parseInt(Math.random() * 255)})`;
    } else {
      this.position = propreties.position;
      this.color = propreties.color;
    }
    this.equipped = null;
    return this;
  }

  use() {
    if (this.equipped !== null) {
      this.entityWithClass(this.equipped).use(this);
      return
    }
    console.log('Nothing equipped');
  }

  drop(entity){
    console.log(this,entity,this.Entities);  
    console.log("player drop");
    this.equipped = null;
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

  moveForward(){
    this.position.x = this.position.x + (Math.cos(this.position.angle) * this.position.speed);
    this.position.y = this.position.y + (Math.sin(this.position.angle) * this.position.speed);
    this.checkCollision();
  }
  moveBackward(){
    this.position.x = this.position.x - (Math.cos(this.position.angle) * this.position.speed);
    this.position.y = this.position.y - (Math.sin(this.position.angle) * this.position.speed);
    this.checkCollision();
  }
  turnLeft(){
    this.position.angle -= this.position.speed_rotation;
    this.checkCollision();
  }

  turnRight(){
    this.position.angle += this.position.speed_rotation;
    this.checkCollision();
  }
  checkCollision() {
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