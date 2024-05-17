import { extend } from '../../shared/index'

class ActiveEffect {
	private _fn
	active = true
	deps = []
	onStop?: () => void
	constructor(func, public scheduler?) {
		this._fn = func
	}

	run() {
		activeEffect = this

		let res = this._fn()

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
	if (!activeEffect) return

	let depsMap = targetMap.get(target)
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()))
	}

	let deps = depsMap.get(key)
	if (!deps) {
		depsMap.set(key, (deps = new Set()))
	}

	if (!deps.has(activeEffect)) {
		deps.add(activeEffect)
		activeEffect.deps.push(deps)
	}
}
export function trigger(target, key) {
	let depsMap = targetMap.get(target)
	let deps = depsMap.get(key)

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
