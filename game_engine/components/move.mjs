export function move() {
  return {
    moveForward: () => {
      this.position.x = this.position.x + (Math.cos(this.position.angle) * this.position.speed);
      this.position.y = this.position.y + (Math.sin(this.position.angle) * this.position.speed);
      this.checkCollision();
    },
    moveBackward: () => {
      this.position.x = this.position.x - (Math.cos(this.position.angle) * this.position.speed);
      this.position.y = this.position.y - (Math.sin(this.position.angle) * this.position.speed);
      this.checkCollision();
    },
    turnLeft: () => {
      this.position.angle -= this.position.speed_rotation;
      this.checkCollision();
    },

    turnRight: () => {
      this.position.angle += this.position.speed_rotation;
      this.checkCollision();
    },

  }
}

