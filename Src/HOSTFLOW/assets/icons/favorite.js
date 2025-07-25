import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M13.2865 20.8096C12.9465 20.9296 12.3865 20.9296 12.0465 20.8096C9.1465 19.8196 2.6665 15.6896 2.6665 8.68961C2.6665 5.59961 5.1565 3.09961 8.2265 3.09961C10.0465 3.09961 11.6565 3.97961 12.6665 5.33961C13.6765 3.97961 15.2965 3.09961 17.1065 3.09961C20.1765 3.09961 22.6665 5.59961 22.6665 8.68961C22.6665 15.6896 16.1865 19.8196 13.2865 20.8096Z"
      stroke={props.color || "#C6C5ED"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
