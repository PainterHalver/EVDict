import {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BooleanSettings = {
    shouldAutoPronounce: {
        value: boolean;
        label: string;
    };
    offlineTextTranslation: {
        value: boolean;
        label: string;
    };
};

type SettingsContextType = {
    booleanSettings: BooleanSettings;
    defaultPronunciation: 'UK' | 'US';
    finishedLoadingSettings: boolean;
    updateBooleanSettings: (newSettings: BooleanSettings) => Promise<void>;
    setDefaultPronunciation: (pronunciation: 'UK' | 'US') => void;
};

const DEFAULT_BOOLEAN_SETTINGS: BooleanSettings = {
    shouldAutoPronounce: {
        value: false,
        label: 'Tự động phát âm từ',
    },
    offlineTextTranslation: {
        value: false,
        label: 'Dịch văn bản offline (Alpha)',
    },
};

const INITIAL_STATE: SettingsContextType = {
    booleanSettings: DEFAULT_BOOLEAN_SETTINGS,
    defaultPronunciation: 'UK',
    finishedLoadingSettings: false,
    updateBooleanSettings: () => Promise.resolve(),
    setDefaultPronunciation: () => Promise.resolve(),
};

const SettingsContext = createContext<SettingsContextType>(INITIAL_STATE);

export const SettingsProvider = ({children}: any) => {
    const [settings, setSettings] = useState<BooleanSettings>(DEFAULT_BOOLEAN_SETTINGS);
    const [finishedLoadingSettings, setFinishedLoadingSettings] = useState<boolean>(false);
    const [defaultPronunciation, setDefaultPronunciation] = useState<'UK' | 'US'>('UK');

    useEffect(() => {
        // Load nếu đã lưu persistent trong AsyncStorage, còn không dùng default
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('settings');
                if (storedSettings) {
                    setSettings(JSON.parse(storedSettings));
                }
            } catch (e) {
                console.error('Failed to load settings', e);
            } finally {
                setFinishedLoadingSettings(true);
            }
        };
        loadSettings();
    }, []);

    const updateSettings = async (newSettings: BooleanSettings) => {
        try {
            setSettings(newSettings);
            await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
        } catch (e) {
            console.error('Failed to save settings', e);
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                booleanSettings: settings,
                defaultPronunciation,
                finishedLoadingSettings,
                updateBooleanSettings: updateSettings,
                setDefaultPronunciation,
            }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
