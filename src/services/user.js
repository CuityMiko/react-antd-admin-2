import { loginApi, logoutApi, updatePasswordApi, queryUserApi, queryUserMenusApi, createUserApi,
removeUserApi, batchRemoveUserApi, queryUsersApi, updateUserApi,} from '../config/api';
import HttpUtil from '../utils/httpUtil';

export const login = (data) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    data,
  }, loginApi));
};

/**
 * 退出登录接口
 * @returns {*}
 */
export const logout = () => {
  return HttpUtil.send(Object.assign({
    encode: false,
  }, logoutApi));
};

/**
 * 修改密码接口
 * @returns {*}
 */
export const updatePassword = (data) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    data
  }, updatePasswordApi));
};

/**
 * 获取个人信息详情
 * @returns {*}
 */
export const queryUser = (id) => {
  return HttpUtil.send({
    encode: false,
    url: queryUserApi.path,
    method: queryUserApi.method,
    params: { id },
  });
};

/**
 * 获取菜单权限列表
 * @returns {*}
 */
export const queryUserMenus = () => {
  return HttpUtil.send({
    encode: false,
    url: queryUserMenusApi.path,
    method: queryUserMenusApi.method,
  });
};

/**
 * 新建API
 * @param data
 * @returns {*}
 */
export const create = (data) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    data,
  }, createUserApi));
};

/**
 * 删除API delete是关键字，因此采用remove
 * @param id
 * @returns {*}
 */
export const remove = (id) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    params: { id },
  }, removeUserApi));
};

/**
 * 批量删除API
 * @param id
 * @returns {*}
 */
export const batchRemove = (ids) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    data: { ids },
  }, batchRemoveUserApi));
};

/**
 * 分页查询列表
 * @param {Object} query  url中？后的参数
 *        例如： {
 *          page: 1,
 *          pageSize: 10,
 *        }
 * @returns {*}
 */
export const queryList = (query) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    query,
  }, queryUsersApi));
};

/**
 * 查询详情
 * @param id
 * @returns {*}
 */
export const queryDetail = (id) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    params: { id },
  }, queryUserApi));
};

/**
 * 修改API
 * @param data
 * @returns {*}
 */
export const update = (data) => {
  return HttpUtil.send(Object.assign({
    encode: false,
    params: { id: data.id, },
    data,
  }, updateUserApi));
};
