'use strict';

module.exports = class AbstractRoute {
    constructor(di, routeID, routeName, routePath) {
        this.di = di;
        this.routeID = routeID;
        this.routeName = routeName;
        this.routePath = routePath;

        this.config = di.get('DZS-CONF').get(routeID);
        const logger = di.get('DZS-LOGGER');

        logger.debug('Instanciating route ', { objID: routeID, objName: routeName });
    }

    get path() {
        if (this.constructor === AbstractRoute) {
            throw new Error('You must override getInstance method');
        }
    }

    test() {
        if (this.constructor === AbstractRoute) {
            throw new Error('No unit test implemented');
        }
    }
};
