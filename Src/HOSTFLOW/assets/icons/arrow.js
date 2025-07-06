import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={14}
    height={15}
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Defs>
      <LinearGradient id="arrowGradient" x1="5" y1="2" x2="9" y2="12" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
    </Defs>
    <Path
      d="M5.19727 12.1199L9.0006 8.31655C9.44977 7.86738 9.44977 7.13238 9.0006 6.68322L5.19727 2.87988"
      stroke="url(#arrowGradient)"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
