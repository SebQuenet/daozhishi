'use strict';

const AbstractRoute = require('./abstractRoute');

const ROUTEID = 'ROUTE-DATA';
const ROUTENAME = 'Main Data Route';
const ROUTEPATH = '/data';

const KRouter = require('koa-router');

module.exports = class dataRoute extends AbstractRoute {
    constructor(di) {
        super(di, ROUTEID, ROUTENAME, ROUTEPATH);
    }

    get path() {
        return this.routePath;
    }

    endPoint() {
        const router = new KRouter();
        router.get('/', this.get);
        router.post('/', this.post);
        router.put('/', this.put);
        router.delete('/', this.delete);
        return router.routes();
    }

    *get() {
        yield { data: 'hello' };
    }

    *post() {
        yield { data: 'hello' };
    }

    *put() {
        yield { data: 'hello' };
    }

    *delete() {
        yield { data: 'hello' };
    }

};
