var username;
var token;
var valid = 1;

function save_options() {
    username = document.getElementById('username-form').value;
    token = document.getElementById('token-form').value;
    valid = 1;
    chrome.storage.local.set({
            username: username,
            token: token,
            validation: valid,
            all_data: []
        }, function () {
        }
    );
    server_data(username, token, function (data, status, XMLHttpRequest) {
        chrome.storage.local.get({
            user_status: []
        }, function (items) {
            document.getElementById('user-status').innerHTML = html_user_status(items.user_status)
        });
    })

}

function restore_options() {
    document.getElementById('submit').addEventListener('click',
        save_options);
    document.getElementById('button-return').addEventListener('click',
        function (event) {
            window.location.href = 'popup.html'
        });


    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        username: '',
        token: '',
        user_status: []
    }, function (items) {
        username = items.username;
        token = items.token;
        document.getElementById('username-form').value = items.username;
        document.getElementById('token-form').value = items.token;
        document.getElementById('user-status').innerHTML = html_user_status(items.user_status)
    });

    self.setInterval(function () {
        chrome.storage.local.get({
            user_status: []
        }, function (items) {
            document.getElementById('user-status').innerHTML = html_user_status(items.user_status)
        });
    }, 1000);

}

document.addEventListener('DOMContentLoaded', restore_options);

