export default class physicEngine {
  constructor(PhysX){
    this.gravity = '9.1 || 1.6';
    this.init(PhysX);
  }
  async init(PhysX) {
    this.physx = await PhysX();
    console.log(this.physx);
  }

  create(){
    //Add an element to physic simulation
  }

  destroy(){
    //Delete an element from physic simulation;
  }

  update(){
    //Apply action to physic engine;
    //return world;
  }

  shutdown(){
    //Destroy all physics elements
  }

}