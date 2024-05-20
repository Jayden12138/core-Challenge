import { extend } from '../../shared/index'

let shouldTrack
class ActiveEffect {
	private _fn
	active = true
	deps = []
	onStop?: () => void
	constructor(func, public scheduler?) {
		this._fn = func
	}

	run() {
		if (!this.active) {
			return this._fn()
		}

		activeEffect = this
		shouldTrack = true

		let res = this._fn()

		shouldTrack = false

		return res
	}

	stop() {
		if (this.active) {
			cleanupEffect(this)
			if (this.onStop) {
				this.onStop()
			}
			this.active = false
		}
	}
}

function cleanupEffect(effect) {
	effect.deps.forEach((dep: any) => {
		dep.delete(effect)
	})

	effect.deps.length = 0
}

const targetMap = new Map()
let activeEffect
export function track(target, key) {
	if (!isTracking()) return

	let depsMap = targetMap.get(target)
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()))
	}

	let deps = depsMap.get(key)
	if (!deps) {
		depsMap.set(key, (deps = new Set()))
	}

	trackEffect(deps)
}

export function trackEffect(deps) {
	if (!deps.has(activeEffect)) {
		deps.add(activeEffect)
		activeEffect.deps.push(deps)
	}
}

export function trigger(target, key) {
	let depsMap = targetMap.get(target)
	let deps = depsMap.get(key)

	triggerEffect(deps)
}

export function triggerEffect(deps) {
	deps.forEach(effect => {
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run()
		}
	})
}

export function effect(func, options: any = {}) {
	const _effect = new ActiveEffect(func, options.scheduler)
	_effect.run()

	extend(_effect, options)

	const runner: any = _effect.run.bind(_effect)

	runner._effect = _effect

	return runner
}

export function stop(runner) {
	runner._effect.stop()
}

export function isTracking() {
	return shouldTrack && activeEffect !== undefined
}
