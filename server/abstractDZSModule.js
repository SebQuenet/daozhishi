'use strict';

const dzsModule = class {
    constructor(di, moduleId, moduleName) {
        this.di = di;
        this._moduleId = moduleId;
        this._moduleName = moduleName;
    }

    get moduleId() {
        return this._moduleId;
    }

    get moduleName() {
        return this._moduleName;
    }
};

module.exports = dzsModule;
