import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={22}
    height={24}
    viewBox="0 0 22 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      opacity={0.6}
      d="M20.5254 12L1 22.7012L1 16.5176C1.00001 15.1969 2.07096 14.126 3.3916 14.126H5.65625C6.83055 14.1259 7.78223 13.1743 7.78223 12C7.78223 10.8257 6.83055 9.87407 5.65625 9.87402H3.3916C2.07096 9.87402 1.00001 8.80306 1 7.48242L1 1.29785L20.5254 12Z"
      stroke="white"
      strokeWidth={2}
    />
  </Svg>
);
export default SVGComponent;
