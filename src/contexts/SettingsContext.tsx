import {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Settings = {
    shouldAutoPronounce: {
        value: boolean;
        label: string;
    };
};

type SettingsContextType = {
    settings: Settings;
    finishedLoadingSettings: boolean;
    updateSettings: (newSettings: Settings) => Promise<void>;
};

const DEFAULT_SETTINGS: Settings = {
    shouldAutoPronounce: {
        value: false,
        label: 'Tự động phát âm từ',
    },
};

const INITIAL_STATE: SettingsContextType = {
    settings: DEFAULT_SETTINGS,
    finishedLoadingSettings: false,
    updateSettings: () => Promise.resolve(),
};

const SettingsContext = createContext<SettingsContextType>(INITIAL_STATE);

export const SettingsProvider = ({children}: any) => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [finishedLoadingSettings, setFinishedLoadingSettings] = useState<boolean>(false);

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

    const updateSettings = async (newSettings: Settings) => {
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
                settings,
                finishedLoadingSettings,
                updateSettings,
            }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
