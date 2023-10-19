// @refresh reset

import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, LogBox, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import Tts from 'react-native-tts';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {createMarkup} from '../../utils/markup';
LogBox.ignoreLogs(['new NativeEventEmitter']);

type Props = StackScreenProps<RootStackParamList, 'WordDetail'>;
const screenWidth = Dimensions.get('window').width;

const WordDetail = ({navigation, route}: Props) => {
    const {db, getWord} = useDatabase();
    const word = route.params?.word;

    const speakUk = async () => {
        if (!word) return;
        await Tts.stop();
        await Tts.setDefaultVoice('en-GB-language');
        Tts.speak(word.word);
    };

    const speakUs = async () => {
        if (!word) return;
        await Tts.stop();
        await Tts.setDefaultVoice('en-US-language');
        Tts.speak(word.word);
    };

    // Đúng thứ tự
    const tabs = ['ANH - VIỆT', 'ANH - ANH', 'TECHNICAL', 'ĐỒNG NGHĨA', 'NGỮ PHÁP'];
    // Tab tách nhau bằng ##
    const splittedAvHtml = word?.av.split('##');
    // Chỉ có 1 tab Anh-Việt
    if (!splittedAvHtml || splittedAvHtml.length === 1) {
        tabs.splice(1);
    } else {
        for (let i = splittedAvHtml.length; i >= 0; i--) {
            // Nếu tab rỗng thì chỉ có dấu chấm => xóa
            if (!splittedAvHtml[i] || splittedAvHtml[i].startsWith('.')) {
                splittedAvHtml.splice(i, 1);
                tabs.splice(i, 1);
            }
        }
    }

    const pageCount = tabs.length;
    const maxTranslateX = (pageCount - 1) * -screenWidth;
    const translateX = useSharedValue(0);

    const onGestureEvent = useAnimatedGestureHandler({
        // Lúc bắt đầu chạm
        onStart: (_, ctx: any) => {
            ctx.startX = translateX.value;
        },
        // Lúc vuốt
        onActive: (event, ctx: any) => {
            const nextTranslation = ctx.startX + event.translationX;

            if (nextTranslation > 0 || nextTranslation < maxTranslateX) {
                return;
            }

            translateX.value = nextTranslation;
        },
        // Lúc thả tay
        onEnd: event => {
            const swipeVelocity = Math.abs(event.velocityX);

            // Scroll có momentum, lớn hơn 500 thì chuyển tab
            if (swipeVelocity > 500) {
                const direction = event.velocityX > 0 ? 1 : -1;
                const nextPage = Math.round(translateX.value / screenWidth) + direction;
                const targetTranslateX = Math.max(Math.min(nextPage * screenWidth, 0), maxTranslateX); // clamp to bounds

                translateX.value = withSpring(targetTranslateX, {
                    overshootClamping: true, // clamp lại chứ ko bounce khi vuốt quá
                    restSpeedThreshold: 0.1,
                    restDisplacementThreshold: 0.1,
                    damping: 20,
                    mass: 0.5,
                    stiffness: 100,
                    velocity: event.velocityX,
                });
            } else {
                // Scroll không có momentum (drag)
                const snapPoint = Math.round(translateX.value / screenWidth) * screenWidth;
                const clampedSnapPoint = Math.max(Math.min(snapPoint, 0), maxTranslateX); // clamp to bounds

                translateX.value = withSpring(clampedSnapPoint, {
                    overshootClamping: true,
                    restSpeedThreshold: 0.1,
                    restDisplacementThreshold: 0.1,
                    damping: 20,
                    mass: 0.5,
                    stiffness: 100,
                    velocity: event.velocityX,
                });
            }
        },
    });

    const rTranslateX = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateX.value}],
        };
    });

    const rRulerTranslateX = useAnimatedStyle(() => {
        return {
            transform: [{translateX: -translateX.value / pageCount}],
        };
    });

    return (
        <View style={styles.containerWrapper}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'} animated={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            marginVertical: 10,
                            gap: 10,
                        }}>
                        <TouchableOpacity
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                            onPress={() => {
                                navigation.goBack();
                            }}>
                            <IoIcon name="arrow-back-outline" size={25} color={COLORS.TEXT_WHITE} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: COLORS.TEXT_WHITE,
                                fontSize: 20,
                                fontWeight: '400',
                                marginRight: 'auto',
                            }}>
                            {word?.word}
                        </Text>
                        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                            <MaterialIcon name="report" size={25} color={COLORS.TEXT_WHITE} />
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                            <IoIcon name="star" size={25} color={COLORS.TEXT_WHITE} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.speakers}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={speakUk}>
                            <Text style={{color: COLORS.TEXT_GRAY, fontSize: 16}}>🔊 &nbsp; UK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={speakUs}>
                            <Text style={{color: COLORS.TEXT_GRAY, fontSize: 16}}>🔊 &nbsp; US</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabbar */}
                    <View
                        style={{
                            backgroundColor: COLORS.BACKGROUND_PRIMARY,
                            paddingVertical: 10,
                            position: 'relative',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            {tabs.map((item, index) => {
                                const inputRange = [
                                    (-index - 1) * screenWidth,
                                    -index * screenWidth,
                                    (-index + 1) * screenWidth,
                                ];

                                const rOpacity = useAnimatedStyle(() => {
                                    const opacity = interpolate(
                                        translateX.value,
                                        inputRange,
                                        [0.6, 1, 0.6],
                                        Extrapolate.CLAMP,
                                    );

                                    return {
                                        opacity,
                                    };
                                });

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        hitSlop={{top: 15, bottom: 15}}
                                        style={{flex: 1}}
                                        onPress={() => {
                                            translateX.value = withSpring(-index * screenWidth, {
                                                overshootClamping: true,
                                                restSpeedThreshold: 0.1,
                                                restDisplacementThreshold: 0.1,
                                                damping: 20,
                                                mass: 0.5,
                                                velocity: 20,
                                            });
                                        }}>
                                        <Animated.Text
                                            style={[
                                                {
                                                    fontSize: 13,
                                                    fontWeight: '600',
                                                    color: COLORS.TEXT_WHITE,
                                                    textAlign: 'center',
                                                },
                                                rOpacity,
                                            ]}>
                                            {item}
                                        </Animated.Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Animated.View
                            style={[
                                {
                                    height: 5,
                                    width: screenWidth / pageCount,
                                    backgroundColor: '#ffffff99',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                },
                                rRulerTranslateX,
                            ]}
                        />
                    </View>
                </View>

                <PanGestureHandler onGestureEvent={onGestureEvent}>
                    <Animated.View
                        style={[
                            {flex: 1, flexDirection: 'row', width: screenWidth * pageCount, zIndex: -1},
                            rTranslateX,
                        ]}>
                        {tabs.map((item, index) => {
                            return (
                                <ScrollView
                                    key={(index + 1) * 10}
                                    style={{
                                        flex: 1,
                                        zIndex: -1,
                                        width: screenWidth,
                                        backgroundColor: ' red',
                                    }}>
                                    {/* <View style={{height: 200, backgroundColor: 'cyan'}}></View> */}

                                    <AutoHeightWebView
                                        originWhitelist={['*']}
                                        source={{html: createMarkup(word, splittedAvHtml![index])}}
                                        onMessage={async event => {
                                            const {data} = event.nativeEvent;
                                            if (data === word?.word) return;
                                            const newWord = await getWord(data);
                                            if (newWord) {
                                                navigation.push('WordDetail', {word: newWord});
                                            }
                                        }}
                                    />
                                </ScrollView>
                            );
                        })}
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    );
};

export default WordDetail;

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_WHITE, // match voi webview (10000IQ workaround)
    },
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position: 'relative',
    },
    speakers: {
        position: 'absolute',
        right: 10,
        bottom: -90,
        zIndex: 1000,
        gap: 22,
    },
});
