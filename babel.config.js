module.exports = function (api) {
    const isProduction = api.env('production');

    const presets = ['module:metro-react-native-babel-preset'];

    const plugins = ['react-native-reanimated/plugin'];

    if (isProduction) {
        plugins.push('transform-remove-console');
    }

    return {
        presets,
        plugins,
    };
};
