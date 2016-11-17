/**
 * Created by amirhosssein on 10/30/16.
 */


function user_status_error(type, data) {
    var too = 1;
    chrome.storage.local.get({
        user_status: []
    }, function (items) {

        for (var item = 0; item < items.user_status.length; item++) {
            if (items.user_status[item]['type'] == type) {
                items.user_status[item]['data'] = data;
                too = 0;
                break;
            }
        }

        if (too == 1) {
            items.user_status.push({
                "type": type,
                "data": data
            });
        }
        chrome.storage.local.set({
            user_status: items.user_status
        }, function () {
        });
    });
}

function t(input) {
    if (input == 'Invalid token.') {
        input = 'ارتباط برقرار نمی‌باشد.';
        input += 'به ';
        input += '<a href="help.html">راهنما</a>';
        input += ' مراجعه فرمایید.'
    }
    return input
}

function html_user_status(user_status) {
    var info_all = '';
    for (var i = 0; i < user_status.length; i++) {
        info_all += '<div class="item"><i class="left triangle icon"></i>' + user_status[i]['data'] + '</div>'
    }


    return (info_all)
}

$(document).ready(function () {
    $('body').on('click', 'li a,.link', function () {
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});


function server_data(username, token, success_function) {
    $.ajax({
        type: 'GET',
        url: 'http://khabareman.com/api/news/' + username + '?format=json',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Token ' + token);
        },
        success: function (data, status, XMLHttpRequest) {
            user_status_error('connectionError', 'اتصال برقرار است.');
            success_function(data, status, XMLHttpRequest)
        },
        error: function (data, status, errorThrown) {
            if ('responseJSON' in data && 'detail' in data['responseJSON']) {
                user_status_error('connectionError', t(data['responseJSON']['detail']))
            }
        }
    });
}