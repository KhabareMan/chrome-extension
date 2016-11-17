/**
 * Created by amirhosssein on 9/25/16.
 */

var username;
var token;
var status = 1;
var user_status = [];

function chrome_notification(data) {
    var iid;
    var opt = {
        type: "basic",
        title: 'خبر‌جدید!',
        message: data['title'],
        contextMessage: data['agency'],
        iconUrl: 'images/icon128.png',
        buttons: [{
            title: "برو به خبر"
        }]
    };
    chrome.notifications.create("", opt, function (id) {
        iid = id;
    });
    chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
        if (notifId == iid) {
            if (btnIdx == 0) {
                chrome.tabs.create({url: data['link']});
                chrome.notifications.clear(notifId, function () {
                });
            }
        }
    });
}


function chrome_notification_list(data) {
    var iid;
    var i;
    var itemha = [];
    for (i = 0; i < data.length; i++) {
        itemha.push({title: data[i]['agency'], message: data[i]['title']})
    }
    var opt = {
        type: "list",
        title: 'خبرهای ‌جدید!',
        message: '',
        items: itemha,
        iconUrl: 'images/icon128.png'
    };
    chrome.notifications.create("", opt, function (id) {
        iid = id;
    });
}


function chrome_notification_bulk(data) {
    var i;
    chrome.storage.local.get({
        notifing: 1
    }, function (items) {

        if (items.notifing == 0)
            return 0;

        if (data.length < 3) {
            for (i = 0; i < data.length; i++) {
                chrome_notification(data[i])
            }
        }
        else {
            chrome_notification_list(data)
        }
    });
}


function connect() {
    var all_data = [];
    var new_data = [];
    chrome.storage.local.get({
        username: '',
        token: '',
        all_data: [],
        playing: 1,
        user_status: []
    }, function (items) {
        username = items.username;
        token = items.token;
        status = items.playing;
        all_data = items.all_data;
        user_status = items.user_status
    });
    if (status == 0) {
        return false
    }
    server_data(username, token, function (data, status, XMLHttpRequest) {
            var i, j, tekrar;

            for (i = 0; i < data.length; i++) {
                tekrar = 0;
                for (j = 0; j < all_data.length; j++) {
                    if (data[i]['id'] == all_data[j]['id']) {
                        tekrar = 1;
                    }
                }
                if (tekrar == 0) {
                    all_data.push(data[i]);
                    new_data.push(data[i]);
                }
            }
            chrome_notification_bulk(new_data);
            new_data = [];
            chrome.browserAction.setBadgeText({text: all_data.length + "+"});
            chrome.storage.local.set({
                all_data: all_data
            }, function () {
            });
        }
    )
}


connect();
self.setInterval(function () {
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    connect()
}, 10000);
