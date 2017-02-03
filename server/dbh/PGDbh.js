'use strict';

const AbstractDbh = require('./abstractDbh');

const pgp = require('pg-promise')();

const DBHID = 'DBH-PG';
const DBHNAME = 'Postgres Database Handler';

module.exports = class extends AbstractDbh {
    constructor(di) {
        super(di, DBHID, DBHNAME);
    }

    getInstance() {
        super.getInstance();
        const logger = this.di.get('DZS-LOGGER');
        const config = this.config;

        if (this.instance === void 0) {
            this.instance = pgp(config);
        }

        return this.instance;
    }
};
