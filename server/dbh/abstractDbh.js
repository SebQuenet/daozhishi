'use strict';

module.exports = class AbstractDbh{
    constructor(di, dbhID, dbhName) {
        this.di = di;
        this.dbhID = dbhID;
        this.dbhName = dbhName;
        this.config = di.get('DZS-CONF').get(dbhID);

        const logger = di.get('DZS-LOGGER');
        logger.debug(`Instanciating database handler`, {objID: dbhID, dbhName});
    }

    getInstance(dbhID, dateStart) {
        if (this.constructor === AbstractDbh) {
            throw'You must override getInstance method';
        }
    }

    test() {
        if (this.constructor === AbstractDbh) {
            throw'No unit test implemented';
        }
    }
};
