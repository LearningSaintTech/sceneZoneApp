import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={25}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.5 21.9316C16.7467 21.9316 21 17.6783 21 12.4316C21 7.18494 16.7467 2.93164 11.5 2.93164C6.25329 2.93164 2 7.18494 2 12.4316C2 17.6783 6.25329 21.9316 11.5 21.9316Z"
      stroke="#C6C5ED"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 22.9316L20 20.9316"
      stroke="#C6C5ED"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
