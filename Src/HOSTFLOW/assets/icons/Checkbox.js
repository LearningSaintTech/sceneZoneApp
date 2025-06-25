import * as React from "react";
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={16}
    height={17}
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      y={0.5}
      width={16}
      height={16}
      rx={5}
      fill="url(#paint0_linear_72_657)"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4559 5.34694C12.7246 5.59876 12.7382 6.02065 12.4863 6.28926L7.48634 11.6226C7.23923 11.8862 6.82712 11.9049 6.55708 11.6649L3.55708 8.99823C3.28189 8.75362 3.2571 8.33224 3.50171 8.05705C3.74633 7.78186 4.16771 7.75708 4.4429 8.00169L6.95766 10.237L11.5136 5.37733C11.7654 5.10873 12.1873 5.09512 12.4559 5.34694Z"
      fill="#121212"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_72_657"
        x1={0}
        y1={0.5}
        x2={16}
        y2={16.5}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
