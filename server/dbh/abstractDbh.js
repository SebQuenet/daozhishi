'use strict';

module.exports = class AbstractDbh {
    constructor(di, dbhID, dbhName) {
        this.di = di;
        this.dbhID = dbhID;
        this.dbhName = dbhName;
        this.config = di.get('DZS-CONF').get(dbhID);

        const logger = di.get('DZS-LOGGER');
        logger.debug('Instanciating database handler', { objID: dbhID, objName: dbhName });
    }

    getInstance(dbhID, dateStart) {
        if (this.constructor === AbstractDbh) {
            throw new Error('You must override getInstance method');
        }
    }

    test() {
        if (this.constructor === AbstractDbh) {
            throw new Error('No unit test implemented');
        }
    }
};
