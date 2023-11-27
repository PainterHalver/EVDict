// @refresh reset

import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
    Dimensions,
    LogBox,
    Platform,
    ScrollView,
    StatusBar,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableHighlight,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons';
import OctIcon from 'react-native-vector-icons/Octicons';
import {RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {Shadow} from 'react-native-shadow-2';
import Card from '../../component/Card';
import Tts from 'react-native-tts';
import Clipboard from '@react-native-clipboard/clipboard';
import ImagePicker from 'react-native-image-crop-picker';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
// @ts-ignore
import TextRecognition from '@react-native-ml-kit/text-recognition';

type Props = StackScreenProps<RootStackParamList, 'TranslateText'>;

interface Translation {
    vi: string;
    en: string;
    [key: string]: string;
}
const MAP: Translation = {
    vi: 'Tiếng Việt',
    en: 'Tiếng Anh',
};

const TranslateText = ({navigation, route}: Props) => {
    const {setLoading} = useLoadingModal();
    const [text, setText] = React.useState<string>(route.params?.text || '');
    const [fromTo, setFromTo] = React.useState<string[]>(['vi', 'en']);
    const [result, setResult] = React.useState<string>('');

    const speakFromText = async () => {
        try {
            if (!text) return;
            await Tts.stop();
            await Tts.setDefaultVoice(fromTo[0] === 'vi' ? 'vi-VN-language' : 'en-GB-language');
            Tts.speak(text);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.LONG);
        }
    };

    const speakToText = async () => {
        try {
            if (!result) return;
            await Tts.stop();
            await Tts.setDefaultVoice(fromTo[1] === 'vi' ? 'vi-VN-language' : 'en-GB-language');
            Tts.speak(result);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.LONG);
        }
    };

    const enToVi = async () => {
        try {
            if (!text) return;
            setLoading(true);
            setFromTo(['en', 'vi']);
            const url = 'https://clients4.google.com/translate_a/t?&client=dict-chrome-ex&sl=en&tl=vi&tbb=1&q=';
            const res = await fetch(url + text);
            const data = await res.json();
            setResult(data[0]);
            setLoading(false);
        } catch (error) {
            console.log('ERROR: ', error);
            ToastAndroid.show('Không thể kết nối tới máy chủ, vui lòng thử lại sau', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    const viToEn = async () => {
        try {
            if (!text) return;
            setLoading(true);
            setFromTo(['vi', 'en']);
            const url = 'https://clients4.google.com/translate_a/t?&client=dict-chrome-ex&sl=vi&tl=en&tbb=1&q=';
            const res = await fetch(url + text);
            const data = await res.json();
            setResult(data[0]);
            setLoading(false);
        } catch (error) {
            console.log('ERROR: ', error);
            ToastAndroid.show('Không thể kết nối tới máy chủ, vui lòng thử lại sau', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    const handleTranslateImage = async () => {
        try {
            const image = await ImagePicker.openCamera({
                cropping: true,
                freeStyleCropEnabled: true,
            });

            setLoading(true);
            const textResult = await TextRecognition.recognize(image.path);
            let result = '';
            for (const block of textResult.blocks) {
                result += block.text + ' ';
            }
            setText(result);
        } catch (error) {
            console.log('ERROR: ', error);
            ToastAndroid.show('Đã có lỗi xảy ra, vui lòng thử lại', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.containerWrapper}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'} animated={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 20,
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
                            Dịch văn bản
                        </Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.bodyContainer}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="always">
                    <Shadow
                        sides={{bottom: true, top: false, end: false, start: false}}
                        style={{
                            borderRadius: 200,
                            backgroundColor: COLORS.BACKGROUND_WHITE,
                            marginVertical: 10,
                        }}
                        stretch
                        distance={0}
                        offset={[0, 11.5]}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: COLORS.BACKGROUND_WHITE,
                                borderRadius: 20,
                                paddingVertical: 10,
                            }}>
                            <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16, flex: 1, textAlign: 'center'}}>
                                {MAP[fromTo[0]]}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: COLORS.BACKGROUND_PRIMARY,
                                    position: 'absolute',
                                    borderRadius: 200,
                                    height: 60,
                                    width: 60,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    left: '50%',
                                    transform: [{translateX: -30}],
                                }}>
                                <OctIcon name="arrow-switch" size={25} color={COLORS.TEXT_WHITE} />
                            </View>
                            <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16, flex: 1, textAlign: 'center'}}>
                                {MAP[fromTo[1]]}
                            </Text>
                        </View>
                    </Shadow>

                    <Card style={{padding: 10}}>
                        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                            <TouchableHighlight
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                                onPress={speakFromText}
                                style={{
                                    backgroundColor: COLORS.BACKGROUND_PRIMARY,
                                    borderRadius: 20,
                                    height: 25,
                                    width: 25,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <IoIcon name="volume-high" size={15} color={COLORS.TEXT_WHITE} />
                            </TouchableHighlight>
                            <Text style={{marginRight: 'auto', color: COLORS.TEXT_GRAY}}>{MAP[fromTo[0]]}</Text>
                            <TouchableOpacity
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                onPress={() => {
                                    setText('');
                                    setResult('');
                                }}>
                                <IoIcon name="close" size={25} color={COLORS.TEXT_GRAY} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="Nhập văn bản cần dịch"
                            autoCapitalize="none"
                            blurOnSubmit
                            cursorColor={COLORS.BACKGROUND_PRIMARY}
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                    </Card>

                    {/* 2 Translate Buttons */}
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10}}>
                        <TouchableHighlight
                            onPress={enToVi}
                            underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                            style={styles.translateButton}>
                            <Text style={{fontSize: 16, color: COLORS.TEXT_WHITE, fontWeight: '500'}}>Anh - Việt</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={viToEn}
                            underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                            style={styles.translateButton}>
                            <Text style={{fontSize: 16, color: COLORS.TEXT_WHITE, fontWeight: '500'}}>Việt - Anh</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={handleTranslateImage}
                            underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                            style={styles.translateButton}>
                            <Text style={{fontSize: 16, color: COLORS.TEXT_WHITE, fontWeight: '500'}}>OCR</Text>
                        </TouchableHighlight>
                    </View>

                    {/* Result Card */}
                    {result && (
                        <Card style={{padding: 10, gap: 10}}>
                            <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                                <TouchableHighlight
                                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                                    onPress={speakToText}
                                    style={{
                                        backgroundColor: COLORS.BACKGROUND_PRIMARY,
                                        borderRadius: 20,
                                        height: 25,
                                        width: 25,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <IoIcon name="volume-high" size={15} color={COLORS.TEXT_WHITE} />
                                </TouchableHighlight>
                                <Text style={{marginRight: 'auto', color: COLORS.TEXT_GRAY}}>{MAP[fromTo[1]]}</Text>
                                <TouchableOpacity
                                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    onPress={() => {
                                        Clipboard.setString(result);
                                        ToastAndroid.show('Đã sao chép', ToastAndroid.SHORT);
                                    }}>
                                    <OctIcon name="copy" size={20} color={COLORS.TEXT_GRAY} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{color: COLORS.TEXT_BLACK}}>{result}</Text>
                        </Card>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

export default TranslateText;

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_WHITE_DARK,
    },
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position: 'relative',
    },
    bodyContainer: {
        flexGrow: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 7,
    },
    translateButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        paddingVertical: 10,
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
    },
});
