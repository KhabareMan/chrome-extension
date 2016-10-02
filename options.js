var username;
var password;
var valid = 1;

function save_options() {
    username = document.getElementById('username-form').value;
    password = document.getElementById('password-form').value;
    valid = 1;
    $.get('http://django.soor.ir/chrome_extension/news/' + username + '?format=json', function (data, status) {
        console.debug(data)
        if (data == 0) {
            valid = 0;
        }
        console.debug(valid);
        chrome.storage.local.set({
            username: username,
            password: password,
            validation: valid,
            all_data: []
        }, function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            if (valid == 1) {
                status.innerHTML = '<div class="ui compact success message"><i class="close icon"></i><div class="header"> مشخصات ' +
                    username + ' ثبت شد.' + '</div></div>';
            }
            else {
                status.innerHTML = '<div class="ui compact negative message"><i class="close icon"></i> <div class="header">'
                    + 'اطلاعات ورودی معتبر نمی باشند.' + '</div></div>';
            }
            $('.message .close').on('click', function () {
                $(this)
                    .closest('.message')
                    .transition('fade')
                ;
            });
        });
    });
}

function restore_options() {
    document.getElementById('submit').addEventListener('click',
        save_options);

    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        username: '',
        password: ''
    }, function (items) {
        username = items.username;
        password = items.password;
        document.getElementById('username-form').value = items.username;
        document.getElementById('password-form').value = items.password;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

