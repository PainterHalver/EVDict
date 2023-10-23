import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const EditIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
    return (
        <Svg height={size} width={size} viewBox="0 -0.5 23 23" stroke="none" strokeWidth={1} fillRule="evenodd">
            <Path
                d="M384 209.21V219h-21v-19.579h10.5v1.958h-8.4v15.663h16.8v-7.832h2.1zm-13.65.304l8.423-7.869 1.632 1.998-8.523 8.504h-1.532v-2.633zm-2.1 4.591h4.532l10.402-10.46L378.83 199l-10.58 9.688v5.417z"
                transform="translate(-419 -359) translate(56 160)"
                fill={color}
            />
        </Svg>
    );
};
