import * as React from "react";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
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
      d="M2.52952 15.7036C2.31652 17.0976 3.26752 18.0646 4.43152 18.5466C8.89452 20.3966 15.1045 20.3966 19.5675 18.5466C20.7315 18.0646 21.6825 17.0966 21.4695 15.7036C21.3395 14.8466 20.6925 14.1336 20.2135 13.4366C19.5865 12.5126 19.5245 11.5056 19.5235 10.4336C19.5245 6.29159 16.1565 2.93359 11.9995 2.93359C7.84252 2.93359 4.47452 6.29159 4.47452 10.4336C4.47452 11.5056 4.41252 12.5136 3.78452 13.4366C3.30652 14.1336 2.66052 14.8466 2.52952 15.7036Z"
      stroke="#C6C5ED"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.99902 19.9336C8.45702 21.6586 10.075 22.9336 11.999 22.9336C13.924 22.9336 15.54 21.6586 15.999 19.9336"
      stroke="#C6C5ED"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={17.4}
      cy={5.13341}
      r={3.44761}
      fill="url(#paint0_linear_3115_8939)"
      stroke="#161618"
      strokeWidth={0.766136}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_3115_8939"
        x1={21.2307}
        y1={5.11315}
        x2={13.5693}
        y2={5.11315}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
