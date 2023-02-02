/*
 * Copyright 2022 Engineering Ingegneria Informatica S.p.A.
 *
 * This file is part of iotagent-opcua
 *
 * iotagent-opcua is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * iotagent-opcua is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with iotagent-opcua.
 * If not, see http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[manfredi.pistone@eng.it, gabriele.deluca@eng.it, walterdomenico.vergara@eng.it, mattiagiuseppe.marzano@eng.it]
 */

let config = {};
const fs = require('fs');
let logger = require('logops');
const iotAgentLib = require('iotagent-node-lib');

function anyIsSet(variableSet) {
    for (let i = 0; i < variableSet.length; i++) {
        if (process.env[variableSet[i]]) {
            return true;
        }
    }

    return false;
}

function processEnvironmentVariables() {
    const environmentVariables = [
        'IOTA_OPCUA_ENDPOINT',
        'IOTA_OPCUA_SECURITY_MODE',
        'IOTA_OPCUA_SECURITY_POLICY',
        'IOTA_OPCUA_SECURITY_USERNAME',
        'IOTA_OPCUA_SECURITY_PASSWORD',
        'IOTA_OPCUA_UNIQUE_SUBSCRIPTION',
        'IOTA_OPCUA_MT_POLLING',
        'IOTA_OPCUA_MT_AGENT_ID',
        'IOTA_OPCUA_MT_ENTITY_ID',
        'IOTA_OPCUA_MT_ENTITY_TYPE',
        'IOTA_OPCUA_MT_NAMESPACE_IGNORE',
        'IOTA_OPCUA_MT_STORE_OUTPUT',
        'IOTA_OPCUA_SUBSCRIPTION_NOTIFICATIONS_PER_PUBLISH',
        'IOTA_OPCUA_SUBSCRIPTION_PUBLISHING_ENABLED',
        'IOTA_OPCUA_SUBSCRIPTION_REQ_LIFETIME_COUNT',
        'IOTA_OPCUA_SUBSCRIPTION_REQ_MAX_KEEP_ALIVE_COUNT',
        'IOTA_OPCUA_SUBSCRIPTION_REQ_PUBLISHING_INTERVAL',
        'IOTA_OPCUA_SUBSCRIPTION_PRIORITY'
    ];
    const opcUAVariables = [
        'IOTA_OPCUA_ENDPOINT',
        'IOTA_OPCUA_SECURITY_MODE',
        'IOTA_OPCUA_SECURITY_POLICY',
        'IOTA_OPCUA_SECURITY_USERNAME',
        'IOTA_OPCUA_SECURITY_PASSWORD',
        'IOTA_OPCUA_UNIQUE_SUBSCRIPTION',
        'IOTA_OPCUA_MT_POLLING',
        'IOTA_OPCUA_MT_AGENT_ID',
        'IOTA_OPCUA_MT_ENTITY_ID',
        'IOTA_OPCUA_MT_ENTITY_TYPE',
        'IOTA_OPCUA_MT_NAMESPACE_IGNORE',
        'IOTA_OPCUA_MT_STORE_OUTPUT',
        'IOTA_OPCUA_SUBSCRIPTION_NOTIFICATIONS_PER_PUBLISH',
        'IOTA_OPCUA_SUBSCRIPTION_PUBLISHING_ENABLED',
        'IOTA_OPCUA_SUBSCRIPTION_REQ_LIFETIME_COUNT',
        'IOTA_OPCUA_SUBSCRIPTION_REQ_MAX_KEEP_ALIVE_COUNT',
        'IOTA_OPCUA_SUBSCRIPTION_REQ_PUBLISHING_INTERVAL',
        'IOTA_OPCUA_SUBSCRIPTION_PRIORITY'
    ];

    const protectedVariables = ['IOTA_OPCUA_SECURITY_USERNAME', 'IOTA_OPCUA_SECURITY_PASSWORD'];
    // Substitute Docker Secret Variables where set.
    protectedVariables.forEach((key) => {
        iotAgentLib.configModule.getSecretData(key);
    });
    environmentVariables.forEach((key) => {
        let value = process.env[key];
        if (value) {
            if (key.endsWith('USERNAME') || key.endsWith('PASSWORD') || key.endsWith('KEY')) {
                value = '********';
            }
            logger.info('Setting %s to environment value: %s', key, value);
        }
    });

    if (process.env.IOTA_CONFIG_RETRIEVAL) {
        config.configRetrieval = process.env.IOTA_CONFIG_RETRIEVAL;
    }
    if (process.env.IOTA_DEFAULT_KEY) {
        config.defaultKey = process.env.IOTA_DEFAULT_KEY;
    }
    if (process.env.IOTA_DEFAULT_TRANSPORT) {
        config.defaultTransport = process.env.IOTA_DEFAULT_TRANSPORT;
    }

    if (anyIsSet(opcUAVariables)) {
        config.opcua = {
            subscription: {}
        };
    }

    if (process.env.IOTA_OPCUA_ENDPOINT) {
        config.opcua.endpoint = process.env.IOTA_OPCUA_ENDPOINT;
    }

    if (process.env.IOTA_OPCUA_SECURITY_MODE) {
        config.opcua.securityMode = process.env.IOTA_OPCUA_SECURITY_MODE;
    }

    if (process.env.IOTA_OPCUA_SECURITY_POLICY) {
        config.opcua.securityPolicy = process.env.IOTA_OPCUA_SECURITY_POLICY;
    }

    if (process.env.IOTA_OPCUA_SECURITY_USERNAME) {
        config.opcua.username = process.env.IOTA_OPCUA_SECURITY_USERNAME;
    }

    if (process.env.IOTA_OPCUA_SECURITY_PASSWORD) {
        config.opcua.password = process.env.IOTA_OPCUA_SECURITY_PASSWORD;
    }

    if (process.env.IOTA_OPCUA_UNIQUE_SUBSCRIPTION) {
        config.opcua.uniqueSubscription = process.env.IOTA_OPCUA_UNIQUE_SUBSCRIPTION;
    }

    if (process.env.IOTA_OPCUA_MT_POLLING) {
        config.mappingTool.polling = process.env.IOTA_OPCUA_MT_POLLING;
    }

    if (process.env.IOTA_OPCUA_MT_AGENT_ID) {
        config.mappingTool.agentId = process.env.IOTA_OPCUA_MT_AGENT_ID;
    }

    if (process.env.IOTA_OPCUA_MT_ENTITY_ID) {
        config.mappingTool.entityId = process.env.IOTA_OPCUA_MT_ENTITY_ID;
    }

    if (process.env.IOTA_OPCUA_MT_ENTITY_TYPE) {
        config.mappingTool.entityType = process.env.IOTA_OPCUA_MT_ENTITY_TYPE;
    }

    if (process.env.IOTA_OPCUA_MT_NAMESPACE_IGNORE) {
        config.mappingTool.namespaceIgnore = process.env.IOTA_OPCUA_MT_NAMESPACE_IGNORE;
    }

    if (process.env.IOTA_OPCUA_STORE_OUTPUT) {
        config.mappingTool.namespaceIgnore = process.env.IOTA_OPCUA_STORE_OUTPUT;
    }

    if (process.env.IOTA_OPCUA_SUBSCRIPTION_NOTIFICATIONS_PER_PUBLISH) {
        config.opcua.subscription.maxNotificationsPerPublish = process.env.IOTA_OPCUA_SUBSCRIPTION_NOTIFICATIONS_PER_PUBLISH;
    }

    if (process.env.IOTA_OPCUA_SUBSCRIPTION_PUBLISHING_ENABLED) {
        config.opcua.subscription.publishingEnabled = process.env.IOTA_OPCUA_SUBSCRIPTION_PUBLISHING_ENABLED;
    }

    if (process.env.IOTA_OPCUA_SUBSCRIPTION_REQ_LIFETIME_COUNT) {
        config.opcua.subscription.requestedLifetimeCount = process.env.IOTA_OPCUA_SUBSCRIPTION_REQ_LIFETIME_COUNT;
    }

    if (process.env.IOTA_OPCUA_SUBSCRIPTION_REQ_MAX_KEEP_ALIVE_COUNT) {
        config.opcua.subscription.requestedMaxKeepAliveCount = process.env.IOTA_OPCUA_SUBSCRIPTION_REQ_MAX_KEEP_ALIVE_COUNT;
    }

    if (process.env.IOTA_OPCUA_SUBSCRIPTION_REQ_PUBLISHING_INTERVAL) {
        config.opcua.subscription.requestedPublishingInterval = process.env.IOTA_OPCUA_SUBSCRIPTION_REQ_PUBLISHING_INTERVAL;
    }

    if (process.env.IOTA_OPCUA_SUBSCRIPTION_PRIORITY) {
        config.opcua.subscription.priority = process.env.IOTA_OPCUA_SUBSCRIPTION_PRIORITY;
    }
}

function setConfig(newConfig) {
    config = newConfig;

    processEnvironmentVariables();
}

function getConfig() {
    return config;
}

function setLogger(newLogger) {
    logger = newLogger;
}

function getLogger() {
    return logger;
}

exports.setConfig = setConfig;
exports.getConfig = getConfig;
exports.setLogger = setLogger;
exports.getLogger = getLogger;