const Ajv = require('ajv') // = require('ajv/dist/jtd')
const ajv = Ajv()

const linkSchema = {
  properties: {
    '/': { type: 'string' }
  }
}

const typeSchema = {
  properties: {
    typename: { type: 'string' },
    artifact: { ref: 'linkSchema' }
  },
  definitions: {
    linkSchema
  }
}

const objectSchema = {
  properties: {
    objectname: { type: 'string' },
    address: { type: 'string' },
    typename: { type: 'string' },
    artifact: { ref: 'linkSchema' }
  },
  definitions: {
    linkSchema
  }
}

const packSchema = {
  properties: {
    format: { type: 'string' },
    network: { type: 'string' },
    types: { values: { ref: 'typeSchema' } },
    objects: { values: { ref: 'objectSchema' } }
  },
  definitions: {
    typeSchema,
    objectSchema
  }
}

const bundleSchema = {
  values: { type: 'string' }
}

const artifactSchema = {
  bytecode: { nullable: true },
  abi: { nullable: true },
  additionalProperties: true
}

const resolvedPackSchema = {
  properties: {
    format: { type: 'string' },
    network: { type: 'string' },
    types: { values: { ref: 'typeSchema' } },
    objects: { values: { ref: 'objectSchema' } },
    _bundle: { ref: 'bundleSchema' }
  },
  definitions: {
    typeSchema,
    objectSchema,
    bundleSchema
  }
}

export const isWellFormedLink = ajv.compile(linkSchema)
export const isWellFormedObject = ajv.compile(objectSchema)
export const isWellFormedType = ajv.compile(typeSchema)
export const isWellFormedPack = ajv.compile(packSchema)
export const isWellFormedBundle = ajv.compile(bundleSchema)
export const isWellFormedArtifact = ajv.compile(artifactSchema)
export const isWellFormedResolvedPack = ajv.compile(resolvedPackSchema)
