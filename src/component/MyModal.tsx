import {Modal, ModalProps, Pressable, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

const MyModal = (props: ModalProps) => {
    return (
        <Modal animationType="fade" transparent={true} {...props} statusBarTranslucent={true}>
            <TouchableWithoutFeedback onPress={props.onDismiss}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback>{props.children}</TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
});

export default MyModal;
