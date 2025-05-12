import { Error } from '@/pages/error/ui/error'
import React from 'react'

type Props = {
	children?: React.ReactNode
}

type State = {
	hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
	public state: State = {
		hasError: false,
	}

	static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) {
			return <Error />
		}

		return this.props.children
	}
}
