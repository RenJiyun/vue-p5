import katex from "katex"

class Text {
    constructor() {
        this.done = false;
    }

    show() {
        let [canvas] = arguments;
        

        this.done = true;
    }
}

export { Text };
