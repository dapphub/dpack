const Ajv = require('ajv') // = require('ajv/dist/jtd')
const ajv = Ajv();

const linkSchema = {
  properties: {
    "/": {type: 'string'}
  }
}

const typeSchema = {
  properties: {
    typename: {type: 'string'},
    artifact: {ref: 'linkSchema'}
  },
  definitions: {
    linkSchema
  }
}

const objectSchema = {
  properties: {
    objectname: {type:'string'},
    address: {type:'string'},
    typename: {type:'string'},
    artifact: {ref: 'linkSchema'}
  },
  definitions: {
    linkSchema
  }
}

const packSchema = {
  properties: {
    format: {type:'string'},
    network: {type:'string'},
    types: {values:{ref:'typeSchema'}},
    objects: {values:{ref:'objectSchema'}}
  },
  definitions: {
    typeSchema,
    objectSchema
  }
}


const artifactSchema = {
  bytecode: {nullable:true},
  abi: {nullable:true},
  additionalProperties: true
}

const resolvedTypeSchema = {
  properties: {
    typename: {type:'string'},
    artifact: {ref:'artifactSchema'}
  },
  definitions: {
    artifactSchema
  }
}

const resolvedObjectSchema = {
  properties: {
    objectname: {type:'string'},
    address: {type:'string'},
    typename: {type:'string'},
    artifact: {ref: 'artifactSchema'}
  },
  definitions: {
    artifactSchema
  }
}

const resolvedPackSchema = {
  properties: {
    format: {type:'string'},
    network: {type:'string'},
    types: {values:{ref:'resolvedTypeSchema'}},
    objects: {values:{ref:'resolvedObjectSchema'}}
  },
  definitions: {
    resolvedTypeSchema,
    resolvedObjectSchema
  }
}



export const isWellFormedLink = ajv.compile(linkSchema);
export const isWellFormedObject = ajv.compile(objectSchema);
export const isWellFormedType = ajv.compile(typeSchema);
export const isWellFormedPack = ajv.compile(packSchema);

export const isWellFormedArtifact = ajv.compile(artifactSchema);
export const isWellFormedResolvedObject = ajv.compile(resolvedObjectSchema);
export const isWellFormedResolvedType = ajv.compile(resolvedTypeSchema);
export const isWellFormedResolvedPack = ajv.compile(resolvedPackSchema);
