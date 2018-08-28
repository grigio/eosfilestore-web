import { maxPayloadSize } from './costants'

// it splits the string in string chunks of a fixed size
export function splitString(str: string, size?: number): string[] {
  size = size || maxPayloadSize
  const re = new RegExp('.{1,' + size + '}', 'g')
  const matches = str.match(re) || []
  return matches
}

// it create the memo to add to the tx
export function createPayload(chunk: string, nextTx: string | null): string {
  if (chunk === '') { throw new Error(`chunk can't be empty`) }
  const nextTxStr = (nextTx) ? `"${nextTx}"` : null
  return `{"c":"${chunk}","n":${nextTxStr}}`
}

export function b64DecodeUnicode(str: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export function arrayBufferToBase64(buffer:any, mimetype:string) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return `data:${mimetype};base64,${window.btoa(binary)}`;
}