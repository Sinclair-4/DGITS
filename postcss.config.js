const cssnano = require('cssnano');
const cssImport = require('postcss-import');

module.exports = {
    plugins: [
        cssnano({
            preset: 'default',
        }),

        cssImport(),
    ],
};