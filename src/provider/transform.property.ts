export function transformProperty(value: any, propertyName?: string) {
	if (typeof value !== 'string') {
		return false
	}

	if (propertyName === 'email') {
		return value.toLowerCase()
	}

	const lowerCased = value.toLocaleLowerCase('TR')
	return lowerCased
}
