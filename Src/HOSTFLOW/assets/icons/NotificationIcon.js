import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const NotificationIcon = ({ width = 32, height = 32, ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6.53001 18.7706C6.31701 20.1646 7.26801 21.1316 8.43201 21.6136C12.895 23.4636 19.105 23.4636 23.568 21.6136C24.732 21.1316 25.683 20.1636 25.47 18.7706C25.34 17.9136 24.693 17.2006 24.214 16.5036C23.587 15.5796 23.525 14.5726 23.524 13.5006C23.525 9.35861 20.157 6.00061 16 6.00061C11.843 6.00061 8.47501 9.35861 8.47501 13.5006C8.47501 14.5726 8.41301 15.5806 7.78501 16.5036C7.30701 17.2006 6.66101 17.9136 6.53001 18.7706Z"
        stroke="#C6C5ED"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.9995 23.0009C12.4575 24.7259 14.0755 26.0009 15.9995 26.0009C17.9245 26.0009 19.5405 24.7259 19.9995 23.0009"
        stroke="#C6C5ED"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="21.4"
        cy="8.20031"
        r="3.44761"
        fill="url(#paint0_linear_1139_7688)"
        stroke="#161618"
        strokeWidth="0.766136"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1139_7688"
          x1="25.2307"
          y1="8.18004"
          x2="17.5693"
          y2="8.18004"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B15CDE" />
          <Stop offset="1" stopColor="#7952FC" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default NotificationIcon; 