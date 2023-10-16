import {
    Text,
    StyleSheet,
    View,
    TouchableNativeFeedback,
    ScrollView,
} from 'react-native';
import React from 'react';
import { Word } from '../../types';
import { COLORS } from '../../constants';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';

interface Props {
    searchSuggestions: Word[];
}

const SearchSuggestion = ({ searchSuggestions }: Props) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <ScrollView style={styles.container}>
            {searchSuggestions.length > 0 &&
                searchSuggestions.map((item, index) => {
                    return (
                        <TouchableNativeFeedback
                            key={item.word}
                            onPress={() => {
                                navigation.navigate('WordDetail', { word: item });
                            }}>
                            <View
                                style={{
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    borderBottomColor: '#00000044',
                                    borderBottomWidth:
                                        index === searchSuggestions.length - 1 ? 0 : 1,
                                    flexDirection: 'row',
                                }}>
                                <Text style={{ color: COLORS.TEXT_WHITE, fontSize: 16 }}>
                                    {item.word}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    );
                })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.BACKGROUND_PRIMARY_DARK,
        borderRadius: 2,
        position: 'absolute',
        left: 25,
        right: 25,
        top: -10,
        zIndex: 100,
    },
});

export default SearchSuggestion;