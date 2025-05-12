import { convert_unix_to_date } from '@/shared/lib/date.utils'
import { Flex, Typography, List } from 'antd'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ReloadButton } from 'src/widget/ReloadButton/ReloadButton'
import { storyStore } from '@/entities/story/model/story.store'
import { useEffect } from 'react'
import styles from './stories.module.sass'

export const Stories = observer(() => {
	useEffect(() => {
		storyStore.getStories()
	}, [])

	return (
		<div className={styles.stories}>
			<List
				itemLayout='vertical'
				size='large'
				loading={storyStore.state == 'FETCHING'}
				dataSource={[...Array.from(storyStore.stories.values())]}
				renderItem={(story) => (
					<>
						<List.Item key={story.id}>
							<Flex justify='space-between' align='center'>
								<div>
									<Typography.Title level={3}>
										<Link to={`/stories/${story.id.toString()}`}>{story.title}</Link>
									</Typography.Title>
									<Typography.Paragraph>Score: {story.score}</Typography.Paragraph>
								</div>
								<div>
									<Typography.Paragraph>{convert_unix_to_date(story.time)}</Typography.Paragraph>
									<Typography.Paragraph>by: {story.by}</Typography.Paragraph>
								</div>
							</Flex>
						</List.Item>
					</>
				)}
			/>

			{storyStore.state !== 'FETCHING' && (
				<ReloadButton loading={storyStore.state == 'STALE'} onClick={() => storyStore.fetchStories()} />
			)}
		</div>
	)
})
