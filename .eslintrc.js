module.exports = {
    extends: ['airbnb-typescript/base'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        'lines-between-class-members': [
            'error',
            'always',
            { 'exceptAfterSingleLine': true },
          ]
    }
};