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
import {BooleanSettings as SettingsType, useSettings} from '../../contexts/SettingsContext';
import ReportModal from './ReportModal';
import StatisticsModal from './StatisticsModal';
import AboutUsModal from './AboutUsModal';
import {triggerTranslate} from '../../utils/helpers';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const Settings = ({navigation, route}: Props) => {
    const {booleanSettings, updateBooleanSettings, defaultPronunciation, setDefaultPronunciation} = useSettings();
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const [showContactModal, setShowContactModal] = useState<boolean>(false);
    const [showAboutUSModal, setShowAboutUSModal] = useState<boolean>(false);

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
                        {Object.keys(booleanSettings).map((key, index) => {
                            const [isSelected, setIsSelected] = useState<boolean>(
                                Object.values(booleanSettings)[index].value as boolean,
                            );
                            const toggleSelection = async () => {
                                // Testing
                                if (key === 'offlineTextTranslation' && !isSelected) {
                                    triggerTranslate();
                                }

                                setIsSelected(!isSelected);
                                updateBooleanSettings({
                                    ...booleanSettings,
                                    [key]: {...booleanSettings[key as keyof SettingsType], value: !isSelected},
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
                                                        index === Object.keys(booleanSettings).length - 1 ? 0 : 0.7,
                                                },
                                            ]}>
                                            <Text style={[styles.settingText, {marginRight: 'auto'}]}>
                                                {Object.values(booleanSettings)[index].label}
                                            </Text>
                                            <CheckBox value={isSelected} onValueChange={toggleSelection} />
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            );
                        })}
                    </View>

                    <View style={styles.settingsContainer}>
                        <View
                            style={[
                                {
                                    paddingVertical: 15,
                                    paddingHorizontal: 15,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 5,
                                },
                            ]}>
                            <View style={{marginRight: 'auto'}}>
                                <Text style={styles.settingText}>Phát âm mặc định</Text>
                            </View>
                            <CheckBox
                                value={defaultPronunciation === 'UK'}
                                onValueChange={() => setDefaultPronunciation('UK')}
                            />
                            <Text style={styles.settingText}>UK</Text>

                            <CheckBox
                                value={defaultPronunciation === 'US'}
                                onValueChange={() => setDefaultPronunciation('US')}
                            />
                            <Text style={styles.settingText}>US</Text>
                        </View>
                    </View>

                    <View style={styles.settingsContainer}>
                        <TouchableNativeFeedback onPress={() => setShowReportModal(true)}>
                            <View style={styles.settingContainer}>
                                <View style={[styles.settingContent, {borderBottomWidth: 0.7}]}>
                                    <Text style={styles.settingText}>Báo lỗi hoặc gợi ý</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={() => setShowContactModal(true)}>
                            <View style={styles.settingContainer}>
                                <View style={[styles.settingContent, {borderBottomWidth: 0.7}]}>
                                    <Text style={styles.settingText}>Thống kê</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={() => setShowAboutUSModal(true)}>
                            <View style={styles.settingContainer}>
                                <View style={[styles.settingContent]}>
                                    <Text style={styles.settingText}>Về chúng tôi</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>

            <ReportModal
                visible={showReportModal}
                onDismiss={() => {
                    setShowReportModal(false);
                }}
            />

            <StatisticsModal
                visible={showContactModal}
                onDismiss={() => {
                    setShowContactModal(false);
                }}
            />

            <AboutUsModal
                visible={showAboutUSModal}
                onDismiss={() => {
                    setShowAboutUSModal(false);
                }}
            />
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
