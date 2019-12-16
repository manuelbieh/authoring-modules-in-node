module.exports = {
    presets: [
        [
            '@babel/env',
            {
                modules: false,
            },
        ],
        '@babel/typescript',
    ],
    env: {
        modern: {
            presets: [
                [
                    '@babel/env',
                    {
                        modules: false,
                        targets: {
                            node: '13',
                        },
                    },
                ],
                '@babel/typescript',
            ],
            plugins: [require('./scripts/babel-mjs.cjs')],
        },
    },
};
