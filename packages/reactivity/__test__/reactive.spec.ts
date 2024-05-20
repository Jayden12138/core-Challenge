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
})
