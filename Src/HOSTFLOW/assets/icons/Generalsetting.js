import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
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
      d="M15.7834 4.51686L11.4751 2.0252C10.6501 1.5502 9.3584 1.5502 8.5334 2.0252L4.1834 4.53353C2.4584 5.70019 2.3584 5.87519 2.3584 7.73353V12.2585C2.3584 14.1169 2.4584 14.3002 4.21673 15.4835L8.52506 17.9752C8.94173 18.2169 9.47507 18.3335 10.0001 18.3335C10.5251 18.3335 11.0584 18.2169 11.4667 17.9752L15.8167 15.4669C17.5417 14.3002 17.6417 14.1252 17.6417 12.2669V7.73353C17.6417 5.87519 17.5417 5.70019 15.7834 4.51686ZM10.0001 12.7085C8.5084 12.7085 7.29173 11.4919 7.29173 10.0002C7.29173 8.50853 8.5084 7.29186 10.0001 7.29186C11.4917 7.29186 12.7084 8.50853 12.7084 10.0002C12.7084 11.4919 11.4917 12.7085 10.0001 12.7085Z"
      fill="url(#paint0_linear_6676_499)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_6676_499"
        x1={17.6417}
        y1={18.3335}
        x2={1.03933}
        y2={3.10722}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
