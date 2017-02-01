/**
 * Daozhishi entry point
 */

'use strict';

// HTTP Framework & Routers
const Koa = require('koa');
const KRouter = require('koa-router');
const kBodyParser = require('koa-bodyparser');
const kCompress = require('koa-compress');
const kError = require('koa-error');
const KIo = require('koa-socket');
const kCors = require('kcors');

// Co-routines
const co = require('co');

// Promisified fs
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

// Dependency Injection module
const di = new (require('./dzs-di'))();

di.register('config');
di.register('dzs-logger');


function _loadModulesTypes(path, predicate, moduleKey) {
    const logger = di.get('DZS-LOGGER');

    return fs.readdirAsync(path)
    .then(
        (files) => files
            .filter(predicate)
            .map((f) => {
                try {
                    const Mod = require(`${process.cwd()}/${path}/${f}`);
                    return new Mod(di);
                }
                catch (err) {
                    logger.error(`Error instanciating module ${path}${f} : ${err}`, { stack: err.stack });
                }
            })
            .reduce((acc, item) => {
                if (acc[item[moduleKey]] !== void 0) {
                    logger.error(`Module ${moduleKey} already defined`);
                    throw new Error(`Module ${moduleKey} already defined`);
                }
                acc[item[moduleKey]] = item;
                return acc;
            }, {})
    )
    .catch((err) => {
        logger.error(`Error reading directory structure for type : ${moduleKey}`, { stack: err.stack });
    });
}

module.exports = function dzsInstance() {

    const app = new Koa();

    // Define routes
    const router = new KRouter({ prefix: '/dzs' });

    const logger = di.get('DZS-LOGGER');
    const conf = di.get('DZS-CONF');

    const appConfig = conf.get('app');
    app.name = appConfig.name;

    logger.info(`Starting ${app.name} service`);
    logger.verbose('Using koa-error');
    app.use(kError());
    logger.verbose('Using koa cross origin');
    app.use(kCors());
    logger.verbose('Using koa compress');
    app.use(kCompress());
    logger.verbose('Using koa body parser');
    app.use(kBodyParser());


    // Create server and Socket.IO
    const io = new KIo();
    io.attach(app);

    io.use(co.wrap(function *(ctx, next) {
        const start = new Date();
            yield next();
            logger.info(`response time: ${ new Date() - start }ms`);
    }));


    // Load all modules

    Promise.all([
        _loadModulesTypes( 'server/dbh', (f) => f.endsWith('Dbh.js') && !f.startsWith('abstract'), 'dbhID'),
        _loadModulesTypes( 'server/routes', (f) => f.endsWith('Route.js') && !f.startsWith('abstract'), 'routeID'),
        _loadModulesTypes( 'server/stories', (f) => f.startsWith('DBZ-'), 'storyID'),
        _loadModulesTypes( 'server/viewmodels', (f) => f.endsWith('VM.js') && !f.startsWith('abstract'), 'viewModelID'),
    ])
    .then(
        ([dbh, routes, stories, viewModels]) => {
            // TODO : Load into DI
            

            logger.verbose('Modules loaded into data injection system');

            logger.info(`Listening on port ${appConfig.port}`);
            app.listen(appConfig.port);
    });


};

