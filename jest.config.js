const config = {
	preset: 'ts-jest',
	testMatch: ['**/*.test.ts'],
	moduleNameMapper: {
		'@/(.*)': '<rootDir>/src/$1',
	},
	testEnvironment: 'jsdom',
}

export default config
