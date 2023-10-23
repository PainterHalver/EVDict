import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const HistoryIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
    return (
        <Svg
            height={size}
            width={size}
            viewBox="0 0 30 30"
            stroke={color}
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path
                d="M16.5 11v5.5l4.125 4.125M11.77 5.074a12.375 12.375 0 00-4.015 2.681M5.074 11.77a12.375 12.375 0 00-.949 4.73M5.074 21.23a12.375 12.375 0 002.681 4.015M11.77 27.926c1.5.624 3.106.946 4.73.949M21.23 27.926a12.373 12.373 0 004.015-2.681M27.926 21.23c.624-1.5.946-3.106.949-4.73M27.926 11.77a12.373 12.373 0 00-2.681-4.015M21.23 5.074a12.375 12.375 0 00-4.73-.949"
                fill={fill}
            />
        </Svg>
    );
};
