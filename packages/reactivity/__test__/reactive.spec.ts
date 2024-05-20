import { isReactive, isReadonly, reactive, readonly } from '../src'

describe('reactive', () => {
	it('isReactive happy path', () => {
		const original = { foo: 1 }
		const observed = reactive(original)

		expect(isReactive(observed)).toBe(true)
		expect(isReactive(original)).toBe(false)
	})

	it('isReadonly happy path', () => {
		const original = { foo: 1 }
		const observed = readonly(original)

		expect(isReadonly(observed)).toBe(true)
		expect(isReadonly(original)).toBe(false)
	})

	it('nested object reactive', () => {
		const original = {
			nested: {
				foo: 1,
			},
			array: [{ bar: 2 }],
		}
		const observed = reactive(original)

		// 嵌套属性
		expect(isReactive(observed.nested)).toBe(true)
		expect(isReactive(observed.array)).toBe(true)
		expect(isReactive(observed.array[0])).toBe(true)
	})

	it('nested object readonly', () => {
		const original = { foo: 1, bar: { baz: 2 } }
		const observed = readonly(original)

		expect(isReadonly(observed)).toBe(true)
		expect(isReadonly(original)).toBe(false)

		// 嵌套属性
		expect(isReadonly(observed.bar)).toBe(true)
		expect(isReadonly(original.bar)).toBe(false)
	})

	it('isProxy happy path reactive', () => {
		const original = { foo: 1, bar: { baz: 2 } }

		const observed = readonly(original)

		expect(isProxy(observed)).toBe(true)
	})

	it('isProxy happy path readonly', () => {
		const original = { foo: 1, bar: { baz: 2 } }

		const observed = reactive(original)

		expect(isProxy(observed)).toBe(true)
	})
})
