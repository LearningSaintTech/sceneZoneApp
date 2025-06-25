import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={54}
    height={54}
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M54 27C54 41.9117 41.9117 54 27 54C12.0883 54 0 41.9117 0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27ZM0.809999 27C0.809999 41.4643 12.5357 53.19 27 53.19C41.4643 53.19 53.19 41.4643 53.19 27C53.19 12.5357 41.4643 0.809999 27 0.809999C12.5357 0.809999 0.809999 12.5357 0.809999 27Z"
      fill="url(#paint0_linear_229_3885)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_229_3885"
        x1={54}
        y1={26.8571}
        x2={2.65033e-7}
        y2={26.8571}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
