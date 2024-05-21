import { ActiveEffect } from './effect'

class ComputedRefImpl {
	_effect
	_val
	_dirty = true
	constructor(getter) {
		this._effect = new ActiveEffect(getter, () => {
			if (!this._dirty) {
				this._dirty = true
			}
		})
	}

	get value() {
		if (this._dirty) {
			this._val = this._effect.run()
			this._dirty = false
		}
		return this._val
	}
}

export function computed(getter) {
	return new ComputedRefImpl(getter)
}
