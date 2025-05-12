import { api } from '@/shared/api'
import { Item, Items, Comment } from './story.type'
import { makeAutoObservable } from 'mobx'
import DOMPurify from 'dompurify'

type StoryState = 'IDLE' | 'STALE' | 'FETCHING'
const LIMIT = 100

class Story {
	stories = new Map<number, Item>()
	comments = new Map<number, Comment[]>()
	state: StoryState = 'IDLE'
	timer: number

	constructor() {
		makeAutoObservable(this)
	}

	sortStories(stories: Item[], sortProperty: keyof Item, ascending = true) {
		return stories.sort((a, b) => {
			if (ascending) {
				return Number(a[sortProperty]) - Number(b[sortProperty])
			} else {
				return Number(b[sortProperty]) - Number(a[sortProperty])
			}
		})
	}

	async getStories() {
		if (this.stories.size && this.state == 'IDLE') return

		return this.fetchStories()
	}

	async fetchStories() {
		if (this.stories.size) {
			this.state = 'STALE'
		} else {
			this.state = 'FETCHING'
		}

		let { data } = await api.get('/topstories.json')
		if (data.length == 0) {
			console.error(new Error('No topstories [api: /topstories.json]'))
		}

		data = data.splice(0, LIMIT)

		let fetched_items_count = LIMIT
		const stories: Items = []
		return new Promise<void>((resolve) => {
			for (const story of data) {
				this.fetchItemById(story).then((data) => {
					if (!data) {
						return
					}
					stories.push(data)

					fetched_items_count--
					if (fetched_items_count == 0) {
						this.sortStories(stories, 'time', false)

						// Converting array to hash table to improve access time
						for (const story of stories) {
							this.stories.set(story.id, story)
						}

						clearTimeout(this.timer)
						this.timer = window.setTimeout(() => {
							this.state = 'STALE'
							this.fetchStories()
						}, 60_000)

						this.state = 'IDLE'
						resolve()
					}
				})
			}
		})
	}

	fetchItemById(id: number) {
		return api
			.get<Item | null>(`/item/${id}.json`)
			.then((result) => result.data)
			.catch((error) => {
				console.error(error)
			})
	}

	async getStoryById(id: number) {
		if (this.stories.has(id)) {
			return this.stories.get(id)
		}

		const stories = await this.fetchItemById(id)
		return stories
	}

	async getCommentsByStoryId(storyId: number) {
		const stories = await this.getStoryById(storyId)
		if (stories == null) return []

		if (!stories || !stories.kids) return
		if (this.comments.has(storyId)) return this.comments.get(storyId)

		let comments_count = stories.kids.length
		const comments: Comment[] = []
		return new Promise<void>((resolve) => {
			for (const commentId of stories.kids) {
				this.fetchItemById(commentId).then((comment) => {
					if (!comment) {
						comments_count--
						return
					}
					/* Не добавляем мертвые и удаленные комментарии, но подсчитывать их надо, тогда
						!(A ^ B) = (!A U !B) по закону де Моргана, где A = comment.dead, B = comment.deleted
					 */
					if (!comment?.dead && !comment?.deleted) {
						comments.push({
							title: <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text) }} />,
							key: comment.id.toString(),
							kids: comment.kids ?? [],
							isLeaf: !comment.kids || !comment.kids.length,
						})
					}

					comments_count--
					if (comments_count == 0) {
						this.comments.set(storyId, comments)
						resolve()
					}
				})
			}
		})
	}

	async updateCommentsByStoryId(storyId: number) {
		if (this.comments.has(storyId)) {
			this.comments.delete(storyId)
		}
		await this.getCommentsByStoryId(storyId)
	}

	async getCommentsByCommentId(comment: Comment): Promise<Comment[]> {
		const kids = comment.kids

		return new Promise((resolve) => {
			if (!kids || !kids.length) {
				resolve([])
				return
			}

			const comments = []
			let comments_count = kids.length
			for (const kid of kids) {
				this.fetchItemById(kid).then((data) => {
					if (!data) {
						comments_count--
						return
					}

					if (!data?.dead && !data?.deleted) {
						comments.push({
							title: <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }} />,
							key: data.id.toString(),
							kids: data.kids ?? [],
							isLeaf: !data.kids || !data.kids.length,
						})
					}

					comments_count--
					if (comments_count == 0) {
						resolve(comments)
					}
				})
			}
		})
	}
}

export const storyStore = new Story()
