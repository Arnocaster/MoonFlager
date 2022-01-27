export function move(newEntity) {
  const moveComponent = {
    moveForward: (entity) => {
      console.log("before",entity.position,entity.move);
      entity.position.x = entity.position.x + (Math.cos(entity.position.angle) * entity.move.speed);
      entity.position.y = entity.position.y + (Math.sin(entity.position.angle) * entity.move.speed);
      console.log(entity.position,entity.move);
    },
    moveBackward: (entity) => {
      entity.position.x = entity.position.x - (Math.cos(entity.position.angle) * entity.move.speed);
      entity.position.y = entity.position.y - (Math.sin(entity.position.angle) * entity.move.speed);
    },
    turnLeft: (entity) => {
      entity.move.angle -= entity.move.speed_rotation;
    },

    turnRight: (entity) => {
      entity.move.angle += entity.move.speed_rotation;
    },
  }
  return moveComponent;
}

