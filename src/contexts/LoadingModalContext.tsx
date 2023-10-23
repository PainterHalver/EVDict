import React, {createContext, useContext} from 'react';
import {Modal, View, ActivityIndicator, StyleSheet} from 'react-native';
import {COLORS} from '../constants';

export type LoadingModalContextType = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

const LoadingModalContext = createContext<LoadingModalContextType>({
    loading: false,
    setLoading: () => {},
});

export const LoadingModalProvider = ({children}: any) => {
    const [loading, setLoading] = React.useState<boolean>(false);

    return (
        <LoadingModalContext.Provider
            value={{
                loading,
                setLoading,
            }}>
            {children}
            <LoadingModal loading={loading} setLoading={setLoading} />
        </LoadingModalContext.Provider>
    );
};

export const useLoadingModal = () => useContext(LoadingModalContext);

type LoadingModalProps = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
};
const LoadingModal = ({loading, setLoading}: LoadingModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={loading}
            onRequestClose={() => {
                // setLoading(false);
            }}
            statusBarTranslucent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator size="large" color={COLORS.BACKGROUND_PRIMARY} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#ffffff',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});
