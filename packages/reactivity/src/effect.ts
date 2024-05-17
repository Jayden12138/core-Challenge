class ActiveEffect {
	private _fn
	constructor(func) {
		this._fn = func
	}

	run() {
		activeEffect = this

		this._fn()
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

	deps.forEach(effect => effect.run())
}

export function effect(func) {
	const _effect = new ActiveEffect(func)
	_effect.run()
}
