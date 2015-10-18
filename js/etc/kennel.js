Cryptodog.storage = {}

$(window).ready(function () {
    'use strict';

    // TODO: Actually handle errrors
    function StripError(err, val) {
        if (err) {
            console.log("Error reading storage, returning null")
            return null
        }
        return val
    }

    localforage.config()

    // Cryptodog Storage API
    // This API uses different local storage solutions,
    // depending on the browser engine, to offer a uniform
    // storage interface for Cryptodog user preferences and settings.

    // How to use:
    // Cryptodog.storage.setItem(itemName, itemValue)
    // Sets itemName's value to itemValue.

    // Cryptodog.storage.getItem(itemName, callbackFunction(result))
    // Gets itemName's value from local storage, and passes it to
    // the callback function as result.

    // Cryptodog.storage.removeItem(itemName)
    // Removes itemName and its value from local storage.

    // Define the wrapper, depending on our browser or environment.
    Cryptodog.storage = (function () {
        // let localForage handle browser detection, etc
        return {
            setItem: function(key, val) {
                localforage.setItem(key, val, function(err, result) {
                    if (err) {
                        console.log("error when setting item in localForage")
                    }
                })
            },
            getItem: function(key, callback) {
                return localforage.getItem(key, function (err, val) {
                    if (err) {
                        console.log("An error occurred during localStorage read.")
                        return null
                    }
                    callback(val)
                })
            },
            removeItem: function(key) {
                localforage.removeItem(key, function(thing) {
                    console.log("removed item from storage")
                })
            }
        }
    })()

    // Initialize language settings.
    Cryptodog.storage.getItem('language', function (key) {
        if (key) {
            Cryptodog.locale.set(key, true)
        }
        else {
            Cryptodog.locale.set(window.navigator.language.toLowerCase())
        }
    })

    // Load custom server settings
    Cryptodog.storage.getItem('serverName', function (key) {
        if (key) { Cryptodog.serverName = key }
    })
    Cryptodog.storage.getItem('domain', function (key) {
        if (key) { Cryptodog.xmpp.domain = key }
    })
    Cryptodog.storage.getItem('conferenceServer', function (key) {
        if (key) { Cryptodog.xmpp.conferenceServer = key }
    })
    Cryptodog.storage.getItem('relay', function (key) {
        if (key) { Cryptodog.xmpp.relay = key }
    })
    Cryptodog.storage.getItem('customServers', function (key) {
        if (key) {
            $('#customServerSelector').empty()
            var servers = $.parseJSON(key)
            $.each(servers, function (name) {
                $('#customServerSelector').append(
                    Mustache.render(Cryptodog.templates['customServer'], {
                        name: name,
                        domain: servers[name]['domain'],
                        XMPP: servers[name]['xmpp'],
                        Relay: servers[name]['relay']
                    })
                )
            })
        }
    })

    // Load nickname settings.
    Cryptodog.storage.getItem('myNickname', function (key) {
        if (key) {
            $('#nickname').animate({ 'color': 'transparent' }, function () {
                $(this).val(key)
                $(this).animate({ 'color': '#FFF' })
            })
        }
    })

    // Load notification settings.
    window.setTimeout(function () {
        Cryptodog.storage.getItem('desktopNotifications', function (key) {
            if (key === 'true') {
                $('#notifications').click()
                $('#utip').hide()
            }
        })
        Cryptodog.storage.getItem('audioNotifications', function (key) {
            if ((key === 'true') || !key) {
                $('#audio').click()
                $('#utip').hide()
            }
        })
    }, 800)

})