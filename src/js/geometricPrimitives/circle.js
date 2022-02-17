import Figure from "./figure";

export default class Circle extends Figure {

  constructor(x, y, radius) {
    super(x, y);
    this.radius = radius;
    this.draw();
  }

  draw() {
    super.draw();
    this.figure.beginFill(0xfffffff);
    this.figure.drawCircle(0, 0, this.radius);
    this.figure.endFill();
  }

}
