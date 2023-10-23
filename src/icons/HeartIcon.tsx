import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const HeartIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
    return (
        <Svg
            height={size}
            width={size}
            viewBox="0 0 18 16"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path
                d="M8.986 14.5l5.771-5.807a3.864 3.864 0 00.008-5.428 3.778 3.778 0 00-5.376-.01l-.385.388-.384-.39a3.777 3.777 0 00-5.376-.009 3.864 3.864 0 00-.01 5.429L8.987 14.5z"
                fill={'transparent'}
            />
        </Svg>
    );
};
