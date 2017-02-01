'use strict';

const dzsDi = class {
    constructor() {
        this.diModules = {};
    }

    register(modulePath) {
        const module = new (require(`./${modulePath}`))(this);
        const moduleId = module.moduleId;
        const moduleName = module.moduleName;

        if (!moduleId) {
            throw new Error('Module ID not defined');
        }

        if (!moduleName) {
            throw new Error(`Module name for ${moduleId} not defined`);
        }

        this.diModules[moduleId] = {
            key: moduleId,
            name: moduleName,
            module,
        };
    }

    get(key) {
        return this.diModules[key].module;
    }

};

module.exports = dzsDi;
