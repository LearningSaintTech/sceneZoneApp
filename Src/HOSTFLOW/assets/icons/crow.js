import * as React from "react";
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={13}
    height={12}
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={0.5}
      width={12}
      height={12}
      rx={3}
      fill="url(#paint0_linear_336_5154)"
    />
    <Path
      d="M6.55286 5.62317C6.51953 5.61984 6.47953 5.61984 6.44286 5.62317C5.64953 5.5965 5.01953 4.9465 5.01953 4.1465C5.01953 3.32984 5.67953 2.6665 6.49953 2.6665C7.3162 2.6665 7.97953 3.32984 7.97953 4.1465C7.9762 4.9465 7.3462 5.5965 6.55286 5.62317Z"
      stroke="black"
      strokeWidth={0.55}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.88625 6.8535C4.07958 7.3935 4.07958 8.2735 4.88625 8.81016C5.80292 9.4235 7.30625 9.4235 8.22292 8.81016C9.02958 8.27016 9.02958 7.39016 8.22292 6.8535C7.30958 6.2435 5.80625 6.2435 4.88625 6.8535Z"
      stroke="black"
      strokeWidth={0.55}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_336_5154"
        x1={12.5}
        y1={12}
        x2={0.5}
        y2={0}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
