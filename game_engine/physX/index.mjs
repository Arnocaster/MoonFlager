export default async function physicEngine(PhysX) {
  const gravity = '9.1 || 1.6';

    const init = async (PhysX) => {   
      const physx = await PhysX();
      return physx;
     
    }
    const physx = await init(PhysX);
    const version = physx.PxTopLevelFunctions.prototype.PHYSICS_VERSION;
    const allocator = new physx.PxDefaultAllocator();
    const errorCb = new physx.PxDefaultErrorCallback();
    const foundation = physx.PxTopLevelFunctions.prototype.CreateFoundation(version,allocator, errorCb);
    //console.log('Created PxFoundation',this.version);

    const tolerances = new physx.PxTolerancesScale();
    const physics = physx.PxTopLevelFunctions.prototype.CreatePhysics(version, foundation, tolerances);
    //console.log('Created PxPhysics');

    // create scene
    const sceneVec = new physx.PxVec3(0, -9.81, 0);
    const sceneDesc = new physx.PxSceneDesc(tolerances);
    sceneDesc.set_gravity(sceneVec);
    sceneDesc.set_cpuDispatcher(physx.PxTopLevelFunctions.prototype.DefaultCpuDispatcherCreate(0));
    sceneDesc.set_filterShader(physx.PxTopLevelFunctions.prototype.DefaultFilterShader());
    const scene = physics.createScene(sceneDesc);
    //console.log('Created scene');
    console.log("physX ready");
    return {
      create : (entity) => {
        console.log(entity,scene);
        //Add an element to physic simulation
        //Obj mandatory propreties : 
        //material : {x,y,z}
        //shape : { 
                    // type : "static"||"dynamic"; 
                    // shape:"box","sphere", "custom||file"
                    // size : {x,y,z}
        //          }
    
      },
    
      destroy : ()=> {
        //Delete an element from physic simulation;
      },
    
      update : ()=> {
        //Apply action to physic engine;
        //return world;
      },
    
      shutdown : ()=> {
        //Destroy all physics elements
      },

    }
}