/**
 * 事件的订阅者
 */
let _ess = {};

/**
 * 发布事件
 *
 * @param {*} eventName 事件名称
 * @param {*} event 事件对象
 */
function publish(eventName, event) {
  if (_ess[eventName] != undefined) {
    _ess[eventName].forEach((cb) => cb(event));
  }
}

/**
 * 订阅事件
 *
 * @param {*} eventName
 * @param {*} cb 事件回调函数
 */

function subscribe(eventName, cb) {
  if (_ess[eventName] == undefined) {
    {
      _ess[eventName] = [];
    }
  }
  _ess[eventName].push(cb);
}

export { publish, subscribe };
