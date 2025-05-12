import { SyncOutlined } from '@ant-design/icons'
import { type FC } from 'react'
import styles from './ReloadButton.module.sass'

export const ReloadButton: FC<ReloadButtonProps> = (props) => {
	const { loading, onClick } = props

	return <SyncOutlined className={styles.main} spin={loading} onClick={() => onClick()} />
}

export interface ReloadButtonProps {
	onClick: VoidFunction
	loading: boolean
}
