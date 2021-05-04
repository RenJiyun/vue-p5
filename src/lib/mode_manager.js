import Mode from "./mode";

let _p5;
let _modeStack = [];

/**
 * 安装模式
 *
 * 模式其实就是对应p5.js中定义的一组事件处理函数，例如鼠标点击事件处理函数等
 *
 * @param {*} mode
 */
function _install(mode, proto) {
  for (let key in proto) {
    if (typeof mode[key] == "function") {
      _p5[key] = mode[key];
    }
  }
}

function init(p5) {
  _p5 = p5;
}

function push(mode) {
  if (Object.getPrototypeOf(mode) === Mode) {
    _modeStack.push(mode);
    _install(mode, Object.getPrototypeOf(mode));
  }
}

function pop() {}

export { init, push, pop };
