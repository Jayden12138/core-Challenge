import { mutableHandler, readonlyHandler } from './baseHandlers'
import { ReactiveFlags } from './constants'

export function reactive(raw) {
	return createActiveObject(raw, mutableHandler)
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandler)
}

function createActiveObject(raw, baseHandler) {
	return new Proxy(raw, baseHandler)
}

export function isReactive(obj) {
	return !!obj[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(obj) {
	return !!obj[ReactiveFlags.IS_READONLY]
}
