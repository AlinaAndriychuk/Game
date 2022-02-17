import Figure from "./figure";

export default class Rectangle extends Figure {

  constructor(x, y, width, height, angle) {
    super(x, y);
    this.width = width;
    this.height = height
    this.angle = angle;
    this.draw();
  }

  draw() {
    super.draw();
    this.figure.beginFill(0xfffffff);
    this.figure.drawRect(0, 0, this.width, this.height);
    this.figure.endFill();
    this.figure.angle = this.angle;
  }

}
