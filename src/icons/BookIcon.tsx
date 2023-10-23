import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const BookIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
    return (
        <Svg
            height={size}
            width={size}
            viewBox="0 0 30 30"
            stroke={color}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path
                d="M26.125 5.5v22h-16.5a2.75 2.75 0 01-2.75-2.75V8.25a2.75 2.75 0 012.75-2.75h16.5z"
                fill={'transparent'}
            />
            <Path d="M26.125 22h-16.5a2.75 2.75 0 00-2.75 2.75M12.375 11h8.25" fill={'transparent'} />
        </Svg>
    );
};
