import { select } from "d3-selection";
import { line } from "d3-shape";
import {
  simpleHarmonicMotionCos,
  simpleHarmonicMotionSin,
} from "../utils/maths-tools.js";

import {
  fourier,
  squareWaveSequenceSin,
  squareWaveSequenceCos,
} from "../utils/maths-tools.js";
import { getSpectrumPosition } from "../utils/color-tools.js";

class colorPlot {
  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const { width, height } = props;

    this.svg = select(containerEl)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.update();
  }

  resize(width, height) {
    const { svg, props } = this;

    if (width < 670) {
      props.width = width * 0.6;
      props.height = width * 0.6;
    } else {
      props.width = 500;
      props.height = 500;
    }

    svg.attr("width", props.width).attr("height", props.height);

    this.update();
  }

  getCircleDrawerX() {
    const { xMultiplier, xAmplitude, frequency, offset } = this.props;
    return (d, i) =>
      simpleHarmonicMotionCos(
        0,
        xAmplitude,
        xMultiplier * (1 / frequency) * Math.PI,
        i - offset / 10
      );
  }

  getCircleDrawerY() {
    const { yMultiplier, yAmplitude, frequency, offset } = this.props;
    return (d, i) =>
      simpleHarmonicMotionSin(
        0,
        yAmplitude,
        yMultiplier * (1 / frequency) * Math.PI,
        i - offset / 10
      );
  }

  getRadius() {
    const { rMultiplier, rAmplitude, rOrigin, offset } = this.props;
    return (d, i) =>
      simpleHarmonicMotionSin(rOrigin, rAmplitude, rMultiplier * Math.PI, i);
  }

  getColor() {
    const { colorMultiplier, colorOffset } = this.props;

    return !colorMultiplier
      ? "black"
      : (d, i) => getSpectrumPosition(colorOffset + i * colorMultiplier);
  }

  setOptions(props) {
    this.props = props;
    this.update();
  }

  update() {
    const {
      svg,
      props: { height, width, count },
    } = this;

    const values = Array.from({ length: count }, (_, i) => [i]);

    const circles = svg.selectAll("circle").data(values);

    circles.exit().remove();
    circles
      .enter()
      .append("circle")
      .attr("cy", this.getCircleDrawerY())
      .attr("cx", this.getCircleDrawerX())
      .attr("r", this.getRadius())
      .attr("fill", "none")
      .attr("stroke", this.getColor())
      .attr("stroke-width", "1")
      .attr("transform", `translate(${width / 2},${height / 2})`);
    circles
      .attr("cy", this.getCircleDrawerY())
      .attr("cx", this.getCircleDrawerX())
      .attr("r", this.getRadius())
      .attr("stroke", this.getColor())
      .attr("transform", `translate(${width / 2},${height / 2})`);
  }
}

export default colorPlot;
