import {
    View,
    TextInput,
    TouchableHighlight,
    Text,
    StyleSheet,
    ScrollView,
    TouchableNativeFeedback,
    ToastAndroid,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {Category, Word} from '../../types';
import {useEffect, useState} from 'react';
import {useDatabase} from '../../contexts/DatabaseContext';
import {useLoadingModal} from '../../contexts/LoadingModalContext';

interface Props {
    visible: boolean;
    onDismiss: () => void;
    categories: Category[];
    word: Word;
    selectedCategories: number[];
    setSelectedCategories: (categories: number[]) => void;
}

const CategoryModal = ({visible, onDismiss, categories, word, selectedCategories, setSelectedCategories}: Props) => {
    const {setLoading} = useLoadingModal();
    const {addWordToCategories} = useDatabase();
    const [selectedCategoriesSnapshot, setSelectedCategoriesSnapshot] = useState<number[]>(selectedCategories);

    const handleAddToCategories = async () => {
        try {
            setLoading(true);
            await addWordToCategories(word.word, selectedCategories);
            setSelectedCategoriesSnapshot(selectedCategories);
            onDismiss();
            ToastAndroid.show('Sửa thành công', ToastAndroid.SHORT);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Có lỗi xảy ra', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    // Vì dismiss chứ không unmount nên sửa lại selectedCategories
    const dismissToSnapshot = () => {
        setSelectedCategories(selectedCategoriesSnapshot);
        onDismiss();
    };

    return (
        <MyModal visible={visible} onDismiss={dismissToSnapshot}>
            <View style={styles.modal}>
                <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>Chọn danh sách từ</Text>

                <View style={{maxHeight: 300}}>
                    <ScrollView>
                        {categories.map((item, index) => {
                            const isSelected = selectedCategories.includes(item.id);
                            const toggleSelection = () => {
                                if (isSelected) {
                                    setSelectedCategories(selectedCategories.filter(id => id !== item.id));
                                } else {
                                    setSelectedCategories([...selectedCategories, item.id]);
                                }
                            };

                            return (
                                <TouchableNativeFeedback key={item.id} onPress={toggleSelection}>
                                    <View
                                        style={{
                                            paddingVertical: 5,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 5,
                                        }}>
                                        <CheckBox value={isSelected} onValueChange={toggleSelection} />
                                        <Text style={{color: COLORS.TEXT_BLACK, fontSize: 17}}>
                                            {item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name}
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            );
                        })}
                    </ScrollView>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: -15,
                        marginTop: 5,
                    }}>
                    <TouchableHighlight style={{flex: 1, borderBottomLeftRadius: 7}} onPress={dismissToSnapshot}>
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
                    <TouchableHighlight style={{flex: 1, borderBottomRightRadius: 7}} onPress={handleAddToCategories}>
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

export default CategoryModal;
