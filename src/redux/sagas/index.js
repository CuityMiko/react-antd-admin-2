/**
 * @description  异步调度中心
 * @author yq
 * @date 2017/9/9 下午3:46
 */
// saga 模块化引入
import { all } from 'redux-saga/effects';

// 异步逻辑
import { userSagas } from './user';
import { apiSagas } from './api';
import { thriftSagas } from './thrift';
import { thriftFileSagas } from './thriftFile';
import { serverSagas } from './server';

// 单一进入点，一次启动所有 Saga
export default function* rootSaga() {
  yield all([
    ...userSagas,
    ...apiSagas,
    ...thriftSagas,
    ...thriftFileSagas,
    ...serverSagas,
  ]);
}
