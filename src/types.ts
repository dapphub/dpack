export type base64str = string
export interface Bundle {[cid: string]: base64str}

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

export interface DPack {
  format: string
  network: string
  types: {[typename: string]: TypeInfo}
  objects: {[objectname: string]: ObjectInfo}
}

export interface Artifact {
}

export interface ResolvedPack extends DPack {
  _bundle: Bundle
  _resolved: boolean
}
