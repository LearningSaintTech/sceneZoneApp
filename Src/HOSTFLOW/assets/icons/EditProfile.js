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
      d="M9.99984 1.66699C7.8165 1.66699 6.0415 3.44199 6.0415 5.62533C6.0415 7.76699 7.7165 9.50033 9.89984 9.57533C9.9665 9.56699 10.0332 9.56699 10.0832 9.57533C10.0998 9.57533 10.1082 9.57533 10.1248 9.57533C10.1332 9.57533 10.1332 9.57533 10.1415 9.57533C12.2748 9.50033 13.9498 7.76699 13.9582 5.62533C13.9582 3.44199 12.1832 1.66699 9.99984 1.66699Z"
      fill="url(#paint0_linear_6676_5112)"
    />
    <Path
      d="M14.2333 11.7914C11.9083 10.2414 8.11663 10.2414 5.77497 11.7914C4.71663 12.4997 4.1333 13.4581 4.1333 14.4831C4.1333 15.5081 4.71663 16.4581 5.76663 17.1581C6.9333 17.9414 8.46663 18.3331 9.99997 18.3331C11.5333 18.3331 13.0666 17.9414 14.2333 17.1581C15.2833 16.4497 15.8666 15.4997 15.8666 14.4664C15.8583 13.4414 15.2833 12.4914 14.2333 11.7914Z"
      fill="url(#paint1_linear_6676_5112)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_6676_5112"
        x1={13.9582}
        y1={9.57533}
        x2={6.04984}
        y2={1.65866}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_6676_5112"
        x1={15.8666}
        y1={18.3331}
        x2={8.79726}
        y2={7.56652}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset={1} stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
