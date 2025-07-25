import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8.00016 14.2333L7.0335 13.3533C3.60016 10.24 1.3335 8.18 1.3335 5.66667C1.3335 3.60667 2.94683 2 5.00016 2C6.16016 2 7.2735 2.54 8.00016 3.38667C8.72683 2.54 9.84016 2 11.0002 2C13.0535 2 14.6668 3.60667 14.6668 5.66667C14.6668 8.18 12.4002 10.24 8.96683 13.3533L8.00016 14.2333Z"
      fill="#FF3B30"
    />
  </Svg>
);
export default SVGComponent;
