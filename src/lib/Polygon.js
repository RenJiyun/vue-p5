import Mobj from "./Mobj";

class D_Polygon extends Polygon {}

class A_Polygon extends Polygon {}

class C_Polygon extends Polygon {}

class Polygon extends Mobj {
  constructor(vertexes, econfig) {
    super({}, {}, econfig);
    this._vertexes = vertexes;

    this._currentMode = undefined;
  }

  _default(canvas, env, done) {
    this._configCanvas(canvas);
    canvas.beginShape();
    this._vertexes.forEach((v) => {
      canvas.vertex(...this.toNativeCoord(v));
    });
    canvas.vertex(...this.toNativeCoord(this._vertexes[0]));
    canvas.endShape();
    done(true);
  }

  _m_create_0(canvas, env, done) {
    if (this._vertexes.length <= 0) {
      done(true);
      return;
    }
    this._p5config.fill[3] = 150;
    this._configCanvas(canvas);
    canvas.beginShape();
    for (let i = 0; i < this._vertexes.length; i++) {
      canvas.vertex(...this.toNativeCoord(this._vertexes[i]));
    }
    if (this._cm) {
      canvas.vertex(...this.toNativeCoord(this._cm));
    }
    canvas.endShape();
    done(true);
  }

  _m_create_1(canvas, env, done) {
    if (this._vertexes.length <= 0) {
      done(true);
      return;
    }
    this._p5config.fill[3] = 255;
    this._configCanvas(canvas);
    let pr = 0.2;
    this._vertexes.forEach((v) => {
      canvas.circle(...this.toNativeCoord(v), this.toNativeLength(pr * 2));
    });
    done(true);
  }

  // _create_0(canvas, deltaTime) {
  //   if (!this._done) {
  //     canvas.noFill();
  //     canvas.stroke(255);

  //     this.current += deltaTime;
  //     this.current = Math.min(this.current, this.duration);

  //     if (this.current >= this.duration) {
  //       this._done = true;
  //     }

  //     let progress = this.current / this.duration;
  //     let currentLength =
  //       canvas.map(this.current, 0, this.duration, 0, this.length) *
  //       this.easing(progress);

  //     canvas.beginShape();
  //     for (let i = 0; i < this.vertexes.length - 1; i++) {
  //       let sv = this.vertexes[i];
  //       let ev = this.vertexes[i + 1];
  //       canvas.vertex(...this.coord.toSceneCoord(sv));
  //       let edge = ev.sub(sv);
  //       if (currentLength > edge.abs()) {
  //         currentLength -= edge.abs();
  //         // TODO 精度问题：剩余的currentLength有可能比最后一条边长还大，此时continue会使得循环退出，从而最后一条边消失
  //         continue;
  //       } else {
  //         let ratio = currentLength / edge.abs();
  //         let cc = sv.add($math.multiply(edge, ratio));
  //         canvas.vertex(...this.coord.toSceneCoord(cc));
  //         break;
  //       }
  //     }

  //     // 用于修复上述的精度问题
  //     if (this._done) {
  //       canvas.vertex(...this.coord.toSceneCoord(this.vertexes[0]));
  //     }
  //     canvas.endShape();
  //   }
  // }

  get _layerNum() {
    return 1;
  }

  _execPlan() {
    return this._execNode(this._default, 0);
  }

  mouseClicked(e, scene) {
    let cp = this.toSceneCoord([e.sceneX, e.sceneY]);
    if (this._vertexes.length >= 2) {
      let v0 = this._vertexes[0];
      let dist = distance(v0.toVector(), cp.toVector());
      if (dist <= 0.5) {
        M_CREATE.publishMobj(new Polygon(this._vertexes, _econfig), scene);
        return;
      }
    }
    this._vertexes.push(cp);
    scene.refresh();
    this._reset();
  }

  mouseMoved(e, scene) {
    if (this._vertexes.length > 0) {
      let cp = this.toSceneCoord([e.sceneX, e.sceneY]);
      this._cm = cp;
      scene.refresh();
      this._reset();
    }
  }
}

export default Polygon;
