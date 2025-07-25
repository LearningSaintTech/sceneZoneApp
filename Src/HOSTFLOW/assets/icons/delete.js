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
      d="M17.0832 5H2.9165M15.694 7.08333L15.3107 12.8333C15.1632 15.045 15.0898 16.1508 14.369 16.825C13.6482 17.4992 12.539 17.5 10.3223 17.5H9.67734C7.46067 17.5 6.3515 17.5 5.63067 16.825C4.90984 16.1508 4.83567 15.045 4.689 12.8333L4.30567 7.08333M7.9165 9.16667L8.33317 13.3333M12.0832 9.16667L11.6665 13.3333"
      stroke="url(#paint0_linear_229_7272)"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M5.4165 5H5.50817C5.84354 4.99143 6.16852 4.88185 6.44061 4.68559C6.71269 4.48934 6.91922 4.21553 7.03317 3.9L7.0615 3.81417L7.14234 3.57167C7.2115 3.36417 7.2465 3.26083 7.29234 3.1725C7.38251 2.99949 7.51193 2.84999 7.67023 2.73597C7.82854 2.62194 8.01134 2.54655 8.204 2.51583C8.3015 2.5 8.41067 2.5 8.629 2.5H11.3707C11.589 2.5 11.6982 2.5 11.7957 2.51583C11.9883 2.54655 12.1711 2.62194 12.3294 2.73597C12.4877 2.84999 12.6172 2.99949 12.7073 3.1725C12.7532 3.26083 12.7882 3.36417 12.8573 3.57167L12.9382 3.81417C13.0438 4.16523 13.2622 4.47167 13.5596 4.68605C13.857 4.90043 14.2167 5.01077 14.5832 5"
      stroke="url(#paint1_linear_229_7272)"
      strokeWidth={1.5}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_229_7272"
        x1={17.0832}
        y1={11.2169}
        x2={2.9165}
        y2={11.2169}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_229_7272"
        x1={14.5832}
        y1={3.74374}
        x2={5.4165}
        y2={3.74374}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B15CDE" />
        <Stop offset={1} stopColor="#7952FC" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
