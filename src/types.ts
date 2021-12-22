export interface IpfsLink {
  '/': string
}

export interface TypeInfo {
  typename: string
  artifact: IpfsLink
}

export interface ObjectInfo {
  objectname: string
  address: string
  typename: string
  artifact: IpfsLink
}

export interface Dpack {
  format: string
  network: string
  types: {[typename: string]: TypeInfo}
  objects: {[objectname: string]: ObjectInfo}
}

export interface Artifact {
}

export interface ResolvedTypeInfo {
  typename: string
  artifact: Artifact
}

export interface ResolvedObjectInfo {
  objectname: string
  address: string
  typename: string
  artifact: Artifact
}

export interface ResolvedDpack {
  format: string
  network: string
  types: {[typename: string]: ResolvedTypeInfo}
  objects: {[objectname: string]: ResolvedObjectInfo}
}
