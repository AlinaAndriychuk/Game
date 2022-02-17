import * as PIXI from 'pixi.js';
import { contain } from 'intrinsic-scale';
import sayHello from './lib/sayHello';
import Asteroid from './actors/asteroid';
import Ship from './actors/ship';
import Shot from './actors/shot';
import Stick from './actors/stick';

class Controls {
  constructor({container, score, restart}) {
    this.canvasContainer = container;
    this.width = this.canvasContainer.clientWidth;
    this.height = this.canvasContainer.clientHeight;
    this.asteroids = [];
    this.shots = [];
    this.points = [];
    this.sticks = [];
    this.asteroidsLimit = 10;
    this.hitPoints = [];
    this.numberOfhitPoints = 3;
    this.scoreNumber = 0;

    this.score = score;
    this.restart = restart;

    this.canvas = new PIXI.Application({
      width: this.width,
      height: this.height,
      autoResize: true,
      autoStart: true,
      antialias: true,
    });

    this.container = new PIXI.Container();
    this.init()
  }

  init() {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener('keydown', this.manageShip.bind(this));
    this.restart.addEventListener('click', this.generateGraphics.bind(this));

    this.canvasContainer.appendChild(this.canvas.view);

    const rect = new PIXI.Graphics();
    rect.drawRect(0, 0, 1000, 700);
    this.container.addChild(rect);

    this.containerWidth = this.container.width;
    this.containerHeight = this.container.height;

    this.generateGraphics();

    this.render();
  }

  generateGraphics() {
    this.reset();
    this.canvas.stage.addChild(this.container);

    for (let i = 0; i < this.asteroidsLimit; i++) {
      const asteroid = new Asteroid(
        this.randomInteger(0, this.width),
        this.randomInteger(0, this.height),
        this.randomVector(),
        this.randomVector(),
        this.randomInteger(1, 3),
      );

      this.canvas.stage.addChild(asteroid.figure);
      this.asteroids.push(asteroid);
    }

    this.ship = new Ship(this.width / 2, this.height / 2);
    this.canvas.stage.addChild(this.ship.figure);

    this.setHitPoints();
    this.resize();
  }

  setHitPoints() {
    const interval = 20;
    const left = 180;
    for (let i = 0; i < this.numberOfhitPoints; i++) {

      const hitPoint = new Ship(left + i * (this.ship.width + interval), this.ship.height);
      this.canvas.stage.addChild(hitPoint.figure);
      this.hitPoints.push(hitPoint);
    }
  }

  subtractHitPoint() {
    this.canvas.stage.removeChild(this.hitPoints[this.hitPoints.length - 1].figure)
    this.hitPoints.pop();
    this.ship = null;
    this.createShip = true;

    if(this.hitPoints.length === 0) {
      this.score.classList.add('full');
      this.restart.classList.add('full');
      this.createShip = false;
    } else {
      setTimeout( () => {
        if (this.createShip) {
          this.ship = new Ship(this.width / 2, this.height / 2);
          this.canvas.stage.addChild(this.ship.figure);
        }
      }, 1000)
    }
  }

  reset() {
    this.canvas.stage.removeChildren();
    this.asteroids = [];
    this.shots = [];
    this.points = [];
    this.stick = [];
    this.hitPoints = [];
    this.scoreNumber = 0;

    this.addScore(0);
    this.score.classList.remove('full');
    this.restart.classList.remove('full');
  }

  randomInteger(min, max) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    this.rand = Math.round(rand);
    return Math.round(rand);
  }

  randomVector() {
    const min = 0;
    const max = 1;
    const power = 2;
    const rand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
    this.rand = rand;

    if(rand === 1) {
      return Math.random() * power;
    }
    return -Math.random() * power;
  }

  manageShip(event) {
    if (!this.ship) return;
    if (event.code === 'ArrowUp' && !this.ship.isMoving) {
      this.ship.move(10, 2, this.width, this.height);
    }
    if (event.code === 'ArrowLeft' && !this.ship.isRotating) {
      this.ship.rotate(10, -4)
    }
    if (event.code === 'ArrowRight' && !this.ship.isRotating) {
      this.ship.rotate(10, 4)
    }
    if (event.code === 'Space' && !this.ship.isRotating) {
      const shot = new Shot(
        this.ship.figurePoint.getGlobalPosition().x,
        this.ship.figurePoint.getGlobalPosition().y,
        this.ship.figure.x,
        this.ship.figure.y
      );

      this.canvas.stage.addChild(shot.figure);
      this.shots.push(shot);
    }
  }

  shipCollision(asteroid, index) {
    this.defineAsteroid(asteroid, index);
    this.brokeShip(this.ship.figure.x, this.ship.figure.y)
    this.boom(asteroid.x, asteroid.y)
    this.canvas.stage.removeChild(this.ship.figure);
    this.subtractHitPoint();
  }

  defineAsteroid(asteroid, index) {
    if(asteroid.size === 3) {
      this.removeGraphics(asteroid, this.asteroids);

      if(this.asteroids.length < this.asteroidsLimit) {
        this.addBigAsteroid();
      }

      this.addScore(100);
    } else if (asteroid.size === 2) {
      this.splitAsteroid(asteroid, index);
      this.addScore(50);
    } else {
      this.splitAsteroid(asteroid, index);
      this.addScore(20);
    }
  }

  splitAsteroid(asteroid, index) {
    const asteroidOne = new Asteroid(
      asteroid.x,
      asteroid.y,
      this.randomVector(),
      this.randomVector(),
      asteroid.size + 1,
    );
    const asteroidTwo = new Asteroid(
      asteroid.x,
      asteroid.y,
      this.randomVector(),
      this.randomVector(),
      asteroid.size + 1,
    );
    this.canvas.stage.removeChild(asteroid.figure);
    this.canvas.stage.addChild(asteroidOne.figure);
    this.canvas.stage.addChild(asteroidTwo.figure);
    this.asteroids.splice(index, 1, asteroidOne, asteroidTwo);

    this.resize();
  }

  addBigAsteroid() {
    const asteroid = new Asteroid(
      this.randomInteger(0, this.width),
      this.height,
      this.randomVector(),
      this.randomVector(),
      1,
    );

    this.canvas.stage.addChild(asteroid.figure);
    this.asteroids.push(asteroid)
    this.resize()
  }

  brokeShip(x, y) {
    const number = 3;

    for (let i = 0; i < number; i++) {
      const stick = new Stick(
        x,
        y,
        this.randomVector() + x,
        this.randomVector() + y,
        this.randomInteger(0, 360),
      );

      this.canvas.stage.addChild(stick.figure);
      this.sticks.push(stick);

      setTimeout(()=> this.removeGraphics(stick, this.sticks), 600)
    }
  }

  boom(x, y) {
    const number = 5;
    const friction = 0.1;

    for (let i = 0; i < number; i++) {
      const point = new Shot(
        x,
        y,
        this.randomVector() + x,
        this.randomVector() + y,
        friction,
      );

      this.canvas.stage.addChild(point.figure);
      this.points.push(point);

      setTimeout(()=> this.removeGraphics(point, this.points), 600)
    }
  }

  addScore(number) {
    this.scoreNumber += number
    this.score.innerText = this.scoreNumber;
  }

  removeGraphics(elem, arr) {
    this.canvas.stage.removeChild(elem.figure);
    arr.splice(arr.indexOf(elem), 1);
  }

  render() {
    window.requestAnimationFrame(this.render.bind(this));

    this.asteroids.forEach( (asteroid, index) => {
      asteroid.think(this.width, this.height);
      asteroid.move();
      if (this.ship && this.hitTestRectangle(asteroid.figure, this.ship.figure)) {
        this.shipCollision(asteroid, index)
      }
    });

    this.shots.forEach( (shot) => {
      shot.move();

      if(shot.hidden(this.width, this.height)) {
        this.removeGraphics(shot, this.shots);
      }

      this.asteroids.forEach( (asteroid, indexOfAsteroid) => {
        if (this.canvas.stage.children.includes(shot.figure) && this.hitTestRectangle(asteroid.figure, shot.figure)) {
          this.defineAsteroid(asteroid, indexOfAsteroid);
          this.boom(asteroid.x, asteroid.y);
          this.canvas.stage.removeChild(shot.figure)
        }
      });
    });

    this.points.forEach( point => {
      point.move();
    });

    this.sticks.forEach( stick => {
      stick.move();
    });
  }

  hitTestRectangle(rect1, rect2) {

    const r1 = rect1;
    const r2 = rect2;

    this.hit = false;

    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    const vx = r1.centerX - r2.centerX;
    const vy = r1.centerY - r2.centerY;

    const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {

      if (Math.abs(vy) < combinedHalfHeights) {
        this.hit = true;
      } else {
        this.hit = false;
      }
    } else {
      this.hit = false;
    }

    return this.hit;
  };

  resizeContainer() {
    const { width, height, x, y } = contain(this.width, this.height, this.containerWidth, this.containerHeight);
    this.container.width = width;
    this.container.height = height;
    this.container.position.set(x, y);

    const proportionalContainerWidth = this.container.width / this.containerWidth;
    const coefficient = Math.max(proportionalContainerWidth, 0.1);

    this.asteroids.forEach( asteroid => {
      asteroid.scale(coefficient);
    })

    this.shots.forEach( shot => {
      shot.scale(coefficient);
    })

    if (this.ship) {
      this.ship.scale(coefficient)
    }
  }

  resize() {
    this.width = this.canvasContainer.clientWidth;
    this.height = this.canvasContainer.clientHeight;
    this.canvas.renderer.resize(this.width, this.height);
    this.resizeContainer();
  }
}

const container = document.querySelector('.js-container');
const score = document.querySelector('.js-score');
const restart = document.querySelector('.js-restart');

const controls = new Controls({container, score, restart});

sayHello();
