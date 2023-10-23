import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const TranslateTextIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
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
                d="M5.5 28.875V11a4.125 4.125 0 014.125-4.125h13.75A4.125 4.125 0 0127.5 11v8.25a4.125 4.125 0 01-4.125 4.125H11l-5.5 5.5z"
                fill={'transparent'}
            />
            <Path d="M13.75 19.25v-5.5a2.75 2.75 0 115.5 0v5.5M19.25 16.5h-5.5" fill={'transparent'} />
        </Svg>
    );
};
