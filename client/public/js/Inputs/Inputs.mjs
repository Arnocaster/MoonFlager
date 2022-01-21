//!GET PLAYER INPUT
//!SEND IT TO LOCAL WORLD && TO SERVER
export default class Inputs {
  constructor(){
    this.lastInput= null;
    this.inputs= [];
    this.actions = [];
    this.lastActions = [];
  }

  addListeners() {
    document.addEventListener('keydown', () => {
      //If it's not a document input
      if (event.currentTarget.activeElement != document.body) {
        return;
      }

      document.addEventListener('keydown', function (e) {
        if (Date.now() - this.lastInput > 1) {
          this.inputs[e.code] = true;
          this.lastInput = Date.now();
        }
      });

      document.addEventListener('keyup', function (e) {
        if (Date.now() - app.lastInput > 1) {
          this.inputs[e.code] = false;
          this.lastInput = Date.now();
        }
      });
    });

  },

  inputManager (){
    const actions = [];
    if(this.inputs.ArrowUp || app.inputs.KeyW){
      actions.push('moveForward');
    }
    if(this.inputs.ArrowDown || app.inputs.KeyS){
      actions.push('moveBackward');
    }
    if(this.inputs.ArrowLeft || app.inputs.KeyA){
      actions.push('turnLeft');
    }
    if(this.inputs.ArrowRight || app.inputs.KeyD){
      actions.push('turnRight');
    }
    //!NEED EVERY DETAIL HERE
    if(actions.every((val, index) => val === this.lastActions[index]) && actions.length > 0){
      this.send({move : actions});
    }
    app.lastActions = actions;
  },
}