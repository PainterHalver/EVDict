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
} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import { COLORS } from '../constants';
import { useDatabase } from '../contexts/DatabaseContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Prop 1 là prop gần nhất, 2 là của parent
type Props = StackScreenProps<RootStackParamList>;

const Home = ({ navigation }: Props) => {
    const { db, getWord } = useDatabase();
    const [query, setQuery] = React.useState<string>('');

    const querySubmitHandler = async (query: string) => {
        try {
            const result = await getWord(query);
            if (result) {
                navigation.navigate('WordDetail', { word: result });
            } else {
                // TODO: Không tìm thấy từ thì chuyển sang dùng màn google translate
            }
        } catch (error) {
            console.log('ERROR: ', error);
        }
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
                    <View style={{ paddingVertical: 20 }}>
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
                            }}>
                            <IoIcon
                                name="md-search-sharp"
                                size={25}
                                color={COLORS.TEXT_GRAY}
                            />
                            <TextInput
                                style={{ fontSize: 17, flex: 1 }}
                                placeholder="Nhập từ khóa tìm kiếm"
                                value={query}
                                onChangeText={setQuery}
                                onSubmitEditing={event => {
                                    querySubmitHandler(event.nativeEvent.text);
                                }}
                                autoCapitalize="none"
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
                <View style={styles.bodyContainer}>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text>Function Name</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={styles.function}>
                        <TouchableNativeFeedback>
                            <View style={styles.functionButton}>
                                <Text>Icon</Text>
                                <Text>Function Name</Text>
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
                                <Text style={{ fontSize: 20, fontWeight: '500' }}>
                                    Từ của ngày hôm nay
                                </Text>
                                <Text
                                    style={{ marginVertical: 20, fontSize: 18, fontWeight: '400' }}>
                                    Challenge
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
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
        paddingTop: 10,
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
        borderRadius: 10,
        gap: 5,
    },
    dailyWordContainer: {
        // backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
});