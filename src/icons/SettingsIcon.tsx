import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {IconProps} from '../types';

export const SettingsIcon: React.FC<IconProps> = ({size = 30, color = '#000', fill = color}: IconProps) => {
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
                d="M14.197 5.936c.586-2.415 4.02-2.415 4.606 0a2.37 2.37 0 003.538 1.466c2.122-1.293 4.551 1.135 3.259 3.258a2.37 2.37 0 001.464 3.537c2.415.586 2.415 4.02 0 4.606a2.37 2.37 0 00-1.466 3.538c1.293 2.122-1.135 4.551-3.258 3.259a2.37 2.37 0 00-3.537 1.464c-.586 2.415-4.02 2.415-4.606 0a2.37 2.37 0 00-3.538-1.466C8.537 26.891 6.108 24.463 7.4 22.34a2.37 2.37 0 00-1.464-3.537c-2.415-.586-2.415-4.02 0-4.606a2.37 2.37 0 001.466-3.538C6.109 8.537 8.537 6.108 10.66 7.4a2.368 2.368 0 003.537-1.464z"
                fill={'transparent'}
            />
            <Path d="M16.5 20.625a4.125 4.125 0 100-8.25 4.125 4.125 0 000 8.25z" fill={'transparent'} />
        </Svg>
    );
};
