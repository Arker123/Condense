document.querySelector('#sign-in').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response === 'success') window.close();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('button');
    if (button) {
        button.addEventListener('click', function () {
            console.log('Button was clicked!');
        });
    }
});
