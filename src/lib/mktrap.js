import * as eb from "./event_bus";
import Mode from "./mode";

/**
 * p5.js特殊字符映射
 */
const P5_CODE_MAPPING = {
  Control: "ctrl",
  Shift: "shift",
};

const EVENT_TYPE_DOWN = {
  name: "down",
  type: "mouse",
  priority: 0,
  instant: true,
  negative: () => false,
  prepare: function(e) {
    this.params = {
      coord: [e.offsetX, e.offsetY],
    };
  },
  match: function(e) {
    return e.name == "down";
  },
};

const EVENT_TYPE_PRESSED = {
  name: "pressed",
  type: "mouse",
  priority: 0,
  instant: false,
  negative: () => false,
  prepare: function(e) {
    this.params = {
      coord: [e.offsetX, e.offsetY],
    };
  },
  match: function(e) {
    return e.name == "pressed";
  },
};

const EVENT_TYPE_RELEASED = {
  name: "released",
  type: "mouse",
  priority: 1,
  instant: true,
  negative: (e) => e.name == "pressed",
  prepare: function(e) {
    this.params = {};
  },
  match: function(e) {
    return e.name == "released";
  },
};

const EVENT_TYPE_CLICKED = {
  name: "clicked",
  type: "mouse",
  priority: 2,
  instant: true,
  negative: (e) => e.name == "pressed",
  prepare: function(e) {
    this.params = {
      coord: [e.offsetX, e.offsetY],
    };
  },
  match: function(e) {
    return e.name == "clicked";
  },
};

const EVENT_TYPE_MOVED = {
  name: "moved",
  type: "mouse",
  priority: 0,
  instant: true,
  negative: () => false,
  prepare: function(e) {
    this.params = {
      coord: [e.offsetX, e.offsetY],
    };
  },
  match: function(e) {
    return e.name == "moved";
  },
};

const EVENT_TYPE_DRAGGED = {
  name: "dragged",
  type: "mouse",
  priority: 1,
  instant: true,
  negative: () => false,
  prepare: function(e) {
    throw new Error("dragged");
  },
  match: function(e) {
    return e.name == "dragged";
  },
};

const EVENT_TYPE_DOUBLECLICKED = {
  name: "doubleClicked",
  type: "mouse",
  priority: 3,
  instant: true,
  negative: (e) => e.name == "pressed",
  prepare: function(e) {
    this.params = {};
  },
  match: function(e) {
    return e.name == "doubleClicked";
  },
};

const EVENT_TYPE_KEYD = {
  name: "keyd",
  type: "key",
  priority: 0,
  instant: true,
  negative: () => false,
  prepare: function(e) {
    this.params = { code: P5_CODE_MAPPING[e.key] || e.key };
  },
  match: function(e) {
    return e.name == "keyd" && e.params.code == this.params.code;
  },
};

const EVENT_TYPE_KEYP = {
  name: "keyp",
  type: "key",
  priority: 0,
  instant: false,
  negative: () => false,
  prepare: function(e) {
    this.params = { code: P5_CODE_MAPPING[e.key] || e.key };
  },
  match: function(e) {
    return e.name == "keyp" && e.params.code == this.params.code;
  },
};

const EVENT_TYPE_KEYU = {
  name: "keyu",
  type: "key",
  priority: 1,
  instant: true,
  negative: function(e) {
    return e.name == "keyp" && e.params.code == this.params.code;
  },
  prepare: function(e) {
    this.params = { code: P5_CODE_MAPPING[e.key] || e.key };
  },
  match: function(e) {
    return e.name == "keyu" && e.params.code == this.params.code;
  },
};

const EVENT_TYPE_KEY = {
  name: "key",
  type: "key",
  priority: 2,
  instant: true,
  negative: function(e) {
    return e.name == "keyp" && e.params.code == this.params.code;
  },
  prepare: function(e) {
    this.params = { code: P5_CODE_MAPPING[e.key] || e.key };
  },
  match: function(e) {
    return e.name == "key" && e.params.code == this.params.code;
  },
};

const _P5_EVENT_TYPE_MAPPING = {
  mousedown: EVENT_TYPE_PRESSED,
  mouseup: EVENT_TYPE_RELEASED,
  click: EVENT_TYPE_CLICKED,
  mousemove: EVENT_TYPE_MOVED,
  doubleClick: EVENT_TYPE_DOUBLECLICKED,
  keydown: EVENT_TYPE_KEYP,
  keyup: EVENT_TYPE_KEYU,
  keypress: EVENT_TYPE_KEY,
};

class Command {
  constructor(eventSeq, cb, test, priority, comment) {
    this._eventSeq = eventSeq;
    this._cb = cb;
    this._test = test || (() => true);
    this._priority = priority || 0;
    this._comment = comment || "";

    // 匹配指针
    this._matchedPointer = -1;
  }

  test(e) {
    return this._test(e);
  }

  priorityOver(cmd) {
    return this._priority - cmd._priority;
  }

  run(e) {
    this._cb(e);
  }

  match(e) {
    /**
     * 根据当前的事件重置匹配指针
     *
     * 当前指针有可能会使得之前匹配到的状态事件失效，
     * 因此类似于"a[d] a[u]"这样的事件序列没法得到匹配
     */
    this.reset(e);

    // TODO 这里用了一个很诡异的幂等操作
    /**
     * 如果触发的事件是a[d]，则在该事件被解除前，会一直触发操作，
     * 但是p5.js的事件机制不会重复触发该事件，因此会出现一个很诡异的
     * 现象：
     * a键按着，然后鼠标动一动，事件被触发了，确实该事件是由于a键按着触发的，
     * 逻辑上说的通，因为只要a按着，由于它是一个状态事件，因此会被持续触发
     *
     * 也许可以引入如下更细致的事件定义可以解决：
     * a[d] -> a[p] -> a[u] -> a
     *
     * 另外不要用单个的状态事件作为触发条件
     */
    if (this.matched) {
      return;
    }
    let expectedEvent = this._eventSeq[++this._matchedPointer];
    if (!expectedEvent.match(e)) {
      this._matchedPointer--;
    }
  }

  get matched() {
    return this._matchedPointer == this._eventSeq.length - 1;
  }

  reset(e) {
    if (this._matchedPointer >= 0) {
      for (let i = 0; i <= this._matchedPointer; i++) {
        let matchedEvent = this._eventSeq[i];
        if (
          (e && e.negative(matchedEvent)) ||
          (!e && matchedEvent.instant) ||
          (e && !matchedEvent.instant && matchedEvent.match(e))
        ) {
          this._matchedPointer = i - 1;
          return;
        }
      }
    }
  }
}

/**
 * 类似于字符串匹配器，主要的区别在于：
 * 1. 事件是流，是无限的
 * 2. 有的事件是有状态的，在状态撤销前，会一直存在
 *
 * 改进方向：
 * 1. 匹配方式需要更加灵活，目前的API只有一个bind，在解析上仅仅是一个字符串而已
 *    提供组合子似的方式应该更加合适
 * 2. 该组件应该只提供匹配的能力，至于匹配的东西是什么应该暴露API
 */
// TODO 根据改进方向重构
class MKTrap {
  constructor() {
    this._commands = [];

    // 上一次事件循环中发生的所有鼠标和键盘事件
    this._eventsInOneEventLoop = [];

    // 这轮循环结束后需要保留下来的事件
    this._eventsReserved = [];

    // 这轮循环中需要分发的事件
    this._eventsToBeDispatched = [];

    // 自定义事件类型
    this._customEventTypes = {};
  }

  _dispatch() {
    this._prepareEvents();
    let events = this._eventsToBeDispatched;
    let lastCoord;
    let eventsToBeReserved = [];
    while (events.length != 0) {
      let e = events.pop();
      if (e.type == "mouse") {
        // 跟踪鼠标的最新位置
        lastCoord = e.params.coord || e.params.end;
      }
      if (!e.instant) {
        eventsToBeReserved.push(e);
      } else {
        eventsToBeReserved = eventsToBeReserved.filter(
          (event) => !e.negative(event)
        );
      }
      this._commands.forEach((cmd) => cmd.match(e));
      let matchedCmds = this._commands.filter(
        (cmd) => cmd.matched && cmd.test(e)
      );
      if (matchedCmds.length == 0) {
        continue;
      } else if (matchedCmds.length == 1) {
        let cmd = matchedCmds[0];
        cmd.run(e);
      } else {
        let cmd = this._getFirstPriorityCmd(matchedCmds);
        cmd.run(e);
      }

      /**
       * 有命令已执行，需要重置所有命令的匹配指针
       *
       * 重置之后只有状态事件的影响会被保留，这样就会出现以下情形：
       * 比如有这样两个快捷键：
       * moved
       * space n
       * 当按下space键后，如果鼠标发生移动，然后再去按n键，则第二个命令将不会被触发
       */
      // TODO 后续除非真的有需要，可以加入事件的兼容属性解决，例如鼠标的移动在绝大多数情况下都和键盘事件是兼容的
      this._commands.forEach((cmd) => cmd.reset());
    }

    let pressedEvent = eventsToBeReserved.find((e) => e.name == "pressed");
    if (pressedEvent) {
      pressedEvent.params.coord = lastCoord;
    }
    this._eventsReserved = eventsToBeReserved;
  }

  /**
   * 根据优先级规则挑选最匹配的命令
   *
   * @param {*} cmds
   */
  _getFirstPriorityCmd(cmds) {
    cmds.sort((cmd1, cmd2) => {
      return cmd1.priorityOver(cmd2);
    });
    return cmds[0];
  }

  /**
   * 准备需要分派的事件
   *
   * 跟上一次遗留的状态事件合并
   * 删除key事件，根据keyu事件重新生成key事件，目的是为了调整keyu和key事件的先后顺序
   * 加入dragged事件
   */
  _prepareEvents() {
    this._eventsInOneEventLoop.forEach((ce) => {
      this._eventsReserved = this._eventsReserved.filter(
        (re) => !ce.negative(re)
      );
    });

    let events = this._eventsReserved.concat(this._eventsInOneEventLoop);
    let eventsToBeDispatched = [];
    let pressedEventFlag;
    let index = -1;
    let lastPressedEventIndex = -1;
    let lastDraggedEventIndex = -1;
    events.forEach((e) => {
      index++;
      eventsToBeDispatched.push(e);
      if (e.name == "pressed") {
        pressedEventFlag = true;
        lastPressedEventIndex = index;
      } else if (e.type == "mouse" && e.name != "moved") {
        pressedEventFlag = false;
      }
      if (e.name == "keyu") {
        let keyEvent = Object.create(EVENT_TYPE_KEY);
        keyEvent.params = e.params;
        eventsToBeDispatched.push(keyEvent);
      } else if (e.name == "moved" && pressedEventFlag) {
        index++;
        // 拖拽的起点
        let start;
        if (
          lastDraggedEventIndex != -1 &&
          lastDraggedEventIndex > lastPressedEventIndex
        ) {
          start = eventsToBeDispatched[lastDraggedEventIndex].params.end;
        } else {
          start = eventsToBeDispatched[lastPressedEventIndex].params.coord;
        }

        let draggedEvent = Object.create(EVENT_TYPE_DRAGGED);
        lastDraggedEventIndex = index;
        draggedEvent.params = {
          start: start,
          end: e.params.coord,
        };
        eventsToBeDispatched.push(draggedEvent);
      }
    });

    this._eventsInOneEventLoop = [];
    eventsToBeDispatched.reverse();
    this._eventsToBeDispatched = eventsToBeDispatched;
  }

  /**
   * 绑定事件序列到命令
   *
   * 序列用空格隔开
   * 例如：
   * "a b c"代表a，b，c依次被按下
   * "ctrl[d] clicked"代表ctrl键被按住，然后点击鼠标
   *
   * 事件分成状态的和瞬时的。瞬时事件容易理解，例如鼠标点击，鼠标松开，
   * 按了一个键位等。状态事件有：鼠标按下，键位按下，以及一些自定义的状态事件，例如场景被选中
   *
   * 瞬时事件发生后，该事件就消失了，但是状态事件只有当该事件的状态解除后才会消失，
   * 例如鼠标按下只有在鼠标松开才会消失
   *
   * 命令只有在绑定的事件序列被依次匹配后才会被执行。
   * 每发生一个事件，如果匹配，匹配位置会向前走一位，直到依次走完该序列，从而使得该命令被触发执行
   * 当某个命令执行后，所有命令都会将匹配位置恢复到第一个非状态事件之前，也就是说，状态事件没有被解除之前，该事件的影响
   * 是持续的，而瞬时事件的影响是瞬时的。
   * 因此，如果如下两个事件序列：
   * 1. "a b c"
   * 2. "a b c d"
   * 则第二个序列将不可能被完全匹配，因此它绑定的命令没法执行
   *
   * 一些事件在发生的先后顺序上，定义不是很好，因此这里规定事件的偏序如下：
   * 鼠标按下 -> 鼠标松开 -> 鼠标点击
   * 鼠标按下 -> 鼠标拖拽
   * 鼠标移动 -> 鼠标拖拽
   * 键位按下 -> 键位松开 -> 键位敲击
   *
   * 另外，如果某个事件同步导致一些自定义事件被触发，则这些自定义事件
   * 在偏序关系上仅位于该事件之后，例如鼠标按下事件导致场景被选中，从而触发selected事件，
   * 则该selected事件位于鼠标点击前。
   *
   * 该偏序关系还会影响触发的优先级，考虑以下两个事件序列：
   * 1. a b[d] c
   * 2. a b c
   * 这两个事件序列会被同时匹配，这里按照偏序关系定义优先级，第一个匹配成功
   * 因为键位b的按下事件发生在它的敲击事件之前
   *
   * 自定义事件必须给出优先级，不然会导致随机匹配
   *
   * 这里给出目前支持的事件。
   * 鼠标事件：
   * 1. 鼠标按下 pressed
   * 2. 鼠标敲击 clicked
   * 3. 鼠标松开 released
   *
   * 键盘事件：
   * 1. 键位按下 key[d]
   * 2. 键位敲击 key
   * 3. 键位抬起 key[u]
   *
   * 自定义事件：
   * 仅给出一些例子，自定义事件的含义由具体场景解释
   * 1. selected
   * 2. edgeHover
   *
   * @param {String} eventSeq
   * @param {Function} cmd
   * @param {Function} test
   * @param {Number} priority
   * @param {String} comment
   */
  bind(eventSeq, cmd, test, priority, comment) {
    eventSeq = eventSeq.split(" ").map((e) => {
      let event;
      if (e == "down") {
        event = Object.create(EVENT_TYPE_DOWN);
      } else if (e == "pressed") {
        event = Object.create(EVENT_TYPE_PRESSED);
      } else if (e == "released") {
        event = Object.create(EVENT_TYPE_RELEASED);
      } else if (e == "clicked") {
        event = Object.create(EVENT_TYPE_CLICKED);
      } else if (e == "moved") {
        event = Object.create(EVENT_TYPE_MOVED);
      } else if (e == "dragged") {
        event = Object.create(EVENT_TYPE_DRAGGED);
      } else if (e == "doubleClicked") {
        event = Object.create(EVENT_TYPE_DOUBLECLICKED);
      } else if (this._customEventTypes[e]) {
        let cet = this._customEventTypes[e];
        event = Object.create(cet);
      } else {
        let leftBracketIndex = e.indexOf("[");
        if (leftBracketIndex == -1) {
          event = Object.create(EVENT_TYPE_KEY);
          event.params = { code: e };
        } else {
          let flag = e[leftBracketIndex + 1];
          if (flag == "d") {
            event = Object.create(EVENT_TYPE_KEYD);
          } else if (flag == "p") {
            event = Object.create(EVENT_TYPE_KEYP);
          } else if (flag == "u") {
            event = Object.create(EVENT_TYPE_KEYU);
          }
          event.params = { code: e.substring(0, leftBracketIndex) };
        }
      }
      return event;
    });
    let command = new Command(eventSeq, cmd, test, priority, comment);
    this._commands.push(command);
    return this;
  }

  /**
   * 注册自定义事件
   *
   * 将自定义事件加入事件监听
   *
   * @param {*} ets
   */
  registerCustomEventTypes(ets) {
    for (let et of ets) {
      this._customEventTypes[et.name] = et;
      eb.subscribe(et.name, (e) => {
        let event = Object.create(et);
        event.params = e;
        this._eventsToBeDispatched.push(event);
      });
    }
  }

  build() {
    let mode = Object.create(Mode);
    /**
     * 对于p5.js，它的事件偏序为：
     * pressed -> released -> clicked
     * clicked -> clicked -> doubleClicked
     *
     * keydown -> key -> keyup
     * 该序列会被调整成：
     * keydown -> keyup -> key
     *
     * 并且有以下的序列：
     * pressed -> dragged -> dragged -> realeased -> clicked -> moved
     * dragged事件将被重新定义
     *
     */
    for (let key in Mode) {
      mode[key] = (e) => {
        // 收集事件，尚未进行分派处理
        let event = Object.create(_P5_EVENT_TYPE_MAPPING[e.type]);
        event.prepare(e);
        if (event.name != "key") {
          if (event.name == "pressed") {
            let mdEvent = Object.create(EVENT_TYPE_DOWN);
            mdEvent.params = event.params;
            this._eventsInOneEventLoop.push(mdEvent);
          } else if (event.name == "keyp") {
            let kde = Object.create(EVENT_TYPE_KEYD);
            kde.params = event.params;
            this._eventsInOneEventLoop.push(kde);
          }
          this._eventsInOneEventLoop.push(event);
        }

        // TODO 将时间设置成0的意义还需要明确，但我知道这么做是有用的
        setTimeout(() => {
          if (this._eventsInOneEventLoop.length == 0) {
            // 分派处理后，将该数组置成空数组，防止重复处理
            return;
          } else {
            this._dispatch();
          }
        }, 0);
      };
    }
    return mode;
  }
}

export default MKTrap;
