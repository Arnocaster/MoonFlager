export function player() {
  return {
  socket : null,
  actions : {equip:true,
             use:true,
             drop:true},
  position : {random : true},
  move : {type : 'human',
          speed : 5,
          speed_rotation : 0.25},
  color : `rgb(${parseInt(Math.random() * 255)}, 
               ${parseInt(Math.random() * 255)},
               ${parseInt(Math.random() * 255)})`,
  render : (ctx,position,color) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = color;
    ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
  }
}