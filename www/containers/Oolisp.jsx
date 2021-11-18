import React, { useEffect, useState, useRef } from "react"
import * as oolisp from "oolisp"
import { css } from "@emotion/css"

import FlexRow from "../components/FlexRow.jsx"
import Button from "../components/Button.jsx"

let env;
const prelude = `
list
(def {true} 1)
(def {false} 0)
(def {nil} ())
(def {fun} (\\ {args body} {def (head args) (\\ (tail args) body)}))
(fun {cons x xs}
  {join
    (if (== x {})
      {x}
      {list x})
    xs})
(fun {snoc x xs} {join xs (list x)})
(fun {first x : xs} {x})
(fun {second x : xs} {eval (head xs)})
(fun {curry f xs} {eval (join (list f) xs)})
(fun {uncurry f : xs} {f xs})
(fun {len l} {if (empty l) {0} {+ 1 (len (tail l))}})
(fun {reverse x} {if (== (len l) 1) {l} {snoc (head l) (reverse (tail l)) }})
(fun {empty l} {if (== l {}) {true} {false}})
(fun {dec n} {- n 1})
(fun {add1 n} {+ n 1})
(fun {nth l n} {if (== n 0) {head l} {nth (tail l) (dec n)}})
(fun {add a b} {iter a b (\\ {n-1} {+ 1 n-1})})
(fun {gauss n} {rec n 0 (\\ {n-1 gaussn-1} {+ (add1 n-1) (gaussn-1)})})

(fun {fac n}
  {rec n
    1
    (\\ {n-1 facn-1}
      {* (add1 n-1) (facn-1)})})

(fun {peas how-many-peas}
  {rec how-many-peas
    {}
    (\\ {l-1 peasl-1}
    {cons "pea" peasl-1})})

(fun {iter target base step} {if (== 0 target) {base} {step (iter (dec target) base step)}})

(fun {rec target base step}
  {if (== 0 target)
    {base}
    {step (dec target)
      (\\ {} {rec (dec target) base step})}})
`

const terminalInput = css`
  background: inherit;
  border: none;
  outline: none;
  width: 80%;
  font-size: 1em;
`

const terminal = css`
  font-size: 1.2em;
`

const prompt = "oolisp >"

export default function Oolisp( props )  {

  const [ shellInput, setShellInputState ] = useState("")
  const [ shellHistory, setShellHistoryState ] = useState([])
  const [ shellBuffer, setShellBufferState ] = useState("")
  const [ historyIndex, setHistoryIndex ] = useState(-1)

  useEffect(() => {
    env = oolisp.init_env()
    console.log(oolisp.lisp(env, prelude))
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const inputRef = useRef()
  inputRef.current = shellInput

  const historyRef = useRef()
  historyRef.current = shellHistory

  const bufferRef = useRef()
  bufferRef.current = shellBuffer

  const handleInput = ({target}) => {
    setShellInputState(target.value)
  }

  const handleCalculate = () => {
    if (inputRef.current == "clear") {
      setShellBufferState("")
    } else {
      setShellBufferState((currentBuf) => <>
        <div>{oolisp.lisp(env, inputRef.current)}</div>
        <div>{prompt} {inputRef.current}</div>
        {currentBuf}
      </>)
    }

    setShellHistoryState(history => [inputRef.current, ...history])
    setShellInputState("")
    setHistoryIndex(-1)
  }

  const handleKeyPress = (e) => {
      e = e || window.event;
      if ( e.key == "Enter" ) {
        handleCalculate()
      } else if ( e.key == "ArrowUp") {
        setHistoryIndex(i => i == historyRef.current.length - 1  ? i : i + 1)
        // setShellInputState(historyRef.current[historyIndex])
      } else if ( e.key == "ArrowDown") {
        setHistoryIndex(i => i == -1 ? -1 : i - 1)
        // setShellInputState(historyIndex == -1 ? "" : historyRef.current[historyIndex])
      }
  };

  return (
    <>
      <h2>Oolisp</h2>
      <div className={terminal}>
        <FlexRow direction="column-reverse" overflowY="scroll" height="500px">
          {shellBuffer}
        </FlexRow>
        <FlexRow align="center">
          <label htmlFor="prompt">{prompt}</label><input name="prompt" type="text" onChange={handleInput} value={shellInput} className={terminalInput} />
        </FlexRow>
      </div>
    </>
  )
}