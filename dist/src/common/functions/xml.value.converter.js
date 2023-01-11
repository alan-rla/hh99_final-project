"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function nativeType(value) {
    const nValue = Number(value);
    if (!isNaN(nValue)) {
        return nValue;
    }
    const bValue = value.toLowerCase();
    if (bValue === 'true') {
        return true;
    }
    else if (bValue === 'false') {
        return false;
    }
    return value;
}
function removeJsonTextAttribute(value, parentElement) {
    try {
        const keyNo = Object.keys(parentElement._parent).length;
        const keyName = Object.keys(parentElement._parent)[keyNo - 1];
        parentElement._parent[keyName] = nativeType(value);
    }
    catch (e) { }
}
exports.default = removeJsonTextAttribute;
//# sourceMappingURL=xml.value.converter.js.map