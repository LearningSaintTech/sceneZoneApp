import * as React from "react";
import Svg, { Rect, Circle } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={40}
    height={41}
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect y={0.5} width={40} height={40} rx={20} fill="#191919" />
    <Circle
      opacity={0.5}
      cx={15.3333}
      cy={20.3333}
      r={9.33333}
      fill="#8D6BFC"
    />
    <Circle
      opacity={0.5}
      cx={24.6668}
      cy={20.3333}
      r={9.33333}
      fill="#8D6BFC"
    />
  </Svg>
);
export default SVGComponent;
