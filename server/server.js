/**
 * Daozhishi entry point
 */

'use strict';

// HTTP Framework & Routers
const Koa = require('koa');
const kRouter = require('koa-router');
const kBodyParser = require('koa-bodyparser');
const kCompress = require('koa-compress');
const kError = require('koa-error');
const kIo = require('koa-socket');
const kcors = require('kcors');

// Co-routines
const co = require( 'co' )


// Dependency Injection module
const di = new (require('./dzs-di'))();

di.register('config');
di.register('dzs-logger');

const dzsInstance = (params) => {

    const app = new Koa();
    app.name = 'DaoZhiShi applicative framework';

    // Define routes
    const router = new kRouter({prefix: '/dzs'});

    const logger = di.get('DZS-LOGGER');
    const conf = di.get('DZS-CONF');

    logger.info(`Starting ${app.name} service`);
    logger.verbose(`Using koa-error`);
    app.use(kError());
    logger.verbose(`Using koa cross origin`);
    app.use(kcors());
    logger.verbose(`Using koa compress`);
    app.use(kCompress());
    logger.verbose(`Using koa body parser`);
    app.use(kBodyParser());


    // Create server and Socket.IO
    const io = new kIo();
    io.attach(app);

    io.use( co.wrap( function *( ctx, next ) {
        let start = new Date()
            yield next()
            console.log( `response time: ${ new Date() - start }ms` )
    }))



};


module.exports = dzsInstance;
