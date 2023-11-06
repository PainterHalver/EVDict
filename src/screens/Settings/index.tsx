import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
    LogBox,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import CheckBox from '@react-native-community/checkbox';
import {Settings as SettingsType, useSettings} from '../../contexts/SettingsContext';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const Settings = ({navigation, route}: Props) => {
    const {settings, updateSettings} = useSettings();

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
                            Cài đặt
                        </Text>
                    </View>
                </View>

                <View style={styles.bodyContainer}>
                    <View style={styles.settingsContainer}>
                        {Object.keys(settings).map((key, index) => {
                            const [isSelected, setIsSelected] = useState<boolean>(
                                Object.values(settings)[index].value as boolean,
                            );
                            const toggleSelection = () => {
                                setIsSelected(!isSelected);
                                updateSettings({
                                    ...settings,
                                    [key]: {...settings[key as keyof SettingsType], value: !isSelected},
                                });
                            };

                            return (
                                <TouchableNativeFeedback key={index} onPress={toggleSelection}>
                                    <View style={styles.settingContainer}>
                                        <View
                                            style={[
                                                styles.settingContent,
                                                {
                                                    borderBottomWidth:
                                                        index === Object.keys(settings).length - 1 ? 0 : 0.7,
                                                },
                                            ]}>
                                            <CheckBox value={isSelected} onValueChange={toggleSelection} />
                                            <Text style={styles.settingText}>
                                                {Object.values(settings)[index].label}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            );
                        })}
                    </View>

                    <View style={styles.settingsContainer}>
                        <TouchableNativeFeedback>
                            <View style={styles.settingContainer}>
                                <View style={[styles.settingContent, {borderBottomWidth: 0.7}]}>
                                    <Text style={styles.settingText}>Báo lỗi hoặc gợi ý</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback>
                            <View style={styles.settingContainer}>
                                <View style={[styles.settingContent, {borderBottomWidth: 0.7}]}>
                                    <Text style={styles.settingText}>Liên hệ</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback>
                            <View style={styles.settingContainer}>
                                <View style={[styles.settingContent]}>
                                    <Text style={styles.settingText}>Về chúng tôi</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Settings;

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
        paddingVertical: 15,
        paddingHorizontal: 10,
        gap: 15,
    },
    settingsContainer: {
        borderRadius: 7,
        backgroundColor: COLORS.BACKGROUND_WHITE,
        flexDirection: 'column',
        elevation: 2,
        overflow: 'hidden',
    },
    settingContainer: {
        paddingHorizontal: 15,
    },
    settingContent: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderBottomColor: COLORS.BACKGROUND_PRIMARY,
    },
    settingText: {
        color: COLORS.TEXT_BLACK,
        fontSize: 17,
    },
});
