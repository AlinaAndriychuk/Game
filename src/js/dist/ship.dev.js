"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var PIXI = _interopRequireWildcard(require("pixi.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Ship =
/*#__PURE__*/
function () {
  function Ship(x, y) {
    _classCallCheck(this, Ship);

    this.figure = new PIXI.Graphics();
    this.figure.lineStyle(2, 0xffffff);
    this.fire = new PIXI.Graphics();
    this.fire.lineStyle(1.5, 0xffffff);
    this.hideFire = true;
    this.figurePoint = new PIXI.Graphics();
    this.x = x || 0;
    this.y = y || 0;
    this.power = 5;
    this.height = 52;
    this.width = 28;
    this.draw();
  }

  _createClass(Ship, [{
    key: "rotate",
    value: function rotate(friction, vr) {
      if (friction < 0) {
        window.cancelAnimationFrame(this.rotateRAF);
        this.isRotating = false;
        return;
      }

      if (this.figure.angle >= 360 || this.figure.angle <= -360) {
        this.figure.angle = 0;
      }

      this.isRotating = true;
      this.figure.angle += vr;
      this.rotateRAF = window.requestAnimationFrame(this.rotate.bind(this, friction - 1, vr));
    }
  }, {
    key: "countDirection",
    value: function countDirection() {
      var dx = this.figurePoint.getGlobalPosition().x - this.figure.x;
      var dy = this.figurePoint.getGlobalPosition().y - this.figure.y; // interaction

      var angle = Math.atan2(dy, dx);
      var tx = this.figure.x + Math.cos(angle);
      var ty = this.figure.y + Math.sin(angle);
      this.vx = (tx - this.figure.x) * this.power;
      this.vy = (ty - this.figure.y) * this.power;
    }
  }, {
    key: "move",
    value: function move(friction, v, width, height) {
      if (friction < 0) {
        window.cancelAnimationFrame(this.moveRAF);
        this.isMoving = false;
        this.switchFire(true);
        return;
      }

      this.isMoving = true;
      this.switchFire();
      this.think(width, height);
      this.countDirection();
      this.figure.x += this.vx;
      this.figure.y += this.vy;
      this.moveRAF = window.requestAnimationFrame(this.move.bind(this, friction - 1, v, width, height));
    }
  }, {
    key: "switchFire",
    value: function switchFire(hide) {
      var value = hide || !this.hideFire;

      if (value) {
        this.figure.removeChild(this.fire);
      } else {
        this.figure.addChild(this.fire);
      }
    }
  }, {
    key: "think",
    value: function think(width, height) {
      var x = this.figure.x;
      var y = this.figure.y;

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
  }, {
    key: "scale",
    value: function scale(coefficient) {
      this.figure.scale.set(coefficient);
    }
  }, {
    key: "draw",
    value: function draw() {
      this.figure.drawPolygon([0, 46, 14, 0, 28, 46, 25, 37, 3, 37]);
      this.figure.endFill();
      this.figure.pivot.set(this.width / 2, this.height / 2);
      this.figure.y = this.y;
      this.figure.x = this.x;
      this.fire.drawPolygon([20, 37, 14, 52, 8, 37]);
      this.fire.endFill();
      this.figurePoint.drawCircle(0, 0, 0);
      this.figurePoint.endFill();
      this.figurePoint.x = this.width / 2;
      this.figure.addChild(this.figurePoint);
    }
  }]);

  return Ship;
}();

exports["default"] = Ship;
