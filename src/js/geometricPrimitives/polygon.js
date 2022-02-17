import Figure from "./figure";

export default class Polygon extends Figure {

  constructor(x, y, coordinates) {
    super(x, y);
    this.coordinates = coordinates;
    this.draw();
  }

  draw() {
    super.draw();
    this.figure.lineStyle(2, 0xffffff);
    this.figure.drawPolygon(this.coordinates);
    this.figure.endFill();
  }

}
