import entityFactory from "./EntityFactory.mjs";

export default function world() {
  return {
    world: [],
    countId: 0,
    actionsBuffer:[],

    init: () => {

    },
    updateWorld: () => {
      console.log('updateWorld');
    },
  }
}
