import { isTracking, trackEffect, triggerEffect } from './effect'
import { toReactive } from './reactive'

class RefImpl {
	_val
	_rawValue
	deps = new Set()
	public readonly __v_isRef = true
	constructor(value) {
		this._val = toReactive(value)
		this._rawValue = value
	}
	get value() {
		trackRefValue(this)

		return this._val
	}

	set value(newVal) {
		if (Object.is(this._rawValue, newVal)) return

		this._val = toReactive(newVal)
		this._rawValue = newVal

		triggerEffect(this.deps)
	}
}

export function ref(value) {
	return new RefImpl(value)
}

function trackRefValue(ref) {
	if (isTracking()) {
		trackEffect(ref.deps)
	}
}

export function isRef(value) {
	return !!value.__v_isRef
}

export function unRef(value) {
	return isRef(value) ? value.value : value
}

export function proxyRefs(objectWithRefs) {
	return new Proxy(objectWithRefs, {
		get(target, key) {
			return unRef(Reflect.get(target, key))
		},
		set(target, key, value) {
			if (isRef(target[key]) && !isRef(value)) {
				return (target[key].value = value)
			} else {
				return Reflect.set(target, key, value)
			}
		},
	})
}
