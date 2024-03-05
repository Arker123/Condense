module.exports = {
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|eot|otf|webp|svg|mp4|webm|wav|mp3|mnpx jest4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
        '@fortawesome/react-fontawesome':
        '<rootDir>/__mocks__/react-fontawesome.js', // Add this line to mock FontAwesome
    },
    testEnvironment: 'jsdom',
};

