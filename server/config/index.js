'use strict';
const abstractDZSModule = require('../abstractDZSModule');

const MODULEID = 'DZS-CONF';
const MODULENAME = 'DaoZhiShi configuration module';

const dzsConfig = class extends abstractDZSModule {

    constructor(di) {
        const yamlConfig = require('node-yaml-config');
        super(di, MODULEID, MODULENAME);
        const confFilePath = `${__dirname}/conf.yml`;
        //TODO : changer ca avec un objet chargé
        this._confData = {
            'app': {
                name: 'DaoZhiShi applicative framework',
                port: 42042,
            },
            'DZS-LOGGER': {
                mode: 'verbose',
                environment: 'develop',
                ignoreObjIds: {
                    'DZS-01' : 1,
                },
            },
            'DBH-PG': {
                
            }
        };
    }

    get(key) {
        return this._confData[key];
    }
};
module.exports = dzsConfig;
