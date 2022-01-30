 - MOVE : vitesse*temps touche pressée
 - Entity : need to add a position buffer in each entity

UPDATE
 CLIENT :
 processServerMessage (get server newWorld);
 processInput
 interpolateEntitites
 render

 SERVER
 processInputs
 sendWorld
 render????? => nope it's only for this selfhosted example





ProcessInputs
  CLIENT
    ts = timestamp
    let now_ts = +new Date();
    let last_ts = this..last_ts || now_ts
    var delta_sec = (now_ts - last_ts)/1000;
    this.last_ts = now_ts;

    Wrap input with timestamp
    raw_input = {duration : dt_sec,value:raw_input}

    send input to server
    Bythetime aplying to itself in local world

    save input for reconciliation

  SERVER
    read all pending inputs from clients
    inputs.forEach(input=>{
      checkIF input is ok (>25ms 40inputs/sec);
      input.entityID.applyInput();
      store id & seq numb in lastInput[id];

    });


Send server message {
  world_state = [];
  entities.foreach(entity=>{
    world_state.push({entity_id,position,entity.lastinput});
  });

  send (world_state);
}


Process server message (connection/deconnection here) :
state = list of all entity
  receivedEntityStatesfromserver.forEach(state =>{
    
    If (!state.thisEntity){
      create new entity
      give id and socket
      add to world
    }

    ME!!
    if (state.thisEntity === localEntity){
        force position :  localEntity.pos = state.thisEntity.pos
        reading all waiingtoprocess input 
        inputsWaiting.foreach(input =>{
          if (input.squencenumber <= state.lastInputprocessed){
            inputsWaiting.splice(thisinputindex,1);
          } else {
            apply input;
          }

        });



    } else {
    NOT ME!!
    entity.position_buffer.push(timestampNow,state.pos);
    }

  })

  InterPolate {
    const now = Date.now();
    const render_ts = now - (1000/server.refreshrate); ==>?Le serveur communique son update_rate?

    entities.forEach(thisEntity =>{

      if(thisEntity === mySocket){
        //Skip myself
        continue;
      }
      
      get all positions to render
      got the entity_position_buffer

      if (buffer.length >2 && buffer[1][0]??? <= render_ts);
        buffer.shift() => Delete frame
      }

      if (buffer >= 2 && buffer[0][0] <= render_ts && render_ts <= buffer[1][0]>){
        const x0 = buffer[0][1];
        const y0 = buffer y0
        const x1 = buffer
        const y1 = buffer
        const t0 = buffer
        const t1 = buffer

        entity.x = x0 + (x1-x0) * (render_ts - t0) / (t1 - t0);
        entity.y = same with y
      }


    });
  }

