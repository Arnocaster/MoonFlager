//!GET PLAYER INPUT
//!SEND IT TO LOCAL WORLD && TO SERVER
export default class Inputs {
  constructor() {
    this.lastInput = Date.now();
    this.inputs = [];
    this.oldActions = [];
    this.newActions = [];
    this.netWorkActions = [];
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
  getActions() {
    const newActions = this.newActions;
    this.netWorkActions = this.newActions.flat();
    (newActions.length > 0 ) ? this.oldActions.push(newActions) : '';
    (this.oldActions.length>0) ? this.oldActions = this.oldActions.flat().filter(oldAction => Date.now() - oldAction.timeStart < oldAction.cooldown-2) : '';
    this.newActions = [];
    return this.netWorkActions;
  }

  inputManager() {
    let actions = [];
    if (this.inputs.ArrowUp || this.inputs.KeyW) {
      actions.push('moveForward');
    }
    if (this.inputs.ArrowDown || this.inputs.KeyS) {
      actions.push('moveBackward');
    }
    if (this.inputs.ArrowLeft || this.inputs.KeyA) {
      actions.push('turnLeft');
    }
    if (this.inputs.ArrowRight || this.inputs.KeyD) {
      actions.push('turnRight');
    }
    if (this.inputs.KeyE) {
      actions.push('use');
    }
    if (actions.length > 0) {

      //actions =  ['moveFor','turnLeft']
      
      const oldValues = this.oldActions.map(oldAction => oldAction.value);
      const newActions = actions.filter(newAction => !oldValues.includes(newAction));
      newActions.forEach(newAction => this.newActions.push({cooldown : 50,timeStart : Date.now(),value : newAction}));
    
      return;
    }
  }
}