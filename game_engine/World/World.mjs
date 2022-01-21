import { Player } from "../index.mjs";

export default class World {
  constructor() {
    this.players = [];

    this.settings = {
      width: 400,
      height: 400,
      refreshRate: 15,
    }
    this.init();
  }

  init() {
    this.updateWorld();
  }

  async updateWorld() {
    setTimeout(() => { this.updateWorld() }, this.settings.refreshRate);
  }

  findPlayerById(id, array) {
    if (array) {
      return array.find(player => player.id === id);
    }
    return this.players.find(player => player.id === id);
  }

  addPlayer(id) {
    this.players.push(new Player(id));
  }

  removePlayer(id) {
    const players = this.players;
    players.splice(players.findIndex(player => player.id === id), 1);
  }


}