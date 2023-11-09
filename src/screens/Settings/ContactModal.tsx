import {View, TextInput, TouchableHighlight, Text, StyleSheet, ToastAndroid, Linking} from 'react-native';
import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {Word} from '../../types';
import {useState} from 'react';

interface Props {
    visible: boolean;
    onDismiss: () => void;
}

const ContactModal = ({visible, onDismiss}: Props) => {
    return (
        <MyModal visible={visible} onDismiss={onDismiss}>
            <View style={styles.modal}>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>Liên hệ</Text>

                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16}}>Email hỗ trợ: support@evdict.local</Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16}}>Số điện thoại: 19001001</Text>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16}}>
                    Github:{' '}
                    <Text
                        style={{color: '#0000FF', fontSize: 16, textDecorationLine: 'underline'}}
                        onPress={() => Linking.openURL('https://github.com/PainterHalver/EVDict')}>
                        PainterHalver/EVDict
                    </Text>
                    <Text />
                </Text>

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

export default ContactModal;
