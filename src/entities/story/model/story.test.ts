import { storyStore } from './story.store'
import { act } from '@testing-library/react'

beforeEach(async () => {
	jest.useFakeTimers()
	storyStore.stories.clear()
	storyStore.comments.clear()
	storyStore.state = 'IDLE'
})

afterAll(() => {
	jest.useRealTimers()
	storyStore.stories.clear()
	storyStore.comments.clear()
})

describe('Story store', () => {
	test('sorting functionality: ', async () => {
		const stories = [
			{
				title: 'Story 1',
				time: 39299481,
				id: 43294301432,
			},
			{
				title: 'Story 2',
				time: 39299482,
				id: 4329434310,
			},
		]
		const sorted_stories = storyStore.sortStories(stories, 'time', false)
		expect(sorted_stories[0].time).toBeGreaterThanOrEqual(sorted_stories[1].time)
	})
})

it('should change state during operations', async () => {
	await act(async () => {
		const promise = storyStore.fetchStories()
		expect(storyStore.state).not.toBe('IDLE')
		await promise
		expect(storyStore.state).toBe('IDLE')
	})
})

describe('Fetching functionality', () => {
	it('should fetch and store stories', async () => {
		await act(async () => {
			await storyStore.fetchStories()
		})

		expect(storyStore.stories.size).toBeGreaterThan(0)
		const firstStory = Array.from(storyStore.stories.values())[0]
		expect(firstStory).toHaveProperty('id')
	})
})

describe('Comment Handling', () => {
	it('should fetch comments for a story', async () => {
		await act(async () => {
			await storyStore.fetchStories()
		})

		const testStory = Array.from(storyStore.stories.values()).find((s) => s.descendants > 0)
		if (!testStory) {
			console.warn('No story with comments found - skipping test')
			return
		}

		await act(async () => {
			await storyStore.getCommentsByStoryId(testStory.id)
		})

		expect(storyStore.comments.get(testStory.id)).toBeDefined()
		expect(storyStore.comments.get(testStory.id)?.length).toBeGreaterThan(0)
	})

	it('should update comments', async () => {
		await act(async () => {
			await storyStore.fetchStories()
		})

		const testStory = Array.from(storyStore.stories.values()).find((s) => s.descendants > 0)
		if (!testStory) {
			console.warn('No story with comments found - skipping test')
			return
		}

		const initialCount = storyStore.comments.size
		await act(async () => {
			await storyStore.updateCommentsByStoryId(testStory.id)
		})

		expect(storyStore.comments.size).toBe(initialCount + 1)
	})
})
