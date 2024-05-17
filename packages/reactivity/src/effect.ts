class ActiveEffect {
	private _fn
	constructor(func, public scheduler?) {
		this._fn = func
	}

	run() {
		activeEffect = this

		let res = this._fn()

		return res
	}
}

const targetMap = new Map()
let activeEffect
export function track(target, key) {
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

	return _effect.run.bind(_effect)
}
