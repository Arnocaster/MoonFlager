//!GET PLAYER INPUT
//!SEND IT TO LOCAL WORLD && TO SERVER
export default class Inputs {
  constructor(){
    this.lastInput= Date.now();
    this.inputs= [];
    this.actions = [];
    this.lastActions = [];
    this.addListeners();
  }

  addListeners() {

      document.addEventListener('keydown', function (e) {
        if (Date.now() - this.lastInput > 1) {
          this.inputs[e.code] = true;
          this.lastInput = Date.now();
        }
      });

      document.addEventListener('keyup', function (e) {
        if (Date.now() - this.lastInput > 1) {
          this.inputs[e.code] = false;
          this.lastInput = Date.now();
        }
      });
  }

  inputManager (){
    const actions = [];
    if(this.inputs.ArrowUp || this.inputs.KeyW){
      actions.push('moveForward');
    }
    if(this.inputs.ArrowDown || this.inputs.KeyS){
      actions.push('moveBackward');
    }
    if(this.inputs.ArrowLeft || this.inputs.KeyA){
      actions.push('turnLeft');
    }
    if(this.inputs.ArrowRight || this.inputs.KeyD){
      actions.push('turnRight');
    }
    //!NEED EVERY DETAIL HERE
    if(actions.every((val, index) => val === this.lastActions[index]) && actions.length > 0){
      //this.send({move : actions});
      console.log(actions);
    }
    this.lastActions = actions;
    return actions;
  }
}