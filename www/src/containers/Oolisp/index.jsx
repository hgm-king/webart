import { h, Fragment } from "preact";
import entry from "../../build/entry.js";
import { useState, useEffect, useRef } from "preact/hooks";
import "./style.css";
import * as oolisp from "oolisp";
import { prelude, prompt, help } from "./contants.js";

import FlexRow from "../../components/FlexRow/index.jsx";
import Title from "../../components/Title/index.jsx";

let env;

function Oolisp(props) {
  const [shellInput, setShellInputState] = useState("");
  const [shellBuffer, setShellBufferState] = useState("");

  useEffect(() => {
    env = oolisp.init_env();
    const res = oolisp.lisp(env, prelude);
    console.log(res);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      // returning a method will clean up any listeners
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const inputRef = useRef();
  inputRef.current = shellInput;

  const bufferRef = useRef();
  bufferRef.current = shellBuffer;

  const handleInput = ({ target }) => {
    setShellInputState(target.value);
  };

  const doLisp = (currentBuf) => {
    let res;

    try {
      res = oolisp.lisp(env, inputRef.current);
    } catch {
      res = "... Error: Oolisp has crashed! Perhaps too much recursion?";
    }

    return (
      <Fragment>
        <div>{res}</div>
        <div>
          {prompt} {inputRef.current}
        </div>
        {currentBuf}
      </Fragment>
    );
  };

  const handleCalculate = () => {
    if (inputRef.current == "clear") {
      setShellBufferState("");
    } else if (inputRef.current == "help") {
      setShellBufferState(<pre>{help}</pre>);
    } else {
      setShellBufferState(doLisp);
    }
    setShellInputState("");
  };

  const handleKeyPress = (e) => {
    e = e || window.event;
    if (e.key == "Enter") {
      handleCalculate();
    }
  };

  return (
    <div className="page">
      <div className="content">
        <div className="shell-buffer">
          <FlexRow direction="column-reverse">{shellBuffer}</FlexRow>
        </div>
        <FlexRow align="center">
          <label for="prompt">{prompt}</label>
          <input
            className="shell-input"
            name="prompt"
            type="text"
            onInput={handleInput}
            value={shellInput}
          />
        </FlexRow>
      </div>
      <Title
        title="OOLISP"
        description="Web-based LISP interpreter. >1k lines of Rust, compiled to WASM. Enter 'help' into the prompt for instructions."
      />
    </div>
  );
}

entry(<Oolisp />);
