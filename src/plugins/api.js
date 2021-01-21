import request from './axios.js';

const USER = '/user/';
const USER_SIGNIN = `${USER}signin/`;
const USER_SIGNOUT = `${USER}signout/`;

const CONTACTOR = '/contactor/';
const CONTACTOR_GROUP = `${CONTACTOR}group/`;
const CONTACTOR_TREE = `${CONTACTOR}group/tree/`;

const FILE = '/file/';
const FILE_GROUP = `${FILE}group/`;
const FILE_DOWNLOAD = `${FILE}download/`;

const PROJECT = '/project/';
const PROJECT_COPY = `${PROJECT}copy/`;
const PROJECT_EXECUTE = `${PROJECT}execute/`;
const PROJECT_GROUP = `${PROJECT}group/`;


const CASE = '/case/';
const CASE_COMPATIBLE = `${CASE}compatible/`;
const CASE_COPY = `${CASE}copy/`;
const CASE_EXECUTE = `${CASE}execute/`;
const CASE_EXPORT = `${CASE}export/`;
const CASE_IMPORT = `${CASE}import/`;
const CASE_SORT = `${CASE}sort/`;

const RECORD = '/record/';
const RECORD_EXPORT = `${RECORD}export/`;
const RECORD_PAGE = `${RECORD}page/`;

const REPORT = '/report/';
const REPORT_PAGE = `${REPORT}page/`

export default {
    signin: function (param, handler) {
        request.post(USER_SIGNIN, param, handler);
    },
    signout: function (handler) {
        request.post(USER_SIGNOUT, {}, handler);
    },
    notification: function (notification, msg, desc, type) {
        switch (type) {
            case 'info':
                notification.info({
                    message: msg,
                    description: desc,
                    duration: 3
                });
                break;
            case 'error':
                notification.error({
                    message: msg,
                    description: desc,
                    duration: 3
                });
                break;
            case 'warn':
                notification.warn({
                    message: msg,
                    description: desc,
                    duration: 3
                });
                break;
            default:
                break;
        }
    },
    /*-------------- 联系人 ---------------*/
    // 分页查询联系人分组
    listContactorGroup: function (params, handler) {
        request.get(CONTACTOR_GROUP, params, handler)
    },
    // 删除联系人分组
    deleteContactGroup: function (id, params, handler) {
        request.delete(`${CONTACTOR_GROUP}${id}/`, params, handler)
    },
    // 新增联系人分组
    createContactGroup: function (params, handler) {
        request.post(CONTACTOR_GROUP, params, handler)
    },
    // 更新联系人分组
    updateContactGroup: function (id, params, handler) {
        request.put(`${CONTACTOR_GROUP}${id}/`, params, handler)
    },
    // 查询联系人树
    treeContactor: function (params, handler) {
        request.get(CONTACTOR_TREE, params, handler)
    },
    listContactor: function (param, handler) {
        request.get(CONTACTOR, param, handler);
    },
    saveContactor: function (param, handler) {
        request.post(CONTACTOR, param, handler);
    },
    updateContactor: function (id, param, handler) {
        request.put(`${CONTACTOR}${id}/`, param, handler);
    },
    /*-------------- 文件 ---------------*/
    // 分页查询文件分组
    listFileGroup: function (params, handler) {
        request.get(FILE_GROUP, params, handler)
    },
    // 删除文件分组
    deleteFileGroup: function (id, params, handler) {
        request.delete(`${FILE_GROUP}${id}/`, params, handler)
    },
    // 新增文件分组
    createFileGroup: function (params, handler) {
        request.post(FILE_GROUP, params, handler)
    },
    // 更新文件分组
    updateFileGroup: function (id, params, handler) {
        request.put(`${FILE_GROUP}${id}/`, params, handler)
    },
    // 新增文件
    createFile: function (params, handler, config) {
        request.post(FILE, params, handler, config)
    },
    // 更新文件
    updateFile: function (id, params, handler) {
        request.put(`${FILE}${id}/`, params, handler)
    },
    // 删除文件
    deleteFile: function (id, params, handler) {
        request.delete(`${FILE}${id}/`, params, handler)
    },
    // 分页查询文件
    listFile: function (params, handler) {
        request.get(FILE, params, handler)
    },
    getFile: function (id, params, handler) {
        request.get(`${FILE}${id}/`, params, handler)
    },
    // 文件下载
    downloadFile: function (id, params, handler) {

    },
    /*-------------- 项目分组 ---------------*/
    // 分页查询项目分组
    listProjectGroup: function (params, handler) {
        request.get(PROJECT_GROUP, params, handler)
    },
    // 删除项目分组
    deleteProjectGroup: function (id, params, handler) {
        request.delete(`${PROJECT_GROUP}${id}/`, params, handler)
    },
    // 新增项目分组
    createProjectGroup: function (params, handler) {
        request.post(PROJECT_GROUP, params, handler)
    },
    // 更新项目分组
    updateProjectGroup: function (id, params, handler) {
        request.put(`${PROJECT_GROUP}${id}/`, params, handler)
    },

    /*-------------- 项目 ---------------*/
    // 分页查询项目
    listProject: function (params, handler) {
        request.get(PROJECT, params, handler)
    },
    // 删除项目
    deleteProject: function (id, params, handler) {
        request.delete(`${PROJECT}${id}/`, params, handler)
    },
    // 新增项目
    createProject: function (params, handler) {
        request.post(PROJECT, params, handler)
    },
    // 更新项目
    updateProject: function (id, params, handler) {
        request.put(`${PROJECT}${id}/`, params, handler)
    },
    // 查询项目
    getProject: function (id, params, handler) {
        request.get(`${PROJECT}${id}/`, params, handler)
    },
    // 执行项目
    executeProject: function (params, handler) {
        request.post(PROJECT_EXECUTE, params, handler)
    },
    /*-------------- 用例 ---------------*/
    // 分页查询用例
    listCase: function (params, handler) {
        request.get(CASE, params, handler)
    },
    getCase: function (id, params, handler) {
        request.get(`${CASE}${id}/`, params, handler)
    },
    // 创建用例
    createCase: function (params, handler) {
        request.post(CASE, params, handler)
    },
    // 更新用例
    updateCase: function (id, params, handler) {
        request.put(`${CASE}${id}/`, params, handler)
    },
    // 用例排序
    sortCase: function (params, handler) {
        request.put(CASE_SORT, params, handler)
    },
    // 删除用例
    deleteCase: function (id, params, handler) {
        request.delete(`${CASE}${id}/`, params, handler)
    },
    // 执行用例
    executeCase: function (params, handler) {
        request.post(CASE_EXECUTE, params, handler)
    },
    // 复制用例
    copyCase: function (params, handler) {
        request.post(CASE_COPY, params, handler)
    },
    /*-------------- 记录 ---------------*/
    // 分页查询记录
    listRecord: function (params, handler) {
        request.get(RECORD, params, handler)
    },
    // 删除记录
    deleteRecord: function (id, params, handler) {
        request.delete(`${RECORD}${id}/`, params, handler)
    },
    // 分页查询报告
    listReport: function (params, handler) {
        request.get(REPORT, params, handler)
    },
    // 查询报告详情
    getReport: function (id, params, handler) {
        request.get(`${REPORT}${id}/`, params, handler)
    }
}
