import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const EllipsisIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
    return (
        <Svg height={size} width={size} viewBox="0 0 25 25" stroke={color} strokeWidth={0.00025}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                fill={color}
            />
        </Svg>
    );
};
