import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Dimensions, Image, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {COLORS} from '../../constants';
import {RootStackParamList} from '../../../App';
import {useDatabase} from '../../contexts/DatabaseContext';

type Props = StackScreenProps<RootStackParamList, 'SplashScreen'>;

const screenWidth = Dimensions.get('window').width;

const SplashScreen = ({navigation}: Props) => {
    const {initFinished} = useDatabase();

    useEffect(() => {
        if (initFinished) {
            navigation.replace('Home');
        }
    }, [initFinished]);

    return (
        <View style={styles.containerWrapper}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'} animated={true} />
            <View style={styles.container}>
                <Image
                    source={require('../../assets/icon_1024.png')}
                    style={{width: screenWidth * 0.9, height: screenWidth * 0.9}}
                />
            </View>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
