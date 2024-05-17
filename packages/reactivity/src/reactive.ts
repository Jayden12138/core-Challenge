import { track, trigger } from './index'

export function reactive(raw) {
	return new Proxy(raw, {
		get(target, key) {
			const res = Reflect.get(target, key)

			track(target, key)

			return res
		},

		set(target, key, value) {
			let res = Reflect.set(target, key, value)

			trigger(target, key)

			return res
		},
	})
}