import { RouteProps } from 'react-router-dom'
import { Stories } from '@/pages/stories/ui/stories'
import { Story } from '@/pages/story/ui/story'

export const PagesRouter: RouteProps[] = [
	{
		path: '/stories',
		children: Stories,
	},
	{
		path: '/stories/:id',
		children: Story,
	},
]
