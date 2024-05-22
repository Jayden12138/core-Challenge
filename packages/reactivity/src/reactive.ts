import { isObject } from '../../shared'
import {
	mutableHandler,
	readonlyHandler,
	shallowReadonlyHandler,
} from './baseHandlers'
import { ReactiveFlags } from './constants'

export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export function reactive(raw) {
	return createActiveObject(raw, mutableHandler, reactiveMap)
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandler, readonlyMap)
}

export function shallowReadonly(raw) {
	return createActiveObject(raw, shallowReadonlyHandler, shallowReadonlyMap)
}

function createActiveObject(raw, baseHandler, proxyMap) {
	// if it is already a Proxy, return it
	const existingProxy = proxyMap.get(raw)
	if (existingProxy) {
		return existingProxy
	}

	// target is already a Proxy, return it
	if (isProxy(raw)) {
		return raw
	}

	const proxy = new Proxy(raw, baseHandler)
	proxyMap.set(raw, proxy)
	return proxy
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
