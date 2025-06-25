import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5.9375 1C4.69648 1 3.6875 2.00898 3.6875 3.25V16.75C3.6875 17.991 4.69648 19 5.9375 19H13.8125C15.0535 19 16.0625 17.991 16.0625 16.75V3.25C16.0625 2.00898 15.0535 1 13.8125 1H5.9375ZM8.75 16.1875H11C11.3094 16.1875 11.5625 16.4406 11.5625 16.75C11.5625 17.0594 11.3094 17.3125 11 17.3125H8.75C8.44063 17.3125 8.1875 17.0594 8.1875 16.75C8.1875 16.4406 8.44063 16.1875 8.75 16.1875Z"
      fill="#C6C5ED"
    />
  </Svg>
);
export default SVGComponent;
