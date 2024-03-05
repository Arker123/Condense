module.exports = {
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|eot|otf|webp|svg|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
    testEnvironment: 'jsdom',
};
