import { abs, prodDependencies, re } from "mathjs";

/**
 * 检查坐标是否在指定的长方形区域内
 *
 * @param {*} c
 * @param {*} ra
 */
function within(c, ra) {
  let [x, y, w, h] = ra;
  let result =  (
    x - w / 2 <= c[0] &&
    c[0] <= x + w / 2 &&
    y - h / 2 <= c[1] &&
    c[1] <= y + h / 2
  );
  return result
}

/**
 * 检查坐标在长方形的哪个位置
 *
 * 位置有：
 * left left-top top right-top right right-bottom bottom left-bottom within out
 *
 * @param {*} c
 * @param {*} ra
 * @param {*} precision
 */
function position(c, ra, precision) {
  let [x, y, w, h] = ra;
  let checkRects = [
    // left
    [x - w / 2, y, 2 * precision, h - 4 * precision],
    // left-top
    [x - w / 2, y - h / 2, 2 * precision, 2 * precision],
    // top
    [x, y - h / 2, w - 4 * precision, 2 * precision],
    // rigit-top
    [x + w / 2, y - h / 2, 2 * precision, 2 * precision],
    // right
    [x + w / 2, y, 2 * precision, h - 4 * precision],
    // right-bottom
    [x + w / 2, y + h / 2, 2 * precision, 2 * precision],
    // bottom
    [x, y + h / 2, w - 4 * precision, 2 * precision],
    // left-bottom
    [x - w / 2, y - h / 2, 2 * precision, 2 * precision],
    // inner
    [x, y, w - 4 * precision, h - 4 * precision],
  ];
  return checkRects.map((r) => within(c, r));
}

export { within, position };
