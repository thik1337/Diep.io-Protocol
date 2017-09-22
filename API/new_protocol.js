// ==UserScript==
// @name         Diep.io protocol
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Faber & TheGexi
// @match        diep.io
// ==/UserScript==

_WebSocket = window.WebSocket;

function refer(master, slave, prop) {
    Object.defineProperty(master, prop, {
        get: function(){
            return slave[prop];
        },
        set: function(val) {
            slave[prop] = val;
        },
        enumerable: true,
        configurable: true
    });
};

window.WebSocket = function(url, protocols) {
    console.log('Listen', url, protocols);

    if (protocols === undefined) {
        protocols = [];
    }

    var ws = new _WebSocket(url, protocols);

    refer(this, ws, 'binaryType');
    refer(this, ws, 'bufferedAmount');
    refer(this, ws, 'extensions');
    refer(this, ws, 'protocol');
    refer(this, ws, 'readyState');
    refer(this, ws, 'url');

    this.send = function(data) {
        data = new Int8Array(data);
        var buf = new DataView(data.buffer);
        if (buf.getUint8(0) === 3) {
            console.log(data);
        }
        return ws.send.call(ws, data);
    };

    this.close = function() {
        return ws.close.call(ws);
    };

    this.onopen = function(event) {};
    this.onclose = function(event) {};
    this.onerror = function(event) {};
    this.onmessage = function(event) {};

    ws.onopen = function(event) {
        if (this.onopen)
            return this.onopen.call(ws, event);
    }.bind(this);

    ws.onmessage = function(event) {


        if (this.onmessage)
            return this.onmessage.call(ws, event);
    }.bind(this);

    ws.onclose = function(event) {
        if (this.onclose)
            return this.onclose.call(ws, event);
    }.bind(this);

    ws.onerror = function(event) {
        if (this.onerror)
            return this.onerror.call(ws, event);
    }.bind(this);
};

window.WebSocket.prototype = _WebSocket;
