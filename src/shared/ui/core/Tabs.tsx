import React from 'react'
import { Tabs as AntTabs } from 'antd'
import type { TabsProps as AntTabsProps } from 'antd'

export type TabsProps = AntTabsProps

export const Tabs: React.FC<TabsProps> = (props) => {
	const { className, ...rest } = props
	const themedClass = ['themed-tabs', className].filter(Boolean).join(' ')
	return <AntTabs className={themedClass} {...rest} />
}

export default Tabs

