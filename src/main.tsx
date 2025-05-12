import { BrowserRouter } from 'react-router-dom'
import { App } from './app/app'
import { createRoot } from 'react-dom/client'

const domNode = document.getElementById('root')!
createRoot(domNode).render(
    // @ts-ignore
	<BrowserRouter>
		<App />
	</BrowserRouter>,
)
