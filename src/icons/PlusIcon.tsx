import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const PlusIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
    return (
        <Svg height={size} width={size} viewBox="-1 -1 30 30" stroke={color}>
            <Path
                d="M13.5 0C6.042 0 0 6.042 0 13.5S6.042 27 13.5 27 27 20.958 27 13.5 20.958 0 13.5 0zm7.839 15.024c0 .36-.294.653-.653.653h-5.009v5.009c0 .359-.293.653-.653.653h-3.048a.655.655 0 01-.653-.653v-5.009H6.315a.655.655 0 01-.654-.653v-3.048c0-.36.294-.653.654-.653h5.008V6.315c0-.36.293-.654.653-.654h3.048c.36 0 .653.294.653.654v5.008h5.009c.359 0 .653.293.653.653v3.048z"
                fill={color}
            />
        </Svg>
    );
};
