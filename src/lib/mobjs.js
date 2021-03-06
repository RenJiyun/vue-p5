import { complex } from "mathjs";
import Function from "./Function";
import Circle from "./Circle";
import Polyline from "./Polyline";
import Line from "./Line";
import Segment from "./Segment";
import Inversion from "./Inversion";

let _p5;
let _coord;
let _econfig;

function init(p5, coord) {
  _p5 = p5;
  _coord = coord;

  if (_p5 == undefined) {
    throw Error("p5 is undefined");
  }

  if (_coord == undefined) {
    throw Error("coord is undefined");
  }

  _econfig = {
    p5: _p5,
    coord: _coord,
  };
}

function f(fn) {
  return new Function(fn, _econfig);
}

function circle(O, r) {
  if (O instanceof Array) {
    O = complex(...O);
  }
  return new Circle(O, r, _econfig);
}

function polygon(vertexes) {
  vertexes.push(vertexes[0]);
  return polyline(vertexes);
}

function polyline(vertexes) {
  if (vertexes[0] instanceof Array) {
    for (let i = 0; i < vertexes.length; i++) {
      vertexes[i] = complex(vertexes[i][0], vertexes[i][1]);
    }
  }
  return new Polyline(vertexes, _econfig);
}

function square(O, a) {
  if (O instanceof Array) {
    O = complex(...O);
  }

  let ha = a / 2;
  let vertexes = [
    O.add(complex(-ha, ha)),
    O.add(complex(-ha, -ha)),
    O.add(complex(ha, -ha)),
    O.add(complex(ha, ha)),
  ];
  return polygon(vertexes);
}

function triangle(vertexes) {
  if (vertexes.length != 3) {
    throw new Error("a triangle must have 3 vertexes");
  }
  return polygon(vertexes);
}

function line() {}

function segment(P0, P1) {
  if (P0 instanceof Array) {
    P0 = complex(...P0);
    P1 = complex(...P1);
  }
  return new Segment(P0, P1, _econfig)
    .stroke([50, 50, 50, 255])
    .strokeWeight(2);
}

function ellipse() {}

function angle() {}

function parallel() {}

function v() {}

function vf() {}

function arc() {}

function inversion(circle, mobj) {
  return new Inversion(circle._O, circle._r, mobj, _econfig);
}

export {
  init,
  f,
  circle,
  polyline,
  polygon,
  square,
  triangle,
  line,
  segment,
  ellipse,
  angle,
  parallel,
  v,
  vf,
  arc,
  inversion
};
