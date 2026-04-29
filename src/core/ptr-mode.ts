// Wasm pointer-width mode. Set once by initMeos() after reading sizeof(void*).
let _wasm64 = false;
export function setWasm64(v: boolean): void {
	_wasm64 = v;
}
export function isWasm64(): boolean {
	return _wasm64;
}
