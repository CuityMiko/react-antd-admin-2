import React from 'react';
import { connect } from 'react-redux';
import { message, Row, Col, Button, Popconfirm } from 'antd';
import { bindActionCreators } from 'redux';
import List from './List';
import Filter from './Filter';
import Modal from './Modal';
import { queryParse, queryString } from '../../utils';
import { queryList, updateStatus, remove, batchRemove,
  create, update, updateThriftState, } from '../../redux/actions/thrift';
import { updateState, } from '../../redux/actions/app';

@connect(
  state => {
    return { thriftReducer: state.thriftReducer };
  },
  dispatch => bindActionCreators({ updateState, remove, batchRemove,
    queryList, create, update, updateStatus, updateThriftState, dispatch,
  }, dispatch)
)
class Thrift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  reloadPage() {
    console.warn('\n\n\n重新加载数据\n\n\n', this.props.history.location);
    // 不能使用 this.props.location中的参数，此时并未变化
    const queries = queryParse(this.props.history.location.search);
    const { page, pageSize, } = queries;
    this.props.queryList({
      ...queries,
      sorts: queries.sorts || 'id_desc',
      page: Number(page || 1),
      pageSize: Number(pageSize || 20),
    });
  }

  componentWillMount() {
    // 加载列表数据
    this.reloadPage();
    // 是否有更好的解决办法
    this.unlisten = this.props.history.listen(() => {
      if (this.props.history.location.pathname === '/home/thrifts') {
        this.reloadPage();
      }
    });
  }

  componentWillUnmount() {
    console.log('取消thrift监听');
    // 取消对路由的监听
    this.unlisten();
  }


  refreshPage = (options) => {
    const queryStr = queryString(options);
    this.props.history.push({
      pathname: this.props.location.pathname,
      search: queryStr ? `?${queryStr}` : '',
    });
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location.search !== this.props.location.search) {
  //     this.reloadPage(nextProps);
  //   }
  // }

  handleDeleteItems = () => {
    message.warn('暂不支持批量删除');
    // this.props.batchRemove(this.props.api.selectedRowKeys, this.refreshPage);
  };

  render() {
    const location = this.props.location;
    const { modalVisible, modalType, list, pagination, currentItem,
      isMotion, selectedRowKeys } = this.props.thriftReducer;
    const { loading, } = this.props;
    const that = this;
    const modalProps = {
      item: modalType === 'create' ? undefined : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading,
      title: `${modalType === 'create' ? '新增' : '修改'}`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        console.log('onOk', data);
        switch (modalType) {
          case 'create':
            // 成功回调
            that.props.create(data, that.refreshPage);
            break;
          case 'update':
            Object.assign(data, {
              id: that.props.thriftReducer.currentItem.id,
              // type: 1,
           });
            // 成功回调
            that.props.update(data, that.refreshPage);
            break;
          default:
        }
        return false;
      },
      onCancel() {
        console.log('onCancel');
        that.props.updateThriftState({
          modalVisible: false,
        });
      },
    };

    const listProps = {
      location,
      dataSource: list,
      loading,
      list: [],
      pagination,
      isMotion,
      onChange(page, filters, sorts) {
        let sortStr;
        if (sorts && sorts.field) {
          sortStr = `${sorts.field}_${sorts.order === 'descend' ? 'desc' : 'asc'}`;
        }
        that.refreshPage({
          ...queryParse(that.props.location.search),
          page: page.current,
          pageSize: page.pageSize,
          sorts: sortStr,
        });
      },
      updateItemStatus({ id, status }) {
        console.log('updateItemStatus   ', id, status);
        that.props.updateStatus({ id, status }, that.refreshPage);
      },
      onDeleteItem(id) {
        console.log('onDeleteItem   ', id);
        that.props.remove(id, that.refreshPage);
      },
      onEditItem(item) {
        console.log('onEditItem', item);
        that.props.updateThriftState({
          modalVisible: true,
          modalType: 'update',
          currentItem: item,
        });
      },
      rowSelection: {
        selectedRowKeys: this.props.thriftReducer.selectedRowKeys,
        onChange: (keys) => {
          that.props.updateThriftState({
            selectedRowKeys: keys,
          });
        },
      },
    };

    this.filter = queryParse(that.props.history.location.search);
    const filterProps = {
      filter: this.filter,
      reset: this.reset,
      onFilterChange(value) {
        console.log('onFilterChange ', value);
        that.refreshPage({
          ...value,
          page: 1,
          pageSize: pagination.pageSize,
        });
      },
      onAdd() {
        console.log('onAdd');
        that.props.updateThriftState({
          modalType: 'create',
          modalVisible: true,
        });
      },
    };

    return (
      <div className="content-inner">
        <Filter {...filterProps} />
        {
          selectedRowKeys.length > 0 &&
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`共选择 ${selectedRowKeys.length} 条 `}
              <Popconfirm title={'确定删除吗?'} placement="left" onConfirm={this.handleDeleteItems}>
                <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除</Button>
              </Popconfirm>
            </Col>
          </Row>
        }
        <List {...listProps} />
        {modalVisible && <Modal {...modalProps} />}
      </div>
    );
  }
};

export default Thrift;
