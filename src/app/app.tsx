import '@/app/styles/global.sass'
import { NotFound } from '@/pages/NotFound'
import { Route, Switch, useHistory } from 'react-router-dom'
import { Stories } from '@/pages/stories/ui/stories'
import { Story } from '@/pages/story/ui/story'
import { useEffect } from 'react'

export const App = () => {
	const history = useHistory()

	useEffect(() => {
		if (window.location.pathname == '/') {
			// history.replace('/')
			history.push('stories')
		}
	}, [])

	return (
		<Switch>
			<Route exact path='/stories'>
				<Stories />
			</Route>
			<Route path='/stories/:id'>
				<Story />
			</Route>
			<Route path='*'>
				<NotFound />
			</Route>
		</Switch>
	)
}
