import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import List from './List';
import Filter from './Filter';
import Modal from './Modal';
import { queryParse, queryString } from '../../../utils';
import { queryList, upload, updateState as updateThriftFileState, } from '../../../redux/actions/thriftFile';
import { restartApiServer, } from '../../../redux/actions/server';
import { updateState, } from '../../../redux/actions/app';

@connect(
  state => {
    return {
      thriftFileReducer: state.thriftFileReducer,
      loading: state.appReducer.loading,
      restartLoading: state.serverReducer.restartLoading,
    };
  },
  dispatch => bindActionCreators({ updateState,
    queryList, upload, updateThriftFileState, restartApiServer, dispatch,
  }, dispatch)
)
class ThriftFile extends React.Component {
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
      sorts: queries.sorts || 'updateTime_desc',
      page: Number(page || 1),
      pageSize: Number(pageSize || 20),
    });
  }

  componentWillMount() {
    // 加载列表数据
    this.reloadPage();
    // 是否有更好的解决办法
    this.unlisten = this.props.history.listen(() => {
      if (this.props.history.location.pathname === '/home/thrifts/files') {
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

  render() {
    const location = this.props.location;
    const { modalVisible, list, pagination, isMotion } = this.props.thriftFileReducer;
    const { loading, } = this.props;
    const that = this;
    const modalProps = {
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading,
      title: 'thrift文件上传',
      wrapClassName: 'vertical-center-modal',
      updateFileList: this.updateFileList,
      updateState: this.props.updateState,
      onOk(data) {
        console.log('onOk', data);
        that.props.upload(data, that.refreshPage);
      },
      onCancel() {
        console.log('onCancel');
        that.props.updateThriftFileState({
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
    };

    this.filter = queryParse(that.props.history.location.search);
    const filterProps = {
      restartLoading: this.props.restartLoading,
      restartApiServer: this.props.restartApiServer,
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
        that.props.updateThriftFileState({
          modalVisible: true,
        });
      },
    };

    return (
      <div className="content-inner">
        <Filter {...filterProps} />
        <List {...listProps} />
        {modalVisible && <Modal {...modalProps} />}
      </div>
    );
  }
};

export default ThriftFile;
