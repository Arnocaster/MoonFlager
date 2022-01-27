export function collisions(newEntity) {
    const checkCollisions = (entity) => {
      if (entity.position.x > 400) {
        entity.position.x = 400
      }
      if (entity.position.y > 400) {
        entity.position.y = 400
      }
      if (entity.position.x < 0) {
        entity.position.x = 0
      }
      if (entity.position.y < 0) {
        entity.position.y = 0
      }
    }
  return checkCollisions;
}
