// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var URL = 'http://django.soor.ir/chrome_extension/news/1?format=json'
var username;
var password;
var all_data;
var marks;
var iplaying;
var valid;
var user_welcome = 1;
var notifing;


function news_template(item) {
    var date = new Date(item['published_date']);
    var today = new Date();
    var diffMins = Math.round((today - date) / 60000); // minutes

    var ret = '<div class="item"><i class="triangle left red rss icon"></i>';
    ret += '<div class="content">';
    ret += '<h4 class="header">';
    ret += item['title'];
    ret += '</h4>';


    ret += '<div class="description">';
    ret += '<div class="news-details">';
    ret += '<span class="news-time t' + item['id'] + '">' + diffMins + '</span>';
    ret += "دقیقه‌ی پیش توسط " + item['agency'] + '</div>';
    ret += item['summary'];
    ret += '<span class="news-link"> <a class="link" href="' + item['link'] + '">' + 'برو به خبر' + '</a></span>'
    ret += '</div></div></div>';
    return ret
}



function check_login() {
    chrome.storage.local.get({
        username: '',
        password: '',
        all_data: [],
        hist_mark: [],
        validation: 1,
        user_status: [],
    }, function (items) {
        username = items.username;
        password = items.password;
        all_data = items.all_data;
        valid = items.validation;
        marks = items.hist_mark;
        if (username.length > 0 && valid) {
            if (user_welcome) {
                // document.getElementById('change-user').innerHTML = '<div class="ui success message"><i class="close icon"></i><div class="header"> کاربر ' +
                //     username + ' وارد شده است.' + '</div></div>';
                $('.message .close').on('click', function () {
                    $(this)
                        .closest('.message')
                        .transition('fade')
                    ;
                });
                user_welcome = 0;
            }
            if (all_data.length > 0) {

                var results = '';
                all_data.sort(
                    function (a, b) {
                        return new Date(b['published_date']).getTime() - new Date(a['published_date']).getTime()
                    });
                for (var i = 0; i < all_data.length; i++) {
                    if ($.inArray(all_data[i]['id'], marks) == -1) {
                        results += news_template(all_data[i]);
                        marks.push(all_data[i]['id'])
                    }
                }
                var prior = document.getElementById('results').innerHTML;

                document.getElementById('results').innerHTML = results + prior;
                $('.ui.accordion').accordion();
                chrome.storage.local.set({
                    hist_mark: marks,
                    user_welcome: user_welcome
                }, function () {
                });
            }

        }

        document.getElementById('user-status').innerHTML = html_user_status(items.user_status)
    });
}

function periodic_check_login() {
    chrome.storage.local.set({
        hist_mark: []
    }, function () {
    });
    check_login();
    self.setInterval(function () {
        check_login()
    }, 10000);

    self.setInterval(function () {
        chrome.storage.local.get({
            user_status: []
        }, function (items) {
            document.getElementById('user-status').innerHTML = html_user_status(items.user_status)
        });
    }, 5000);
}

document.addEventListener('DOMContentLoaded', periodic_check_login);


document.addEventListener('DOMContentLoaded', function () {
    user_welcome = 1;
    chrome.storage.local.get({
        playing: 1,
        user_welcome: 1,
        notifing: 1
    }, function (items) {
        user_welcome = items.user_welcome;
        notifing = items.notifing;
        iplaying = items.playing;
        if (iplaying == 1) {
            $('#button-play i').addClass('pause')
        }
        else {
            $('#button-play i').addClass('play');
            $('i.loading').addClass('hide')
        }

        if (notifing == 0) {
            $('#button-notif i').addClass('mute')
        }

    });


    // Settings button
    var setting = document.getElementById('button-setting');
    setting.addEventListener('click', function () {
        window.location.href = 'options.html';
    });

    // Settings button
    var setting = document.getElementById('button-help');
    setting.addEventListener('click', function () {
        window.location.href = 'help.html';
    });


    // Clear history button
    var history = document.getElementById('button-history');

    history.addEventListener('click', function () {
        all_data = [];
        chrome.storage.local.set({
            all_data: all_data
        }, function () {
            document.getElementById('results').innerHTML = ' ';
        });
        check_login()

    });


    // Play/Pause button
    var pl = document.getElementById('button-play');
    pl.addEventListener('click', function () {
        $('#button-play i').toggleClass('play');
        $('#button-play i').toggleClass('pause');
        if (iplaying == 1) {
            iplaying = 0;
            $('i.loading').addClass('hide')
        }
        else {
            iplaying = 1
            $('i.loading').removeClass('hide')
        }
        chrome.storage.local.set({
            playing: iplaying
        }, function () {
        });
    });


    // Play/Pause button
    var not = document.getElementById('button-notif');
    not.addEventListener('click', function () {
        $('#button-notif i').toggleClass('mute');

        if (notifing == 1) {
            notifing = 0;
        }
        else {
            notifing = 1
        }
        chrome.storage.local.set({
            notifing: notifing
        }, function () {
        });
    });

});