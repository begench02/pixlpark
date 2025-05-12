export const convert_unix_to_date = (unix_time: number) => {
	if (!unix_time) return

	const date = new Date(unix_time * 1000)
	const date_format = new Intl.DateTimeFormat('ru-RU', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	})

	return date_format.format(date)
}
