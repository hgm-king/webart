import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import * as wasm from "game-engine";

window.ayo = (s) => {
  console.log(s);
};

wasm.greet();
console.log(wasm);

export default function Game(props) {
  return (
    <>
      <p>
        A web study is small internet based application that demonstrates only a
        small artistic or technical concept.
      </p>
      <p>
        The ones you find here are built with various tools, some make up the
        framework and others are used to implement the concept being studied.
      </p>
      <p>
        For the framework, React is used to manage state and render a self made
        library of reusable components. Webpack is used to compile this code
        into browser preferred javascript.
      </p>
      <p>
        To implement the studies' core concepts, either d3.js or a custom
        web-assembly module is used.
      </p>
    </>
  );
}
