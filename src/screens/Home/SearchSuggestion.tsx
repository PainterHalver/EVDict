import {Text, StyleSheet, View, TouchableNativeFeedback, ScrollView} from 'react-native';
import React from 'react';
import {Word} from '../../types';
import {COLORS} from '../../constants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';

interface Props {
    searchSuggestions: Word[];
}

const SearchSuggestion = ({searchSuggestions}: Props) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
            {searchSuggestions.length > 0 &&
                searchSuggestions.map((item, index) => {
                    return (
                        <TouchableNativeFeedback
                            key={item.word}
                            onPress={() => {
                                navigation.navigate('WordDetail', {word: item});
                            }}>
                            <View
                                style={{
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                    borderBottomColor: '#00000044',
                                    borderBottomWidth: index === searchSuggestions.length - 1 ? 0 : 0.7,
                                    flexDirection: 'row',
                                }}>
                                <View>
                                    <Text style={{color: COLORS.TEXT_WHITE, fontSize: 18}}>
                                        {item.word.length > 25 ? item.word.slice(0, 25) + '...' : item.word}
                                    </Text>
                                    <Text style={{color: COLORS.TEXT_WHITE_BLUR, fontSize: 14}}>
                                        {item.mean.length > 40 ? item.mean.slice(0, 40) + '...' : item.mean}
                                    </Text>
                                </View>
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
        maxHeight: 500,
    },
});

export default SearchSuggestion;
