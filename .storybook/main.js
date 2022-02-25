module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions"
    ],
    framework: "@storybook/react",
    features: {
        babelModeV7: true,
    },
    webpackFinal: async (config, { configType }) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
        });

        return config;
    }
}