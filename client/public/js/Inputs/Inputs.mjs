//!GET PLAYER INPUT
//!SEND IT TO LOCAL WORLD && TO SERVER
export default class Inputs {
  constructor(){
    this.lastInput= Date.now();
    this.inputs = [];
    this.actions = {};
    this.lastActions = [];
    this.addListeners(this.inputs);
  }

  addListeners(inputs) {
      document.addEventListener('keydown', function (e) {
          inputs[e.code] = true;
      });

      document.addEventListener('keyup', function (e) {
          inputs[e.code] = false;
      });
  }

  inputManager (){
    const actions = [];
    if(this.inputs.ArrowUp ||  this.inputs.KeyW){
      actions.push('moveForward');
    }
    if(this.inputs.ArrowDown ||  this.inputs.KeyS){
      actions.push('moveBackward');
    }
    if(this.inputs.ArrowLeft ||  this.inputs.KeyA){
      actions.push('turnLeft');
    }
    if(this.inputs.ArrowRight || this.inputs.KeyD){
      actions.push('turnRight');
    }
    if (actions.length>0){
    this.actions['move'] = actions;
    return;
    }
    delete this.actions['move']
  }
}