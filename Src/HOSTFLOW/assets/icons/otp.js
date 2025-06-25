import * as React from "react";
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={53}
    height={52}
    viewBox="0 0 53 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={0.5}
      width={52}
      height={52}
      rx={14}
      fill="url(#paint0_linear_72_632)"
    />
    <Path
      d="M35.2199 15.4933L27.8866 12.7466C27.1266 12.4666 25.8866 12.4666 25.1266 12.7466L17.7933 15.4933C16.3799 16.0266 15.2333 17.68 15.2333 19.1866V29.9866C15.2333 31.0666 15.9399 32.4933 16.8066 33.1333L24.1399 38.6133C25.4333 39.5866 27.5533 39.5866 28.8466 38.6133L36.1799 33.1333C37.0466 32.48 37.7533 31.0666 37.7533 29.9866V19.1866C37.7666 17.68 36.6199 16.0266 35.2199 15.4933ZM31.1399 22.96L25.4066 28.6933C25.2066 28.8933 24.9533 28.9866 24.6999 28.9866C24.4466 28.9866 24.1933 28.8933 23.9933 28.6933L21.8599 26.5333C21.4733 26.1466 21.4733 25.5066 21.8599 25.12C22.2466 24.7333 22.8866 24.7333 23.2733 25.12L24.7133 26.56L29.7399 21.5333C30.1266 21.1466 30.7666 21.1466 31.1533 21.5333C31.5399 21.92 31.5399 22.5733 31.1399 22.96Z"
      fill="#0D0D0D"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_72_632"
        x1={0.5}
        y1={0}
        x2={52.5}
        y2={52}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
