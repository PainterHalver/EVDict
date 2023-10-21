import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
    Button,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableNativeFeedback,
    View,
} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome';
import {RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Word} from '../../types';
import SearchSuggestion from './SearchSuggestion';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({navigation}: Props) => {
    const {db, getWord, getWordsStartsWith} = useDatabase();
    const [query, setQuery] = React.useState<string>('');
    const [searchSuggestions, setSearchSuggestions] = React.useState<Word[]>([]);

    const querySubmitHandler = async (query: string) => {
        try {
            const result = await getWord(query);
            if (result) {
                navigation.navigate('WordDetail', {word: result});
            } else {
                // TODO: Không tìm thấy từ thì chuyển sang dùng màn google translate
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    useEffect(() => {
        if (query.length === 0) {
            return setSearchSuggestions([]);
        }

        const timeout = setTimeout(async () => {
            const result = await getWordsStartsWith(query, 20);

            if (result) {
                setSearchSuggestions(result);
            }
        }, 0);

        return () => {
            clearTimeout(timeout);
        };
    }, [query]);

    return (
        <View style={styles.containerWrapper}>
            <StatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'} animated={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View
                        style={{
                            paddingVertical: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                        }}>
                        <FontawesomeIcon name="book" size={30} color={COLORS.TEXT_WHITE} />
                        <Text
                            style={{
                                alignSelf: 'center',
                                color: '#fff',
                                fontSize: 25,
                                fontWeight: '500',
                            }}>
                            EV - Dictionary
                        </Text>
                    </View>
                    <View>
                        <View
                            style={{
                                marginHorizontal: 15,
                                paddingHorizontal: 15,
                                flexDirection: 'row',
                                backgroundColor: '#fff',
                                borderRadius: 100,
                                alignItems: 'center',
                                gap: 5,
                                position: 'relative',
                            }}>
                            <IoIcon name="md-search-sharp" size={25} color={COLORS.TEXT_GRAY} />
                            <TextInput
                                style={{fontSize: 17, flex: 1}}
                                placeholder="Nhập từ khóa tìm kiếm"
                                value={query}
                                onChangeText={setQuery}
                                onSubmitEditing={event => {
                                    querySubmitHandler(event.nativeEvent.text);
                                }}
                                autoCapitalize="none"
                                cursorColor={COLORS.BACKGROUND_PRIMARY_DARK}
                            />
                            {query.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setQuery('');
                                    }}>
                                    <IoIcon name="close" size={30} color={COLORS.TEXT_GRAY} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.bodyContainer}>
                    <View style={styles.function}>
                        <TouchableNativeFeedback
                            onPress={() => {
                                navigation.navigate('TranslateText', {});
                            }}>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text style={styles.functionName}>Dịch văn bản</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text style={styles.functionName}>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text style={styles.functionName}>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text style={styles.functionName}>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text style={styles.functionName}>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.dailyWordContainer}>
                        <TouchableNativeFeedback>
                            <View
                                style={{
                                    paddingVertical: 10,
                                    backgroundColor: 'lime',
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}>
                                <Text style={{fontSize: 20, fontWeight: '500'}}>Từ của ngày hôm nay</Text>
                                <Text style={{marginVertical: 20, fontSize: 18, fontWeight: '400'}}>Challenge</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <SearchSuggestion searchSuggestions={searchSuggestions} />
                </ScrollView>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_WHITE_DARK,
    },
    container: {
        flex: 1,
    },
    header: {
        height: 180,
        backgroundColor: COLORS.BACKGROUND_PRIMARY,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    bodyContainer: {
        flex: 1,
        // backgroundColor: '#123654',
        paddingVertical: 10,
    },
    function: {
        // backgroundColor: 'yellow',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    functionButton: {
        flexDirection: 'row',
        backgroundColor: 'cyan',
        padding: 15,
        borderRadius: 7,
        gap: 10,
        alignItems: 'center',
    },
    functionName: {
        fontSize: 18,
        fontWeight: '400',
    },
    dailyWordContainer: {
        // backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
});
