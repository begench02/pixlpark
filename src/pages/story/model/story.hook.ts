import { Comment } from '@/entities/story/model/story.type'
import { storyStore } from '@/entities/story/model/story.store'
import { useCallback, useState } from 'react'

export const useTreeData = () => {
	const [treeData, setTreeData] = useState<Comment[]>([])

	const updateTreeData = useCallback((list: Comment[], key: React.Key, children: Comment[]): Comment[] => {
		return list.map((node) => {
			if (node.key === key) {
				return {
					...node,
					children,
				}
			}

			if (node.children?.length) {
				return {
					...node,
					children: updateTreeData(node.children, key, children),
				}
			}

			return node
		})
	}, [])

	const getTreeData = useCallback((list: Comment[], key: React.Key): Comment => {
		for (let item of list) {
			if (item.key === key) {
				return item
			}

			if (item.children && item.children.length) {
				let t = getTreeData(item.children, key)
				if (t) return t
			}
		}
	}, [])

	const loadTreeData = ({ key, children }: any) => {
		return new Promise<void>((resolve) => {
			if (children) {
				resolve()
				return
			}

			const comment = getTreeData(treeData, key)

			storyStore.getCommentsByCommentId(comment).then((res) => {
				setTreeData((origin) => updateTreeData(origin, key, res))
				resolve()
			})
		})
	}

	return [treeData, setTreeData, loadTreeData] as const
}
