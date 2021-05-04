import { abs, distance } from "mathjs";
import Mobj from "./Mobj";

// class D_Segment extends Segment {
//   constructor(P0, P1) {
//     super(...arguments);
//     this._P0 = P0;
//     this._P1 = P1;
//   }

//   _draw_0(canvas, env, done) {
//     this._configCanvas(canvas);
//     canvas.line(
//       ...this.toNativeCoord(this._P0),
//       ...this.toNativeCoord(this._P1)
//     );
//     done(true);
//   }

//   get _layerNum() {
//     return 1;
//   }

//   _execPlan() {
//     return this._execNode(this._default, 0);
//   }

//   mouseClicked(e, scene) {
//     let cp = this.toSceneCoord([e.sceneX, e.sceneY]);
//     let [p0, p1] = [this._P0, this._P1];
//     let arg0 = cp.sub(p0).arg();
//     let arg1 = p1.sub(cp).arg();
//     if (abs(arg0 - arg1) <= 0.1) {
//       if (this._focus) {
//         return;
//       }
//       this._focus = true;
//       this.strokeWeight(this.strokeWeight() + 2)._reset();
//       this._reset();
//       scene.refresh();
//     } else if (this._focus) {
//       this._focus = false;
//       this.strokeWeight(this.strokeWeight() - 2)._reset();
//       scene.refresh();
//     }
//   }

//   mousePressed(e) {
//     let cp = this.toSceneCoord([e.sceneX, e.sceneY]);
//     let [p0, p1] = [this._P0, this._P1];
//     let d0 = distance(cp.toVector(), p0.toVector());
//     if (d0 <= 0.3) {
//       this._P0_focus = true;
//       return;
//     }

//     let d1 = distance(cp.toVector(), p1.toVector());
//     if (d1 <= 0.3) {
//       this._P1_focus = true;
//       return;
//     }
//   }

//   mouseReleased(e, scene) {
//     this._P0_focus = false;
//     this._P1_focus = false;
//   }

//   mouseDragged(e, scene) {
//     if (this._P0_focus || this._P1_focus) {
//       let cp = this.toSceneCoord([e.sceneX, e.sceneY]);
//       if (this._P0_focus) {
//         this._P0 = cp;
//       } else if (this._P1_focus) {
//         this._P1 = cp;
//       }
//       this._reset();
//       scene.refresh();
//     }
//   }
// }

// class A_Segment extends Segment {}

// class C_Segment extends Segment {}

class Segment extends Mobj {
  constructor(econfig) {
    super({}, {}, econfig);
  }
}

export default Segment;
