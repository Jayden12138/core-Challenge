import { isObject } from '../../shared'
import {
	mutableHandler,
	readonlyHandler,
	shallowReadonlyHandler,
} from './baseHandlers'
import { ReactiveFlags } from './constants'

export function reactive(raw) {
	return createActiveObject(raw, mutableHandler)
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandler)
}

export function shallowReadonly(raw) {
	return createActiveObject(raw, shallowReadonlyHandler)
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

export function isProxy(obj) {
	return isReactive(obj) || isReadonly(obj)
}

export function toReactive(value) {
	return isObject(value) ? reactive(value) : value
}
