// @refresh reset

import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
    LogBox,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    TouchableHighlight,
    ToastAndroid,
    TouchableNativeFeedback,
} from 'react-native';
import Tts from 'react-native-tts';
import IoIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../../App';
import Card from '../../../component/Card';
import {COLORS} from '../../../constants';
import {useDatabase} from '../../../contexts/DatabaseContext';
import {useLoadingModal} from '../../../contexts/LoadingModalContext';
import {Word} from '../../../types';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Props = StackScreenProps<RootStackParamList, 'CategoryScreen'>;

const CategoryScreen = ({navigation, route}: Props) => {
    const {setLoading} = useLoadingModal();
    const {getWordsFromCategory} = useDatabase();
    const [query, setQuery] = React.useState<string>('');
    const [words, setWords] = React.useState<Word[]>([]);
    const [filteredWords, setFilteredWords] = React.useState<Word[]>([]);
    const category = route.params?.category;

    const speak = async (text: string) => {
        try {
            if (!text) return;
            await Tts.stop();
            await Tts.setDefaultVoice('en-GB-language');
            Tts.speak(text);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.LONG);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                // setLoading(true);
                const categoryWords = await getWordsFromCategory(category.id);
                setWords(categoryWords);
                setFilteredWords(categoryWords);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

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
                            {category.name}
                        </Text>
                    </View>
                </View>

                <View style={styles.bodyContainer}>
                    <Card style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                        <IoIcon name="search" size={25} color={COLORS.TEXT_GRAY} />
                        <TextInput
                            style={{fontSize: 17, flex: 1}}
                            placeholder="Tìm kiếm"
                            value={query}
                            onChangeText={text => {
                                setQuery(text);
                                if (text.length > 0) {
                                    setFilteredWords(
                                        words.filter(word => {
                                            return word.word.toLowerCase().includes(text.toLowerCase());
                                        }),
                                    );
                                } else {
                                    setFilteredWords(words);
                                }
                            }}
                            autoCapitalize="none"
                            cursorColor={COLORS.BACKGROUND_PRIMARY}
                        />
                        {query.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    setQuery('');
                                }}>
                                <IoIcon name="close" size={30} color={COLORS.TEXT_GRAY} />
                            </TouchableOpacity>
                        )}
                    </Card>

                    <View
                        style={{
                            flex: 1,
                            marginTop: 5,
                            marginBottom: 15,
                            borderRadius: 7,
                            backgroundColor: COLORS.BACKGROUND_WHITE,
                            elevation: 1,
                        }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {filteredWords.map((word, index) => {
                                return (
                                    <TouchableNativeFeedback
                                        key={word.word}
                                        onPress={() => {
                                            navigation.navigate('WordDetail', {word: word});
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                paddingVertical: 10,
                                                paddingHorizontal: 15,
                                                alignItems: 'center',
                                                borderBottomColor: COLORS.BORDER_GRAY,
                                                borderBottomWidth: index === words.length - 1 ? 0 : 0.7,
                                            }}>
                                            <View style={{marginRight: 'auto'}}>
                                                <Text style={{fontSize: 18, color: COLORS.TEXT_BLACK}}>
                                                    {word.word.length > 30 ? word.word.slice(0, 30) + '...' : word.word}
                                                </Text>
                                                <Text style={{fontSize: 15, color: COLORS.TEXT_GRAY}}>
                                                    {word.mean.length > 40 ? word.mean.slice(0, 40) + '...' : word.mean}
                                                </Text>
                                            </View>
                                            <TouchableHighlight
                                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                                                onPress={() => speak(word.word)}
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
                                        </View>
                                    </TouchableNativeFeedback>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CategoryScreen;

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
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 7,
    },
});
