/**
 * Created by amirhosssein on 9/25/16.
 */

var username;
var password;
var status = 1;

function connect() {
    var all_data = [];
    chrome.storage.local.get({
        username: '',
        password: '',
        all_data: [],
        playing: 1
    }, function (items) {
        username = items.username;
        password = items.password;
        status = items.playing;
        all_data = items.all_data;
    });
    if (status == 0) {
        return false
    }

    $.get('http://django.soor.ir/chrome_extension/news/' + username + '?format=json', function (data, status) {
        if (data == 0) {

            chrome.storage.local.set({
                all_data: []
            }, function () {
            });
            return 0;
        }

        var i, j;

        var tekrar;

        for (i = 0; i < data.length; i++) {
            tekrar = 0;
            for (j = 0; j < all_data.length; j++) {
                if (data[i]['id'] == all_data[j]['id']) {
                    tekrar = 1;
                }
            }
            if (tekrar == 0) {
                all_data.push(data[i]);
            }

        }
        chrome.browserAction.setBadgeText({text: all_data.length + "+"});
        chrome.storage.local.set({
            all_data: all_data
        }, function () {
        });
    });
}


connect();
self.setInterval(function () {
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    connect()
}, 5000);
