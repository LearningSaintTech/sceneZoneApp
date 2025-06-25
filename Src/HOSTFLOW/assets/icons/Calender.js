import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.0625 10.3125C10.7833 10.3125 8.125 12.9708 8.125 16.25V25.9375C8.125 29.2167 10.7833 31.875 14.0625 31.875H20H25.9375C29.2167 31.875 31.875 29.2167 31.875 25.9375V16.25C31.875 12.9708 29.2167 10.3125 25.9375 10.3125H22.9688H20H18.2812M15.3125 12.5V8.125M15.3125 27H16.7188M23.4375 27H24.8438M24.6875 12.5V8.125M8.75 19.0625H31.7188M23.4375 23H24.8438M15.3125 23H16.7188"
      stroke="white"
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
