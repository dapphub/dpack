"use strict";
exports.__esModule = true;
exports.isWellFormedResolvedPack = exports.isWellFormedArtifact = exports.isWellFormedBundle = exports.isWellFormedPack = exports.isWellFormedType = exports.isWellFormedObject = exports.isWellFormedLink = void 0;
var Ajv = require('ajv'); // = require('ajv/dist/jtd')
var ajv = Ajv();
var linkSchema = {
    properties: {
        '/': { type: 'string' }
    }
};
var typeSchema = {
    properties: {
        typename: { type: 'string' },
        artifact: { ref: 'linkSchema' }
    },
    definitions: {
        linkSchema: linkSchema
    }
};
var objectSchema = {
    properties: {
        objectname: { type: 'string' },
        address: { type: 'string' },
        typename: { type: 'string' },
        artifact: { ref: 'linkSchema' }
    },
    definitions: {
        linkSchema: linkSchema
    }
};
var packSchema = {
    properties: {
        format: { type: 'string' },
        network: { type: 'string' },
        types: { values: { ref: 'typeSchema' } },
        objects: { values: { ref: 'objectSchema' } }
    },
    definitions: {
        typeSchema: typeSchema,
        objectSchema: objectSchema
    }
};
var bundleSchema = {
    values: { type: 'string' }
};
var artifactSchema = {
    bytecode: { nullable: true },
    abi: { nullable: true },
    additionalProperties: true
};
var resolvedPackSchema = {
    properties: {
        format: { type: 'string' },
        network: { type: 'string' },
        types: { values: { ref: 'typeSchema' } },
        objects: { values: { ref: 'objectSchema' } },
        _bundle: { ref: 'bundleSchema' }
    },
    definitions: {
        typeSchema: typeSchema,
        objectSchema: objectSchema,
        bundleSchema: bundleSchema
    }
};
exports.isWellFormedLink = ajv.compile(linkSchema);
exports.isWellFormedObject = ajv.compile(objectSchema);
exports.isWellFormedType = ajv.compile(typeSchema);
exports.isWellFormedPack = ajv.compile(packSchema);
exports.isWellFormedBundle = ajv.compile(bundleSchema);
exports.isWellFormedArtifact = ajv.compile(artifactSchema);
exports.isWellFormedResolvedPack = ajv.compile(resolvedPackSchema);
