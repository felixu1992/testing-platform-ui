import request from './axios.js'
const USER = '/user/';
const USER_SIGNIN = `${USER}signin/`;
const USER_SIGNOUT = `${USER}signout/`;

const CONTACTOR = '/contactor/';
const CONTACTOR_GROUP = `${CONTACTOR}group/`;

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

const RECORD = '/record/';
const RECORD_EXPORT = `${RECORD}export/`;
const RECORD_PAGE = `${RECORD}page/`;

const REPORT = '/report/';
const REPORT_PAGE = `${REPORT}page/`

export default {
    signin: function(param,handler){
        request.post(USER_SIGNIN,param,handler);
    },
    signout : function(handler){
        request.post(USER_SIGNOUT,{},handler);
    },
    /*-------------- 联系人 ---------------*/
    // 分页查询联系人分组
    listContactorGroup: function (params, handler) {
        request.get(CONTACTOR_GROUP, params, handler)
    },
    listContactor :function(param , handler){
        request.get(CONTACTOR,param,handler);
    },
    saveContactor : function(param, handler){
        request.post(CONTACTOR,param,handler);
    },
    updateContactor : function(id,param,handler){
        request.put(`${CONTACTOR}${id}/`,param,handler);
    }

}