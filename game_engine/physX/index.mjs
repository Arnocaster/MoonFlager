export default class physicEngine {
  constructor(PhysX){
    this.init(PhysX);
  }
  async init(PhysX) {
    this.physx = await PhysX();
    console.log(this.physx);
  }

}