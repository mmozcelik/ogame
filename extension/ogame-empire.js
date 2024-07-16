var fn = function () {
    'use strict';
    window.zoro = window.zoro || {};
    if (document.location.href.indexOf('empire') === -1) {
        return;
    }

    if (location.href.indexOf('lobby') !== -1 || document.location.href.indexOf('showAll') !== -1) {
        return
    }

    function parseResource(planetElement, selector) {
        return parseInt(planetElement.find(selector).text().replaceAll('.', ''))
    }

    $('#items').hide();
    $('.planetWrapper .planet > div:nth-child(2)').hide()
    $('.planetWrapper .planet > div:nth-child(3)').hide()

    $('#storage').hide();
    $('.planetWrapper .planet > div:nth-child(6)').hide()
    $('.planetWrapper .planet > div:nth-child(7)').hide()

    $('#supply').hide();
    $('.planetWrapper .planet > div:nth-child(8)').hide()
    $('.planetWrapper .planet > div:nth-child(9)').hide()

    $('#station').hide();
    $('.planetWrapper .planet > div:nth-child(10)').hide()
    $('.planetWrapper .planet > div:nth-child(11)').hide()

    $('#defence').hide();
    $('.planetWrapper .planet > div:nth-child(12)').hide()
    $('.planetWrapper .planet > div:nth-child(13)').hide()

    $('#research').hide();
    $('.planetWrapper .planet > div:nth-child(14)').hide()
    $('.planetWrapper .planet > div:nth-child(15)').hide()

    var zoroPanelElement = document.createElement('div');
    zoroPanelElement.className = 'zoro-empire';
    $('#mainContent').prepend(zoroPanelElement);


    var element = document.createElement('button');
    element.innerHTML = "Show Ships";
    element.className = 'zoro-button zoro-fleet-button';
    element.setAttribute('onclick', 'window.location = window.location.href.replace("&showEmpty=1","").replace("&showShips=1","") + "&showShips=1"');
    zoroPanelElement.appendChild(element);

    var element = document.createElement('button');
    element.innerHTML = "Show Empty";
    element.className = 'zoro-button zoro-fleet-button';
    element.setAttribute('onclick', 'window.location = window.location.href.replace("&showEmpty=1","").replace("&showShips=1","") + "&showShips=1&showEmpty=1"');
    zoroPanelElement.appendChild(element);

    for (var i = 0; i < $('.values.ships > div:nth-child(1)').length - 1; i++) {
        let nthShipRows = $('.values.ships > div:nth-child(' + i + ')');
        var values = nthShipRows.text()
        if (values.replaceAll('0', '').length === 0) {
            nthShipRows.hide();
            $('#ships .ships > li:nth-child(' + i + ')').hide()
        }
    }

    if (document.location.href.indexOf('showEmpty') === -1) {
        for (let i = 0; i < $('.planetWrapper .planet').length; i++) {
            var planetElement = $('.planetWrapper .planet:nth-child(' + i + ')')
            if (parseResource(planetElement, '.resources .metal') < 1000000
                && parseResource(planetElement, '.resources .crystal') < 1000000
                && parseResource(planetElement,'.resources .deuterium') < 5000000
                && planetElement.find('.values.ships > div:not(.210):not(.217):not(.212)').text().replaceAll('0', '').length === 0) {
                planetElement.hide();
            }
        }

    }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
