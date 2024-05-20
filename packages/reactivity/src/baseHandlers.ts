import { isObject } from '../../shared'
import { ReactiveFlags } from './constants'
import { track, trigger } from './effect'
import { reactive, readonly } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly: boolean = false) {
	return (target, key) => {
		const res = Reflect.get(target, key)

		if (isObject(res)) {
			return isReadonly ? readonly(res) : reactive(res)
		}

		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly
		}

		if (!isReadonly) {
			track(target, key)
		}

		return res
	}
}

function createSetter() {
	return (target, key, value) => {
		let res = Reflect.set(target, key, value)

		trigger(target, key)

		return res
	}
}

export const mutableHandler = {
	get,
	set,
}

export const readonlyHandler = {
	get: readonlyGet,
	set(target, key, value) {
		console.warn(
			`key:${String(key)} set 失败，因为 target 是 readonly！`,
			target
		)
		return true
	},
}
