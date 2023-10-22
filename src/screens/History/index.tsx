// @refresh reset

import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {LogBox, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';
import Card from '../../component/Card';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import {Word} from '../../types';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Props = StackScreenProps<RootStackParamList, 'History'>;

const History = ({navigation, route}: Props) => {
    const {setLoading} = useLoadingModal();
    const {getHistory} = useDatabase();
    const [query, setQuery] = React.useState<string>('');
    const [history, setHistory] = React.useState<Word[]>([]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const history = await getHistory();
                setHistory(history);
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
                            Từ đã tra
                        </Text>
                    </View>
                </View>

                <View style={styles.bodyContainer}>
                    <Card style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                        <IoIcon name="md-search-sharp" size={25} color={COLORS.TEXT_GRAY} />
                        <TextInput
                            style={{fontSize: 17, flex: 1}}
                            placeholder="Tìm kiếm"
                            value={query}
                            onChangeText={setQuery}
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
                </View>
            </View>
        </View>
    );
};

export default History;

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
