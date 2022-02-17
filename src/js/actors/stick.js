import * as PIXI from 'pixi.js';
import Rectangle from "../geometricPrimitives/rectangle";

export default class Stick extends Rectangle {
  constructor(x, y, centerX, centerY, angle) {
    super(x, y, 30, 2, angle);

    this.centerX = centerX || 0;
    this.centerY = centerY || 0;

    this.friction = 0.07;
    this.power = 15;
    this.countDirection();
  }

  countDirection() {
    const dx = this.x - this.centerX;
    const dy = this.y - this.centerY;

      // interaction
    const angle = Math.atan2(dy, dx);
    const tx = this.x + Math.cos(angle);
    const ty = this.y + Math.sin(angle);

    this.vx = (tx - this.x) * this.power * this.friction;
    this.vy = (ty - this.y) * this.power * this.friction;
  }

  move() {
    this.figure.x += this.vx;
    this.figure.y += this.vy;
  }

}
