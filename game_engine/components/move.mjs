export function move() {
  const moveComponent = {
    cooldown: { moveForward: 50, moveBackward: 50, turnLeft: 50, turnRight: 50 },
    velocity: 0,
    acceleration : 0,
    moveForward: (entity,deltaTs) => {
      //! NEED TO ADD input_press_time near speed: x+= input.presstime * speed
        entity.position.x += (Math.cos(entity.position.angle) * (entity.move.speed));
        entity.position.y += (Math.sin(entity.position.angle) * (entity.move.speed));
        entity.checkCollisions(entity);
      },
    moveBackward: (entity,deltaTs) => {
        entity.position.x -= (Math.cos(entity.position.angle) * (entity.move.speed));
        entity.position.y -= (Math.sin(entity.position.angle) * (entity.move.speed));
        entity.checkCollisions(entity);
      },
    turnLeft: (entity,deltaTs) => {
        entity.position.angle -= (entity.move.speed_rotation);
        entity.checkCollisions(entity);
      },
    turnRight: (entity,deltaTs) => {
        entity.position.angle += (entity.move.speed_rotation);
        entity.checkCollisions(entity);
      },
    }
    return moveComponent;
  }

