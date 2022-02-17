import Circle from "../geometricPrimitives/circle";

export default class Shot extends Circle {

  constructor(x, y, centerX, centerY, friction) {
    super(x, y, 2.5)

    this.centerX = centerX || 0;
    this.centerY = centerY || 0;

    this.friction = friction || 1;
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

  hidden(width, height) {
    const {x} = this.figure;
    const {y} = this.figure
    if (x > width || x + this.radius < 0 || y > height || y + this.radius < 0) {
      return true;
    }
    return false;
  }

  move() {
    this.figure.x += this.vx;
    this.figure.y += this.vy;
  }
}
