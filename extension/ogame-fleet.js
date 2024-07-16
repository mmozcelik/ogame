var fn = function () {
    'use strict';
    window.zoro = window.zoro || {};
    if (document.location.href.indexOf('fleet') === -1) {
        return;
    }

    const SHIP_TYPE_SC = 202;
    const SHIP_TYPE_LC = 203;

    const MIN_DEU_TO_KEEP_AT_MOON = 3000000;

    window._initFleet = function () {
        var zoroPanelElement = document.getElementsByClassName('zoro-check-debris')[0];

        var zoroFleetElement = document.createElement('div');
        zoroPanelElement.prepend(zoroFleetElement);

        var zoroDeployElement = document.createElement('div');
        zoroDeployElement.append('Deploy');

        var zoroTransportElement = document.createElement('div');
        zoroTransportElement.append('Transport');

        if (fleetDispatcher.currentPlanet.type === fleetDispatcher.fleetHelper.PLANETTYPE_PLANET) {
            zoroDeployElement.append(' To Moon');
            zoroTransportElement.append(' To Moon');
            var element = document.createElement('button');
            element.innerHTML = "Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendCarriers(fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_DEPLOY, true)');
            zoroDeployElement.appendChild(element);

            element = document.createElement('button');
            element.innerHTML = "Ships";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_DEPLOY, false)');
            zoroDeployElement.appendChild(element);

            element = document.createElement('button');
            element.innerHTML = "Ships&Resources";
            element.title = "Ships&Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_DEPLOY, true)');
            zoroDeployElement.appendChild(element);

            element = document.createElement('button');
            element.innerHTML = "All Ships";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_TRANSPORT, false)');
            zoroTransportElement.appendChild(element);

            element = document.createElement('button');
            element.innerHTML = "Ships&Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_TRANSPORT, true)');
            zoroTransportElement.appendChild(element);
        } else {
            zoroDeployElement.append(' To Planet');
            zoroTransportElement.append(' To Planet');

            if (expeditionCount < fleetDispatcher.maxExpeditionCount) {
                var element = document.createElement('button');
                element.innerHTML = "Send Expedition";
                element.className = 'zoro-button zoro-fleet-button';
                element.setAttribute('onclick', '_sendExpedition()');
                zoroFleetElement.appendChild(element);
            }

            if (['ay-jimbei', 'ay-blackbeard'].includes(fleetDispatcher.currentPlanet.name)) {
                if (_getCountOfShipsWithIdOnPlanet(203) >= _getActiveScrapeLCCount()) {
                    var element = document.createElement('button');
                    element.innerHTML = "Jump LC";
                    element.className = 'zoro-button zoro-fleet-button';
                    element.setAttribute('onclick', '_doJumpForBug()');
                    zoroDeployElement.appendChild(element);
                }

                if (_getCountOfShipsWithIdOnPlanet(203) === 0) {
                    var element = document.createElement('button');
                    element.innerHTML = "Scrap LC";
                    element.className = 'zoro-button zoro-fleet-button';
                    element.setAttribute('style', 'background: red;')
                    element.setAttribute('onclick', '_scrapeLCWithBug()');
                    zoroDeployElement.appendChild(element);
                }

                var element = document.createElement('button');
                element.innerHTML = "Go To " + (fleetDispatcher.currentPlanet.name === 'ay-blackbeard' ? 'ay-moria' : 'ay-arlong');
                element.className = 'zoro-button zoro-fleet-button';
                element.setAttribute('onclick', "window.location = '/game/index.php?page=ingame&component=fleetdispatch&cp=" + (fleetDispatcher.currentPlanet.name === 'ay-blackbeard' ? 4756324 : 4756329) + "'");
                zoroDeployElement.appendChild(element);
            } else if (['ay-arlong', 'ay-moria'].includes(fleetDispatcher.currentPlanet.name)) {
                if (_getCountOfShipsWithIdOnPlanet(203) >= _getActiveScrapeLCCount()) {
                    var element = document.createElement('button');
                    element.innerHTML = "Send Back LCs";
                    element.className = 'zoro-button zoro-fleet-button';
                    element.setAttribute('onclick', '_sendBackJumpBugLCs()');
                    zoroDeployElement.appendChild(element);
                }
            }

            var element = document.createElement('button');
            element.innerHTML = "Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendCarriers(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_DEPLOY)');
            zoroDeployElement.appendChild(element);

            var element = document.createElement('button');
            element.innerHTML = "Ships";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_DEPLOY, false)');
            zoroDeployElement.appendChild(element);

            var element = document.createElement('button');
            element.innerHTML = "Ships&Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_DEPLOY, true)');
            zoroDeployElement.appendChild(element);

            var element = document.createElement('button');
            element.innerHTML = "Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendCarriers(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_TRANSPORT, true)');
            zoroTransportElement.appendChild(element);

            var element = document.createElement('button');
            element.innerHTML = "All Ships";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_TRANSPORT, false)');
            zoroTransportElement.appendChild(element);

            var element = document.createElement('button');
            element.innerHTML = "Ships&Resources";
            element.className = 'zoro-button zoro-fleet-button';
            element.setAttribute('onclick', '_sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_TRANSPORT, true)');
            zoroTransportElement.appendChild(element);
        }
        zoroFleetElement.appendChild(zoroDeployElement);
        zoroFleetElement.appendChild(zoroTransportElement);
    }

    window._saveShipCounts = function () {
        var ships = [];
        fleetDispatcher.shipsOnPlanet.forEach(function (ship) {
            ships.push({...ship});
        });
        localStorage.setItem('lastStoredShips', JSON.stringify(ships))
        $('.zoro-fleet-count-text').replaceWith(ships.length + ' ships')
    }

    window._getLastStoredShips = function () {
        var lastShips = localStorage.getItem('lastStoredShips')
        return lastShips ? JSON.parse(lastShips) : null;
    }

    window._checkForFleet = function () {
        $('#pageContent').hide();
        _setFleetLastTime();

        _getFleetDataWithAjax(function (dataStr) {
            var fleetElement = $(dataStr);

            _checkForFleetForElement(fleetElement);
            setTimeout(function () {
                _checkForFleet();
            }, 5000 * Math.random() + (Math.random() < 0.5 ? 3000 : 500))
        }, function () {
            _checkForFleet();
        });
    };

    window._checkForFleetForElement = function (fleetElement) {
        _checkForHostileFleetForElement(fleetElement)
        _checkForFriendlyJumpDeployFleetForElement(fleetElement)
    }

    window._checkForHostileFleetForElement = function (fleetElement) {
        var hostileEvents = fleetElement.find('.countDown span.hostile');

        if (hostileEvents.length > 0) {
            console.log('We found an hostile event!');
            hostileEvents.each(function (index, element) {
                element = $(element);
                var rowElement = element.closest('tr.eventFleet');
                var missionType = parseInt(rowElement.attr('data-mission-type'));
                var eventId = element.attr('id').replace('counter-eventlist-', '');

                var origin = rowElement.find('.coordsOrigin').text().replaceAll(/(\r\n|\n|\s)/gm, '');
                var dest = rowElement.find('.destCoords').text().replaceAll(/(\r\n|\n|\s)/gm, '');
                var planetType = rowElement.find('.originFleet .moon').length == 1 ? 3 : 1;
                var missionTypeStr = missionType == 6 ? 'espionage' : 'attack';

                _addFleetEvent(origin, dest, eventId, missionTypeStr, planetType);
            });
        } else {
            console.log('No hostile event yet!');
            localStorage.removeItem('fleet-events');
        }
    }

    window._checkForFriendlyJumpDeployFleetForElement = function (fleetElement) {
        var friendlyEvents = fleetElement.find('.countDown span.friendly');

        if (friendlyEvents.length > 0) {
            friendlyEvents.each(function (index, element) {
                element = $(element);
                var rowElement = element.closest('tr.eventFleet');
                var missionType = parseInt(rowElement.attr('data-mission-type'));
                var planetType = rowElement.find('.originFleet .moon').length === 1 ? 3 : 1;
                var origin = rowElement.find('.coordsOrigin').text().replaceAll(/(\r\n|\n|\s)/gm, '');
                if (missionType !== 4 || planetType !== 3) {
                    return;
                }
                var countDownText = rowElement.find('.countDown span').text();
                var countDown = countDownText.includes(' ') ? 60 : parseInt(countDownText.replace('sn', ''));

                var dest = rowElement.find('.destCoords').text().replaceAll(/(\r\n|\n|\s)/gm, '');
                var fleetCount = parseInt(rowElement.find('.detailsFleet').text());
                console.log('Checking for bug deploy back ' + JSON.stringify({countDown, missionType, planetType, fleetCount, origin}))
                if (countDown < 10 && fleetCount === _getActiveScrapeLCCount()
                    && ((origin.includes('441:9') && dest.includes('441:13')) || (origin.includes('441:7') && dest.includes('441:6')))
                    && _checkLastWarned('jump_deploy_fleet_down' + dest, 30000)) {
                    var destCoords = dest.replace(']', '').replace('[', '').split(':');
                    var message = _getPlanetName(destCoords[0], destCoords[1], destCoords[2]).toUpperCase() + ': jump ready in ' + countDown + ' sec!';
                    _addDesktopAlert('Jump&Deploy ready', message, null, true, -1);
                }
            });
        } else {
            console.log('No hostile event yet!');
            localStorage.removeItem('fleet-events');
        }
    }

    window._getFleetEvents = function () {
        var fleetStr = localStorage.getItem('fleet-events');
        if (fleetStr) {
            return JSON.parse(fleetStr);
        }

        return {}
    };

    window._addFleetEvent = function (origin, dest, eventId, type, planetType) {
        var events = _getFleetEvents();
        var doAlert = type != 'espionage';
        if (!events[origin]) {
            events[origin] = {'espionage': {}, 'attack': {}, 'silent': false};
            doAlert = true;
        }

        if (!events[origin][eventId]) {
            events[origin][eventId] = type;
            if (type != 'espionage') {
                doAlert = true;
            }
        }

        var destCoords = dest.replace(']', '').replace('[', '').split(':');
        let mainFleetPlanet = _getMainFleetPlanet();
        console.log('We detected an attack!' + origin + '_' + dest);
        var alertHeader = 'Hostile Fleet';
        if (type == 'espionage' && _checkLastWarned('recently_escaped' + dest, 30000)) {
            if (mainFleetPlanet.galaxy == destCoords[0] && mainFleetPlanet.system == destCoords[1] && mainFleetPlanet.type == planetType) {
                _openMainFleetPage('&emergency-escape=1');
                alertHeader += ' Emergency Escaped';
            } else if (_getLastFleetCount(destCoords[0], destCoords[1], destCoords[2], planetType) > 30000) {
                _openFleetPage(destCoords[0], destCoords[1], destCoords[2], planetType, '&emergency-escape=1')
            }
        }

        if (doAlert && _checkLastWarned('attack_alert_' + origin, 30000)) {
            var message = _getPlanetName(destCoords[0], destCoords[1], destCoords[2]).toUpperCase() + ': ' + type.toUpperCase() + ' event from ' + origin + '!';
            _addDesktopAlert(alertHeader, message, null, true, type == 'attack' ? 1 : 0);
        }

        localStorage.setItem('fleet-events', JSON.stringify(events));
    };

    window._getFleetDataWithAjax = function (callback, lobbyCallback) {
        $.get('/game/index.php?page=componentOnly&component=eventList&ajax=1')
            .done(function (dataStr) {
                if (callback) {
                    callback(dataStr);
                }
            })
            .fail(function (xhr, status, error) {
                if (status == 'error' && xhr.status !== 503) {
                    _handleLobbyRedirect(lobbyCallback);
                }
            });
    }

    window._sendCarriers = function (planetType, mission, includeResources) {
        var countSC = _getMaxShipCount(SHIP_TYPE_SC);
        var countLC = _getMaxShipCount(SHIP_TYPE_LC);
        if (countSC > 0 || countLC > 0) {
            var params = _prepareSendFleetParams(planetType, mission);
            if (countSC > 0) {
                params['am' + SHIP_TYPE_SC] = countSC;
            }
            if (countLC > 0) {
                params['am' + SHIP_TYPE_LC] = countLC;
            }

            if (includeResources) {
                var loadedAll = _loadResourceToShips(params, true, currentPlanet.type === fleetDispatcher.fleetHelper.PLANETTYPE_MOON);
                if (!loadedAll && mission != fleetDispatcher.fleetHelper.MISSION_TRANSPORT) {
                    params.mission = fleetDispatcher.fleetHelper.MISSION_TRANSPORT;
                }
            }

            _sendShipsWithParams(params);
        } else {
            alert('No ship to send.')
        }
    }

    window._sendShipsWithParams = function (params) {
        $.post('/game/index.php?page=ingame&component=fleetdispatch&action=sendFleet&ajax=1&asJson=1', params)
            .done(function (dataStr) {
                var data = JSON.parse(dataStr);
                if (!data.success) {
                    showNotification(data.errors[0].message, 'error');
                } else {
                    window.location.reload();
                }
            });
    }

    window._jumpShipsWithParams = function (params) {
        $.post('/game/index.php?page=componentOnly&component=jumpgate&action=executeJump&asJson=1', params)
            .done(function (dataStr) {
                var data = JSON.parse(dataStr);
                if (!data.status) {
                    alert(data.errorbox.text);
                } else {
                    showNotification(data.errorbox.text);
                }
            });
    }

    window._sendBackJumpBugLCs = function () {
        const params = _prepareSendFleetParams(fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_DEPLOY);
        params.position = fleetDispatcher.currentPlanet.name === 'ay-arlong' ? 13 : 6;
        params['am' + SHIP_TYPE_LC] = _getActiveScrapeLCCount();
        params.speed = 8;
        _sendShipsWithParams(params)
    }

    window._scrapeShipsWithParams = function (params) {
        $.post('/game/index.php?page=ajax&component=traderscrap&ajax=1&asJson=1&action=trade', params)
            .done(function (dataStr) {
                var data = JSON.parse(dataStr);
                if (data.error) {
                    showNotification(data.error.message, 'error');
                } else {
                    showNotification('Başarıyla hurdaya çevirdik');
                }
            });
    }

    window._getActiveScrapeLCCount = function () {
        return parseInt(localStorage.getItem('jumpDeployBugLCCount') || 177516);
    }

    window._scrapeLCWithBug = function () {
        _scrapeShipsWithParams({
            'trade[203]': _getActiveScrapeLCCount(),
            token: token,
            lastTechId: 203,
            finishTrade: 1
        });
    }


    window._doJumpForBug = function (params) {
        var lastDebrisCheckTime = parseInt(localStorage.getItem('debris_check_last_time') || 0);
        if (new Date().getTime() - lastDebrisCheckTime > 30000) {
            showNotification('Debris check problem, run debris check before jumping!', 'error');
            return;
        }
        _jumpShipsWithParams({
            ship_203: _getActiveScrapeLCCount(),
            token: token,
            targetSpaceObjectId: fleetDispatcher.currentPlanet.name === 'ay-jimbei' ? 4756329 : 4756324
        });
    }

    window._getCountOfShipsWithIdOnPlanet = function (shipId) {
        for (let i = 0; i < fleetDispatcher.shipsOnPlanet.length; i++) {
            if (fleetDispatcher.shipsOnPlanet[i].id === shipId) {
                return fleetDispatcher.shipsOnPlanet[i].number;
            }
        }
        return 0;
    }

    window._sendAllShips = function (planetType, mission, includeResources, useStorageForShips) {
        var params = _prepareSendFleetParams(planetType, mission);
        var ships = fleetDispatcher.shipsOnPlanet;
        if (useStorageForShips && localStorage.getItem('lastStoredShips')) {
            ships = JSON.parse(localStorage.getItem('lastStoredShips'));
        }
        ships.forEach(function (ship) {
            params['am' + ship.id] = ship.number;
            if (ship.id === 210 && planetType === fleetDispatcher.fleetHelper.PLANETTYPE_PLANET ) { // Keep some espionage probe on moon
                params['am' + ship.id] = ship.number > 400 ?  ship.number - 400 : ship.number;
            }
        });

        if (includeResources) {
            _loadResourceToShips(params, false, currentPlanet.type === fleetDispatcher.fleetHelper.PLANETTYPE_MOON);
        }
        _sendShipsWithParams(params);
    }

    window._loadResourceToShips = function (shipsSetParams, notifyForRemainingResources, keepMinDeu) {
        var totalCapacity = 0;
        Object.keys(shipsSetParams).forEach(function (key) {
            if (key.indexOf('am') === 0) {
                totalCapacity += _getCargoCapacity(parseInt(key.replace('am', ''))) * shipsSetParams[key];
            }
        });

        var crystal = fleetDispatcher.crystalOnPlanet;
        var deu = fleetDispatcher.deuteriumOnPlanet;
        var metal = fleetDispatcher.metalOnPlanet;
        if (keepMinDeu) {
            deu = deu > MIN_DEU_TO_KEEP_AT_MOON ? deu - MIN_DEU_TO_KEEP_AT_MOON : 0;
        }

        if (totalCapacity < crystal + deu + metal) {
            if (metal > totalCapacity) {
                shipsSetParams.metal = totalCapacity;
                shipsSetParams.crystal = 0;
                shipsSetParams.deuterium = 0;
                shipsSetParams.food = 0;
            } else if (metal + crystal > totalCapacity) {
                shipsSetParams.metal = metal;
                shipsSetParams.crystal = totalCapacity - metal;
                shipsSetParams.deuterium = 0;
                shipsSetParams.food = 0;
            } else {
                shipsSetParams.metal = metal;
                shipsSetParams.crystal = crystal;
                shipsSetParams.deuterium = totalCapacity - metal - crystal;
                shipsSetParams.food = 0;
            }
            if (notifyForRemainingResources) {
                alert('Ship capacity is lower than existing resources, doing transport, please do send fleet again.');
            }
            return false;
        } else {
            shipsSetParams.metal = metal;
            shipsSetParams.crystal = crystal;
            shipsSetParams.deuterium = deu;
            shipsSetParams.food = 0;

            return true;
        }
    }

    window._getCargoCapacity = function (type) {
        return fleetDispatcher.fleetHelper.shipsData[type].cargoCapacity;
    };

    window._prepareSendFleetParams = function (type, mission) {
        return {
            token: token,
            galaxy: window.currentPlanet.galaxy,
            system: window.currentPlanet.system,
            position: window.currentPlanet.position,
            type: type,
            metal: 0,
            crystal: 0,
            deuterium: 0,
            food: 0,
            prioFood: 1,
            prioMetal: 2,
            prioCrystal: 3,
            prioDeuterium: 4,
            mission: mission,
            speed: 10,
            retreatAfterDefenderRetreat: 0,
            lootFoodOnAttack: 1,
            union: 0,
            holdingtime: 0
        };
    }

    window._getMaxShipCount = function (shipType) {
        var result = 0;
        fleetDispatcher.shipsOnPlanet.forEach(function (item) {
            if (item.id === shipType) {
                result = item.number;
            }
        });

        return result;
    }

    window._getCurrentPlanetFleetCount = function () {
        var fleetCount = 0;
        window.fleetDispatcher.shipsOnPlanet.forEach(function (ship) {
            fleetCount += ship.number;
        })

        return fleetCount;
    }

    window._checkMainFleet = function () {
        if (_getCurrentPlanetFleetCount() > 50000) {
            localStorage.setItem('main_fleet', JSON.stringify(currentPlanet));
        }
    }

    window._setLastFleetCount = function () {
        localStorage.setItem('fleet_count_' + _getCoordStr(currentPlanet.galaxy, currentPlanet.system, currentPlanet.position) + '_' + currentPlanet.type, _getCurrentPlanetFleetCount());
    }

    window._escapeFleet = function () {
        _checkTarget()
            .done(function (dataStr) {
                console.log('Fleet escape requested!');
                var data = JSON.parse(dataStr);
                if (data.status == 'success' && data.targetOk) {
                    console.log('Decided to debris remove!');
                    _sendAllShips(fleetDispatcher.fleetHelper.PLANETTYPE_DEBRIS, fleetDispatcher.fleetHelper.MISSION_RECYCLE);
                    setInterval(function () {
                        var activeEvents = localStorage.getItem('fleet-events');
                        if (!activeEvents) {
                            var events = _getActiveEvents();

                            window.close();
                        }
                    }, 20000)
                } else {
                    console.log('Decided to transport!');
                    _sendAllShips(currentPlanetType == fleetDispatcher.fleetHelper.PLANETTYPE_MOON ? fleetDispatcher.fleetHelper.PLANETTYPE_PLANET : fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_TRANSPORT)
                    window.close();
                }
            })
            .fail(function () {
                console.log('Decided to transport!');
                _sendAllShips(currentPlanetType == fleetDispatcher.fleetHelper.PLANETTYPE_MOON ? fleetDispatcher.fleetHelper.PLANETTYPE_PLANET : fleetDispatcher.fleetHelper.PLANETTYPE_MOON, fleetDispatcher.fleetHelper.MISSION_TRANSPORT)
                window.close();
            });
    }

    window._checkTarget = function () {
        return $.post('/game/index.php?page=ingame&component=fleetdispatch&action=checkTarget&ajax=1&asJson=1', {
            am209: 1,
            galaxy: currentPlanet.galaxy,
            system: currentPlanet.system,
            position: currentPlanet.position,
            type: 2,
            union: 0
        });
    }

    window._sendExpedition = function () {
        var fleetId = 268;
        fleetDispatcher.expeditionFleetTemplates.forEach(function (fleet) {
            if (fleet.id == fleetId) {
                var params = _prepareSendFleetParams(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET, fleetDispatcher.fleetHelper.MISSION_EXPEDITION);
                params.system = fleetDispatcher.currentPlanet.system + (Math.random() < 0.5 ? 1 : -1) * (parseInt(Math.random() * 3) + 1);
                params.position = 16;
                params.holdingtime = 1;
                for (var shipId in fleet.ships) {
                    let countOfShips = fleet.ships[shipId];
                    if (countOfShips > 0) {
                        params['am' + shipId] = countOfShips;
                    }
                }
                _sendShipsWithParams(params);
            }
        })
    }

    if (window.fleetDispatcher) {
        _initFleet();
        setTimeout(function () {
            _refreshPlanets();
        }, 1000);
        _checkMainFleet();
        _setLastFleetCount();
    }
    var autoCheckFleet = _getUrlParameter('check-fleet');
    if (autoCheckFleet) {
        _checkForFleet();
    }

    var emergencyEscape = _getUrlParameter('emergency-escape');
    if (emergencyEscape) {
        setTimeout(function () {
            if (_getCurrentPlanetFleetCount() > 30000) {
                _escapeFleet();
            } else {
                console.log('Not escaping as no major fleet is here');
            }
        }, 2000)
    }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// COLONIZATION_ENABLED: true
// DONUT_GALAXY: 1
// DONUT_SYSTEM: 1
// EXPEDITION_POSITION: 16
// FLEET_DEUTERIUM_SAVE_FACTOR: 0.5
// MAX_GALAXY: 9
// MAX_NUMBER_OF_PLANETS: 12
// MAX_POSITION: 16
// MAX_SYSTEM: 499
// MISSION_ATTACK: 1
// MISSION_COLONIZE: 7
// MISSION_DEPLOY: 4
// MISSION_DESTROY: 9
// MISSION_ESPIONAGE: 6
// MISSION_EXPEDITION: 15
// MISSION_HOLD: 5
// MISSION_MISSILEATTACK: 10
// MISSION_NONE: 0
// MISSION_RECYCLE: 8
// MISSION_TRANSPORT: 3
// MISSION_UNIONATTACK: 2
// PLANETTYPE_DEBRIS: 2
// PLANETTYPE_MOON: 3
// PLANETTYPE_PLANET: 1
// PLAYER_ID_LEGOR: 1
// PLAYER_ID_SPACE: 99999
// SPEEDFAKTOR_FLEET: 4