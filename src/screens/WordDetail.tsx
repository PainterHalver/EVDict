// @refresh reset

import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
    Button,
    Platform,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableNativeFeedback,
    View,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
import { RootStackParamList } from '../../App';
import { useDatabase } from '../contexts/DatabaseContext';
import { Word } from '../types';
import { WebView } from 'react-native-webview';
import { createMarkup } from '../utils/markup';
import Tts from 'react-native-tts';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// Prop 1 là prop gần nhất, 2 là của parent
type Props = StackScreenProps<RootStackParamList>;

const WordDetail = ({ navigation, route }: Props) => {
    const { db, getWord } = useDatabase();
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

    return (
        <View style={styles.containerWrapper}>
            <StatusBar
                translucent
                barStyle={'light-content'}
                backgroundColor={'transparent'}
                animated={true}
            />
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <IoIcon
                                name="arrow-back-outline"
                                size={25}
                                color={COLORS.TEXT_WHITE}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: COLORS.TEXT_WHITE,
                                fontSize: 18,
                                fontWeight: '400',
                                marginRight: 'auto',
                            }}>
                            {word?.word}
                        </Text>
                        <TouchableOpacity>
                            <MaterialIcon name="report" size={25} color={COLORS.TEXT_WHITE} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <IoIcon name="star" size={25} color={COLORS.TEXT_WHITE} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.speakers}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={speakUk}>
                            <Text style={{ color: COLORS.TEXT_GRAY, fontSize: 16 }}>
                                🔊 &nbsp; UK
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={speakUs}>
                            <Text style={{ color: COLORS.TEXT_GRAY, fontSize: 16 }}>
                                🔊 &nbsp; US
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, zIndex: -1 }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: createMarkup(word) }}
                    />
                </View>
            </View>
        </View>
    );
};

export default WordDetail;

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
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