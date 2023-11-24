import {View, TextInput, TouchableHighlight, Text, StyleSheet, ToastAndroid, Linking} from 'react-native';
import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {Statistics, Word} from '../../types';
import {useEffect, useState} from 'react';
import {useDatabase} from '../../contexts/DatabaseContext';

interface Props {
    visible: boolean;
    onDismiss: () => void;
}

const StatisticsModal = ({visible, onDismiss}: Props) => {
    const [stats, setStats] = useState<Statistics | null>();
    const {getStatistics} = useDatabase();

    useEffect(() => {
        (async () => {
            setStats(await getStatistics());
        })();
    }, [visible]);

    return (
        <MyModal visible={visible} onDismiss={onDismiss}>
            <View style={styles.modal}>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>Thống kê</Text>

                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16}}>
                    Tổng số từ đã tra: {stats?.wordSearchedCount}
                </Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16}}>
                    Số lượng danh sách từ vựng: {stats?.categoryCount}
                </Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16}}>Tổng số từ đã lưu: {stats?.savedWordCount}</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: -15,
                        marginTop: 5,
                    }}>
                    <TouchableHighlight style={{flex: 1, borderBottomRightRadius: 7}} onPress={onDismiss}>
                        <View
                            style={{
                                backgroundColor: COLORS.BACKGROUND_PRIMARY,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 10,
                                borderBottomRightRadius: 7,
                            }}>
                            <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>OK</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </MyModal>
    );
};

const styles = StyleSheet.create({
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

export default StatisticsModal;
