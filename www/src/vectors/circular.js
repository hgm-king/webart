import { select } from "d3-selection";
import { line } from "d3-shape";

import theme from "../theme";
import {
  simpleHarmonicMotionCos,
  simpleHarmonicMotionSin,
} from "../utils/maths-tools.js";
import { getSpectrumPosition } from "../utils/color-tools.js";

class Circular {
  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const { width, height, count } = props;

    const data = Array.from({ length: count }, (_, i) => i);

    // give us a canvas to draw on
    this.svg = select(containerEl)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    // bring in a line
    this.svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke-width", "1");
    // draw with the line
    this.update();
  }

  resize(width, height) {
    // const { svg, props } = this
    //
    // props.width = width
    // props.height = width * 0.4 > 300 ? 600 : 300
    // props.amplitude = width * 0.4 > 300 ? 300 : width * 0.4
    //
    // svg.attr('width', props.width)
    //   .attr('height', props.height)
    //
    // this.update()
  }

  setMultiplierX(multiplierX) {
    this.props.multiplierX = multiplierX;
    this.update();
  }

  setMultiplierY(multiplierY) {
    this.props.multiplierY = multiplierY;
    this.update();
  }

  setCount(count) {
    const { svg, props } = this;
    this.props.count = count;

    const data = Array.from({ length: count }, (_, i) => i);

    svg
      .selectAll("path")
      .data(data)
      .join((enter) =>
        enter.append("path").attr("fill", "none").attr("stroke-width", "1")
      );
    this.update();
  }

  setOffset(offset) {
    this.props.offset = offset;
    this.update();
  }

  setFrequency(frequency) {
    this.props.frequency = frequency;
    this.update();
  }

  setColor(color) {
    const { svg } = this;

    svg.selectAll("path").attr("fill", color);
  }

  setSpectrum(spectrum) {
    this.props.spectrum = spectrum;
    this.update();
  }

  getDrawer(batch) {
    const {
      mode,
      count,
      amplitude,
      offset,
      frequency,
      multiplierX,
      multiplierY,
      width,
      height,
    } = this.props;

    const originX = width / 2;
    const originY = height / 2;

    const arc = Array.from({ length: 1 + 1 }, (_, i) => [
      simpleHarmonicMotionSin(
        originX,
        amplitude,
        multiplierX * frequency,
        i + batch - offset
      ),
      simpleHarmonicMotionCos(
        originY,
        amplitude,
        multiplierY * frequency,
        i + batch - offset
      ),
    ]);

    return line()(arc);
  }

  update() {
    const { svg } = this;

    svg
      .selectAll("path")
      .attr("d", (d) => this.getDrawer(d))
      .attr("stroke", (d) =>
        !this.props.spectrum
          ? "black"
          : getSpectrumPosition(
              this.props.spectrum + d / (this.props.count * 0.4)
            )
      );
  }

  getSvg() {
    const { svg } = this;
    return svg;
  }
}

export default Circular;
