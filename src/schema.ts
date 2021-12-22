const Ajv = require('ajv/dist/jtd')
const ajv = Ajv();

const linkSchema = {
  properties: {
    "/": {type: 'string'}
  }
}

const typeSchema = {
  properties: {
    typename: {type: 'string'},
    artifacts: {ref: 'linkSchema'}
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
    artifacts: {ref: 'linkSchema'}
  },
  definitions: {
    linkSchema
  }
}

export const isWellFormedLink = ajv.compile(linkSchema);
export const isWellFormedType = ajv.compile(typeSchema);
