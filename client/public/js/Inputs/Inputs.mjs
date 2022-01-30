//!GET PLAYER INPUT
//!SEND IT TO LOCAL WORLD && TO SERVER
export default class Inputs {
  constructor() {
    this.lastInput = Date.now();
    this.inputs = [];
    this.bufferInput = [];
    this.addListeners(this.inputs);

    this.inputCount = 0;
    this.lastTs = Date.now();
  }

  addListeners(inputs) {
    document.addEventListener('keydown', function (e) {
      inputs[e.code] = true;
    });

    document.addEventListener('keyup', function (e) {
      inputs[e.code] = false;
    });
  }

  resetBufferInput() {
    this.bufferInput = [];
  }

  getBufferInput() {
    const bufferInput = this.bufferInput;
    this.bufferInput = [];
    return bufferInput;
  }

  inputManager() {
    const deltaTs = ( Date.now() -this.lastTs) / 1000;
    

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
    if (actions.length > 0 && deltaTs > 40/1000) {
      this.lastTs = Date.now();
      this.bufferInput.push({inputCount : this.inputCount++, deltaTs, actions});
      return;
    }
  }
}