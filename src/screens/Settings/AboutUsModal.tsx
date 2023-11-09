import {View, TextInput, TouchableHighlight, Text, StyleSheet, ToastAndroid} from 'react-native';
import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {Word} from '../../types';
import {useState} from 'react';

interface Props {
    visible: boolean;
    onDismiss: () => void;
}

const CONTENT_FONT_SIZE = 15.2;

const AboutUsModal = ({visible, onDismiss}: Props) => {
    return (
        <MyModal visible={visible} onDismiss={onDismiss}>
            <View style={styles.modal}>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>Ứng dụng từ điển EVDict</Text>

                <Text style={{color: COLORS.TEXT_BLACK, fontSize: CONTENT_FONT_SIZE}}>
                    Môn học: Chuyên đề Công nghệ Nhật Bản
                </Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: CONTENT_FONT_SIZE}}>Mã môn học: INT3138_1</Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: CONTENT_FONT_SIZE}}>Họ và tên: Đào Đức Hiệp</Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: CONTENT_FONT_SIZE}}>Mã sinh viên: 20020259</Text>

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

export default AboutUsModal;
