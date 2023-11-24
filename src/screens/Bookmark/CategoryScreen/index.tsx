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
import CheckBox from '@react-native-community/checkbox';
import MyModal from '../../../component/MyModal';
import {useSettings} from '../../../contexts/SettingsContext';
import {speak} from '../../../utils/helpers';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Props = StackScreenProps<RootStackParamList, 'CategoryScreen'>;

const CategoryScreen = ({navigation, route}: Props) => {
    const {setLoading} = useLoadingModal();
    const {getWordsFromCategory, deleteWordsFromCategory} = useDatabase();
    const [query, setQuery] = React.useState<string>('');
    const [words, setWords] = React.useState<Word[]>([]);
    const [filteredWords, setFilteredWords] = React.useState<Word[]>([]);
    const category = route.params?.category;
    const [selectedWords, setSelectedWords] = React.useState<Word[]>([]);
    const [comfirmDeleteModalOpen, setComfirmDeleteModalOpen] = React.useState<boolean>(false);

    const {defaultPronunciation} = useSettings();

    const loadWords = async () => {
        try {
            const categoryWords = await getWordsFromCategory(category.id);
            setWords(categoryWords);
            setFilteredWords(categoryWords);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadWords();
    }, []);

    const handleDeleteSelectedWords = async () => {
        try {
            setLoading(true);
            await deleteWordsFromCategory(
                selectedWords.map(w => w.word),
                category.id,
            );
            setSelectedWords([]);
            await loadWords();
            ToastAndroid.show('Xóa thành công', ToastAndroid.LONG);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.LONG);
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
                            {filteredWords.length > 0 ? (
                                filteredWords.map((word, index) => {
                                    const isSelected = selectedWords.includes(word);
                                    const toggleSelection = () => {
                                        if (isSelected) {
                                            setSelectedWords(selectedWords.filter(item => item.word !== word.word));
                                        } else {
                                            setSelectedWords([...selectedWords, word]);
                                        }
                                    };

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
                                                    paddingRight: 15,
                                                    paddingLeft: 7,
                                                    gap: 7,
                                                    alignItems: 'center',
                                                    borderBottomColor: COLORS.BORDER_GRAY,
                                                    borderBottomWidth: index === words.length - 1 ? 0 : 0.7,
                                                }}>
                                                <CheckBox
                                                    value={isSelected}
                                                    onValueChange={toggleSelection}
                                                    hitSlop={{bottom: 20, left: 20, top: 20, right: 20}}
                                                />
                                                <View style={{marginRight: 'auto'}}>
                                                    <Text style={{fontSize: 18, color: COLORS.TEXT_BLACK}}>
                                                        {word.word.length > 30
                                                            ? word.word.slice(0, 30) + '...'
                                                            : word.word}
                                                    </Text>
                                                    <Text style={{fontSize: 15, color: COLORS.TEXT_GRAY}}>
                                                        {word.mean.length > 36
                                                            ? word.mean.slice(0, 36) + '...'
                                                            : word.mean}
                                                    </Text>
                                                </View>
                                                <TouchableHighlight
                                                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                    underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                                                    onPress={() => speak(word.word, defaultPronunciation)}
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
                                })
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: COLORS.TEXT_BLACK,
                                        paddingVertical: 10,
                                        paddingLeft: 15,
                                    }}>
                                    Không tìm thấy từ vựng nào
                                </Text>
                            )}
                        </ScrollView>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10}}>
                        <TouchableHighlight
                            onPress={() => {
                                if (selectedWords.length === filteredWords.length) {
                                    setSelectedWords([]);
                                } else {
                                    setSelectedWords(filteredWords);
                                }
                            }}
                            underlayColor={COLORS.BACKGROUND_PRIMARY_DARK}
                            style={[styles.controlButton, {backgroundColor: COLORS.BACKGROUND_PRIMARY}]}>
                            <Text style={{fontSize: 16, color: COLORS.TEXT_WHITE, fontWeight: '500'}}>
                                {selectedWords.length === filteredWords.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={() => setComfirmDeleteModalOpen(true)}
                            underlayColor={COLORS.RED_DARK}
                            disabled={selectedWords.length === 0}
                            style={[
                                styles.controlButton,
                                {backgroundColor: selectedWords.length === 0 ? COLORS.BUTTON_DISABLED : COLORS.RED},
                            ]}>
                            <Text style={{fontSize: 16, color: COLORS.TEXT_WHITE, fontWeight: '500'}}>Xóa</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>

            {/* Delete confirm modal */}
            <MyModal visible={comfirmDeleteModalOpen} onDismiss={() => setComfirmDeleteModalOpen(false)}>
                <View style={styles.modal}>
                    <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>
                        Xóa từ khỏi danh sách
                    </Text>
                    <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16, fontWeight: '400'}}>
                        Bạn có chắc chắn muốn xóa các từ đã chọn khỏi danh sách không?
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: -15,
                            marginTop: 5,
                        }}>
                        <TouchableHighlight
                            style={{flex: 1, borderBottomLeftRadius: 7}}
                            onPress={() => setComfirmDeleteModalOpen(false)}>
                            <View
                                style={{
                                    backgroundColor: COLORS.BACKGROUND_CANCEL_BUTTON,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                    borderBottomLeftRadius: 7,
                                }}>
                                <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>Hủy</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{flex: 1, borderBottomRightRadius: 7}}
                            onPress={() => {
                                handleDeleteSelectedWords();
                                setComfirmDeleteModalOpen(false);
                            }}>
                            <View
                                style={{
                                    backgroundColor: COLORS.RED,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                    borderBottomRightRadius: 7,
                                }}>
                                <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>Xóa</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </MyModal>
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
    controlButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        paddingVertical: 10,
    },
    modal: {
        width: '80%',
        backgroundColor: COLORS.BACKGROUND_WHITE,
        padding: 15,
        paddingBottom: 0,
        borderRadius: 7,
        gap: 10,
        elevation: 5,
    },
});
