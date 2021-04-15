import SceneObj from "./SceneObj";

class Mode extends SceneObj {
  constructor() {
    super({}, {}, {});

    this._done = true;
  }

  keyPressed(e) {
  }
}

export default Mode;

/**
 * alt作为模式选择的先导键
 * 目前支持的模式有两种：
 * 1. 移动模式 m
 * 2. 创建模式 c
 *
 * 无论哪种模式，都需要判断当前鼠标是否位于某个对象上，从而在创建后，
 * 可以建立对象之间的关系
 *
 * space作为创建模式下对象选择的先导键
 * 目前可以支持的对象有：
 * 1. 点 p
 * 2. 直线 l
 * 3. 线段 s
 * 4. 圆 c
 * 5. 三角形 t
 * 6. 长方形 r
 * 7. 正方形 sq
 * 8. 多边形 po
 * 10. 平移变换 tr
 * 11. 旋转变换 ro
 * 12. 对称变换 re
 * 13. 反演变换 in
 */
//    keyPressed(e) {
//     mode("c")
//       .create("p").wait(mouseClicked, 1).done()
//       .create("l").wait(mouseClicked, 1).done()
//       .create("c").wait(mouseClicked, 2).done()
//       .create("t").wait(mouseClicked, 3).done()
//       .create("r").wait(mouseClicked, 2).done()
//       .create("sq").wait(mouseClicked, 2).done()
//       .create("po").wait("自定义事件").done()
//     .done()
//     .mode("m")
//   }
