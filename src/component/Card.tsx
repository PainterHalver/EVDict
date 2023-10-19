import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {COLORS} from '../constants';

type CardProps = {
    children: any;
    style?: StyleProp<ViewStyle>;
};

const Card = ({children, style}: CardProps) => {
    return (
        <Shadow
            sides={{bottom: true, top: false, end: false, start: false}}
            style={styles.card}
            stretch
            distance={0}
            corners={{topStart: false, topEnd: false, bottomStart: true, bottomEnd: true}}
            offset={[0, 1.5]}
            endColor="#00000020"
            paintInside
            startColor="#00000020">
            <View style={style}>{children}</View>
        </Shadow>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 7,
        backgroundColor: COLORS.BACKGROUND_WHITE,
    },
});

export default Card;
