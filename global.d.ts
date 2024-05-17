import { it, expect, describe, jest } from 'bun:test'

declare global {
	var it: typeof it
	var expect: typeof expect
	var describe: typeof describe
	var jest: typeof jest
}
