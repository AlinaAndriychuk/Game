import * as PIXI from 'pixi.js';

export default class Figure {
  constructor(x, y) {
    this.figure = new PIXI.Graphics();

    this.x = x || 0;
    this.y = y || 0;
  }

  draw() {
    this.figure.x = this.x;
    this.figure.y = this.y;
  }

  scale(coefficient) {
    this.figure.scale.set(coefficient);
  }

  move(x, y) {
    this.figure.x = x;
    this.figure.y = y;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

}
