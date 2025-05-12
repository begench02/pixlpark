import { ArrowLeftOutlined } from '@ant-design/icons'
import { convert_unix_to_date } from '@/shared/lib/date.utils'
import { Divider, Flex, Tree, Typography } from 'antd'
import { Item } from '@/entities/story/model/story.type'
import { observer } from 'mobx-react-lite'
import { ReloadButton } from 'src/widget/ReloadButton/ReloadButton'
import { storyStore } from '@/entities/story/model/story.store'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTreeData } from '../model/story.hook'
import styles from './story.module.sass'

export const Story = observer(() => {
	const history = useHistory()
	const id = +location.href.split('/').at(-1)
	const [stories, setStories] = useState<Item>(null)
	const [treeData, setTreeData, loadTreeData] = useTreeData()

	useEffect(() => {
		if (!id) location.href = '/stories'

		const getStories = async () => {
			try {
				const stories = await storyStore.getStoryById(id)
				if (!stories) {
					throw new Error('No stories')
				}
				setStories(stories)
			} catch (e) {
				setStories(() => {
					throw e
				})
			}
		}

		const getComments = () => {
			return storyStore.getCommentsByStoryId(id)
		}

		Promise.allSettled([getStories(), getComments()]).then(() => {
			setTreeData(storyStore.comments.get(id))
		})
	}, [id])

	return (
		<div key={id} className={styles.story}>
			<button onClick={() => history.goBack()} title='Назад' className={styles.goBack}>
				<ArrowLeftOutlined />
			</button>
			<div className={styles.story__header}>
				<Typography.Title>{stories?.title}</Typography.Title>

				<Typography.Paragraph>
					<a href={stories?.url} target='_blank'>
						{stories?.url}
					</a>
				</Typography.Paragraph>
			</div>
			<Divider />
			<Flex gap='large' justify='center'>
				<Typography.Paragraph>
					Автор:
					<Typography.Text strong> {stories?.by}</Typography.Text>
				</Typography.Paragraph>
				<Typography.Paragraph>
					Время:
					<Typography.Text strong> {convert_unix_to_date(stories?.time)}</Typography.Text>
				</Typography.Paragraph>
			</Flex>
			<Divider />

			<Flex justify='space-between' style={{ position: 'relative' }}>
				<Typography.Title level={4}>Комментарии ({stories?.descendants}): </Typography.Title>
				<ReloadButton
					onClick={() => storyStore.updateCommentsByStoryId(id)}
					loading={storyStore.state == 'FETCHING' || storyStore.state == 'STALE'}
				/>
			</Flex>
			{storyStore?.comments.get(id) ? <Tree loadData={loadTreeData} treeData={treeData} /> : null}
		</div>
	)
})
