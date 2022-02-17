import * as PIXI from 'pixi.js';
import Polygon from "../geometricPrimitives/polygon";
import Circle from "../geometricPrimitives/circle";

export default class Ship {
  constructor(x, y) {
    this.figure = null;
    this.fire = null
    this.figurePoint = null;

    this.hideFire = true;

    this.x = x || 0;
    this.y = y || 0;

    this.power = 5;

    this.height = 52;
    this.width = 28;

    this.draw();
  }

  rotate(friction, vr) {
    if(friction < 0) {
      window.cancelAnimationFrame(this.rotateRAF);
      this.isRotating = false;
      return;
    }

    if(this.figure.angle >= 360 || this.figure.angle <= -360) {
      this.figure.angle = 0
    }

    this.isRotating = true;
    this.figure.angle += vr;

    this.rotateRAF = window.requestAnimationFrame(this.rotate.bind(this, friction - 1, vr))
  }

  countDirection() {
    const dx = this.figurePoint.getGlobalPosition().x - this.figure.x;
    const dy = this.figurePoint.getGlobalPosition().y - this.figure.y;

    // interaction
    const angle = Math.atan2(dy, dx);
    const tx = this.figure.x + Math.cos(angle);
    const ty = this.figure.y + Math.sin(angle);

    this.vx = (tx - this.figure.x) * this.power;
    this.vy = (ty - this.figure.y) * this.power;
  }

  move(friction, v, width, height) {
    if(friction < 0) {
      window.cancelAnimationFrame(this.moveRAF)
      this.isMoving = false;
      this.switchFire(true)
      return;
    }

    this.isMoving = true;
    this.switchFire();
    this.think(width, height);
    this.countDirection();
    this.figure.x += this.vx;
    this.figure.y += this.vy;

    this.moveRAF = window.requestAnimationFrame(this.move.bind(this, friction - 1, v, width, height))
  }

  switchFire(hide) {
    const value = hide || !this.hideFire;

    if(value) {
      this.figure.removeChild(this.fire)
    } else {
      this.figure.addChild(this.fire)
    }
  }

  think(width, height) {
    const {x} = this.figure;
    const {y} = this.figure;

    if (x > width) {
      this.figure.x = -this.width;
    } else if (x + this.width < 0) {
      this.figure.x = width;
    }

    if (y > height) {
      this.figure.y = -this.width;
    } else if (y + this.width < 0) {
      this.figure.y = height;
    }
  }

  scale(coefficient) {
    this.figure.scale.set(coefficient);
  }

  draw() {
    this.figure = new Polygon(0, 0, [
      0, 46,
      14, 0,
      28, 46,
      25, 37,
      3, 37
    ]).figure;
    this.figure.pivot.set(this.width / 2, this.height / 2);
    this.figure.y = this.y;
    this.figure.x = this.x;

    this.fire = new Polygon(0, 0, [
      20, 37,
      14, 52,
      8, 37
    ]).figure;

    this.figurePoint = new Circle(0, 0, 0).figure;
    this.figurePoint.x = this.width / 2;
    this.figure.addChild(this.figurePoint);
  }
}
