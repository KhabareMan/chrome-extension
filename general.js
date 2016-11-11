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
        input += 'جهت استفاده از این افزونه می‌بایست از طریق ';
        input += '<a href="https://telegram.me/khabaremanbot" class="link">روبات تلگرام خبرِمن</a>';
        input += ' با وارد کردن دستور ';
        input += '<a style="direction:ltr;"> chrome/ </a>';
        input += ' اقدام به دریافت نام کاربری و توکن نمایید.'
    }
    return input
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function html_user_status(user_status) {
    var info_all = '';
    for (var i = 0; i < user_status.length; i++) {
        info_all += '<div class="item">' + user_status[i]['data'] + '</div>'
    }


    return (info_all)
}

$(document).ready(function () {
    $('body').on('click', 'li a,.link', function () {
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});
