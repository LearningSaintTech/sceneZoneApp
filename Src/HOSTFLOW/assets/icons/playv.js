import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={44}
    height={44}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M39.875 22C39.875 26.7407 37.9917 31.2873 34.6395 34.6395C31.2873 37.9917 26.7407 39.875 22 39.875C17.2593 39.875 12.7127 37.9917 9.36047 34.6395C6.00825 31.2873 4.125 26.7407 4.125 22C4.125 17.2593 6.00825 12.7127 9.36047 9.36047C12.7127 6.00825 17.2593 4.125 22 4.125C26.7407 4.125 31.2873 6.00825 34.6395 9.36047C37.9917 12.7127 39.875 17.2593 39.875 22Z"
      stroke="url(#paint0_linear_4631_8976)"
      strokeWidth={2.75}
    />
    <Path
      d="M30.25 22L17.875 13.75V30.25L30.25 22Z"
      stroke="url(#paint1_linear_4631_8976)"
      strokeWidth={2.75}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_4631_8976"
        x1={39.875}
        y1={21.9054}
        x2={4.125}
        y2={21.9054}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_4631_8976"
        x1={30.25}
        y1={21.9563}
        x2={17.875}
        y2={21.9563}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
