// 自定义新增页签触发器
import React from 'react'
import { cloneDeep } from 'lodash' // isArray
import { hasString } from '../../utils/index'

import { Tabs } from 'antd' // Button
const TabPane = Tabs.TabPane

class TabsContainers extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            activeKey: props.panesState.activeKey, // 默认值: panes[0].key
            panes: props.panesState.panes // 默认值: [{ route, tabsProps, key }]
        }
    }

    // render 渲染之前
    componentWillMount = () => {
        this.handleChange()
    }

    // 切换面板的回调 => 切换 state.activeKey
    onChange = (activeKey) => {
        let currentKey
        let currentIndex
        let currentUrl

        this.state.panes.forEach((pane, i) => {
            if (pane.key === activeKey) {
                currentIndex = i
            }
        })
        currentKey = this.state.panes[currentIndex].key
        currentUrl = this.state.panes[currentIndex].path
        this.setActiveKey(currentKey) // 改变 activeKey
        this.props.tabsProps.history.push(currentUrl)
    }

    // 新增和删除页签的回调
    onEdit = (targetKey, action) => {
        this[action](targetKey)
    }

    // 判断 标签显示条件
    handleChange = () => {
        const arrayPanes = this.state.panes // 获取 store当中的 panes数组
        const strUrl = this.props.tabsProps.match.url // 根据当前路由状态 获取 url字符串
        const isHomeIndex = strUrl === '/home/guide'
        const hasUrl = hasString(arrayPanes, 'path', strUrl)

        if (!isHomeIndex) {
            if (hasUrl < 1) { // console.log('无 当前url')
                let currentPanes = this.setCloneObj() // 单个
                this.setActions(`${arrayPanes.length + 1}`, currentPanes) // 加入 store
            } else { // console.log('有 当前url')
                let currentKey
                arrayPanes.forEach((pane, i) => {
                    if (pane.path === strUrl) {
                        currentKey = pane.key
                    }
                })
                this.setActiveKey(currentKey)
            }
        }
    }

    // 配置 actions / 发起 actions
    setActions = (strKey, arrPanes) => {
        const previousState = cloneDeep([...this.props.panesState.panes, arrPanes]) // 深拷贝 => 将数组带入 addObj
        this.props.onAddPane({
            activeKey: strKey,
            panes: previousState
        })
    }

    // 配置 深拷贝的 cloneObj
    setCloneObj = () => {
        // 深拷贝 route 与 tabsPropss 组成的对象
        let cloneObj = cloneDeep({
            key: `${this.props.panesState.panes.length + 1}`,
            title: this.props.route.title,
            path: this.props.tabsProps.match.url
        })
        return cloneObj
    }

    // 配置 activeKey(设置显示 当前active 标签)
    setActiveKey = (strKey) => {
        this.props.onActivePane({
            activeKey: strKey
        })
    }

    // 删减 / 关闭 单个 Tabs标签 => 修改 Redux 中的数据
    remove = (targetKey) => { // targetKey === key
        let activeKey = this.state.activeKey

        let currentIndex // 当前展示的下标位置
        let currentKey // 如果要删除的标签是当前展示的, 删除后更新key 为当前位置(currentIndex)的 key
        let currentUrl // 如果要删除的标签是当前展示的, 删除后 更改url

        const currentPanes = this.state.panes.filter(pane => pane.key !== targetKey)

        if (targetKey === activeKey) {
            this.state.panes.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    currentIndex = i
                }
            })
            currentKey = currentPanes[currentIndex - 1].key
            currentUrl = currentPanes[currentIndex - 1].path
            this.props.onAddPane({
                activeKey: cloneDeep(currentKey),
                panes: cloneDeep(currentPanes)
            })
            this.props.tabsProps.history.push(currentUrl)
        } else {
            currentKey = activeKey
            this.props.onAddPane({
                activeKey: cloneDeep(currentKey),
                panes: cloneDeep(currentPanes)
            })
        }
    }

    // 当 props改变时 触发 => 调用 更改 setState的方法
    componentWillReceiveProps = (nextProps) => {
        let currentState = cloneDeep(nextProps.panesState)
        this.setState(currentState)
    }

    render () {
        const { route, tabsProps } = this.props
        return (
            <Tabs
                hideAdd
                onChange={ this.onChange } // 切换面板的回调
                activeKey={ this.state.activeKey } // 当前激活 tab 面板的 key
                type="editable-card" // 页签的基本样式
                onEdit={ this.onEdit } // 新增和删除页签的回调
            >
                {/* 内容部分 与 state.panes数组无关系 */}
                {
                    this.state.panes.map((pane) => (
                        <TabPane
                            closable={ pane.closable }
                            key={ pane.key } // this.state.activeKey // 与 store中的 panesState 绑定
                            tab={ pane.title }
                            path={ pane.path }
                        >
                            <route.component { ...tabsProps } routes={route.routes} />
                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}

export default TabsContainers
