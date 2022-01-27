export function player() {
  return {
  socket : null,
  actions : {equip:true,
             use:true,
             drop:true},
  position : {random : true},
  move : {type : 'human',
          speed : 1,
          speed_rotation : 0.08},
  color : `rgb(${parseInt(Math.random() * 255)}, 
               ${parseInt(Math.random() * 255)},
               ${parseInt(Math.random() * 255)})`,
  render : (ctx,position) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = this.color;
    ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
  }
}