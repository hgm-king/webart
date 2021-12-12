import React from "react"
import { css } from "@emotion/css"
import theme from "../theme"

import FlexRow from "./FlexRow.jsx"

const descriptionStyle = css`
`

export default function Title( props )  {

  const { title, description } = props;

  return (
    <div>
      <h2>{title}</h2>
      <p className={descriptionStyle}>{description}</p>
    </div>
  )
}