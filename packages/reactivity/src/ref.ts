import { isTracking, trackEffect, triggerEffect } from './effect'
import { toReactive } from './reactive'

class RefImpl {
	_val
	_rawValue
	deps = new Set()
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
