export function move(newEntity) {
  const moveComponent = {
    cooldown: { moveForward: 50, moveBackward: 50, turnLeft: 50, turnRight: 50 },
    velocity: 0,
    acceleration : 0,
    moveForward: (entity) => {
        entity.position.x = entity.position.x + (Math.cos(entity.position.angle) * entity.move.speed);
        entity.position.y = entity.position.y + (Math.sin(entity.position.angle) * entity.move.speed);
        entity.checkCollisions(entity);
      },
    moveBackward: (entity) => {
        entity.position.x = entity.position.x - (Math.cos(entity.position.angle) * entity.move.speed);
        entity.position.y = entity.position.y - (Math.sin(entity.position.angle) * entity.move.speed);
        entity.checkCollisions(entity);
      },
    turnLeft: (entity) => {
        entity.position.angle -= entity.move.speed_rotation;
        entity.checkCollisions(entity);
      },
    turnRight: (entity) => {
        entity.position.angle += entity.move.speed_rotation;
        entity.checkCollisions(entity);
      },
    }
    return moveComponent;
  }

