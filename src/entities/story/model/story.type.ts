import { TreeDataNode } from 'antd'

type ItemType = 'job' | 'story' | 'comment' | 'poll' | 'pollopt'

type ItemDefault = {
	id: number
	deleted: boolean
	type: ItemType
	by: string
	time: number
	text: string
	dead: boolean
	parent: number
	poll: number
	kids: number[]
	url: string
	score: number
	title: string
	parts: number[]
	descendants: number
}

export type Item = Partial<ItemDefault> & Required<Pick<ItemDefault, 'id'>>
export type Items = Item[]

export type Comment = TreeDataNode & Partial<Pick<Item, 'kids'>>
export type Comments = Comment[]
