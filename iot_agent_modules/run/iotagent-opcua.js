'use strict';

const iotAgentLib = require('iotagent-node-lib');
const info = require('../../package.json');

/**
 * Starts the IOTA with the given configuration.
 *
 * @param {Object} newConfig        New configuration object.
 * @param          callback         Callback function.
 */
function start(newConfig, callback) {
    newConfig.iotaVersion = info.version;

    // This also creates the device registry
    iotAgentLib.activate(newConfig, function(err) {
        callback(err);
    });
}

exports.start = start;
