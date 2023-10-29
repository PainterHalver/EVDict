import {View, TextInput, TouchableHighlight, Text, StyleSheet, ToastAndroid} from 'react-native';
import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {Word} from '../../types';
import {useState} from 'react';

interface Props {
    visible: boolean;
    onDismiss: () => void;
    word: Word;
}

const ErrorReportModal = ({visible, onDismiss, word}: Props) => {
    const [errorReportText, setErrorReportText] = useState<string>('');

    const dismissClearText = () => {
        setErrorReportText('');
        onDismiss();
    };

    const handleReport = () => {
        // Không cần quan tâm gửi được hay không, chỉ cần thông báo cảm ơn là đủ
        fetch('http://157.245.201.74:9001/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word: word.word,
                report: errorReportText,
            }),
        });

        ToastAndroid.show('Cảm ơn bạn đã gửi báo cáo lỗi!', ToastAndroid.SHORT);
        dismissClearText();
    };

    return (
        <MyModal visible={visible} onDismiss={dismissClearText}>
            <View style={styles.modal}>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>
                    Báo cáo từ: {word && word.word.length > 10 ? word.word.slice(0, 10) + '...' : word.word}
                </Text>
                <TextInput
                    style={{
                        backgroundColor: COLORS.BACKGROUND_WHITE_DARK,
                        height: 100,
                        borderRadius: 7,
                        paddingHorizontal: 10,
                        textAlignVertical: 'top',
                    }}
                    placeholder={'Giải thích lỗi...'}
                    value={errorReportText}
                    onChangeText={setErrorReportText}
                    cursorColor={COLORS.BACKGROUND_PRIMARY}
                    multiline
                />
                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: -15,
                        marginTop: 5,
                    }}>
                    <TouchableHighlight style={{flex: 1, borderBottomLeftRadius: 7}} onPress={dismissClearText}>
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
                    <TouchableHighlight style={{flex: 1, borderBottomRightRadius: 7}} onPress={handleReport}>
                        <View
                            style={{
                                backgroundColor: COLORS.BACKGROUND_PRIMARY,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 10,
                                borderBottomRightRadius: 7,
                            }}>
                            <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>Sửa</Text>
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

export default ErrorReportModal;
