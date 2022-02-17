import * as PIXI from 'pixi.js';
import Polygon from "../geometricPrimitives/polygon";

export default class Asteroid {
  constructor(x, y, vx, vy, size) {
    this.figure = null;

    this.x = x || 0;
    this.y = y || 0;
    this.vx = vx || 0;
    this.vy = vy || 0;
    this.size = size;

    this.width = 100;
    this.draw();
  }

  think(width, height) {
    const {x} = this;
    const {y} = this;

    if (x > width) {
      this.x = -this.width;
    } else if (x + this.width < 0) {
      this.x = width;
    }

    if (y > height) {
      this.y = -this.width;
    } else if (y + this.width < 0) {
      this.y = height;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  scale(coefficient) {
    this.figure.scale.set(coefficient / this.size);
  }

  move() {
    this.figure.x = this.x;
    this.figure.y = this.y;
  }

  draw() {
    this.figure = new Polygon(0, 0, [
      0, 25,
      37, 25,
      27, 3,
      60, 0,
      100, 25,
      100, 35,
      52, 48,
      100, 68,
      77, 97,
      56, 82,
      20, 100,
      0, 60
    ]).figure;

    this.move()
  }
}
