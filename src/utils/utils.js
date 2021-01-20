"use strict";
import '@/plugins/api'

// 获取参数的类型
export const getDataType = (data) => {
    if (typeof data === 'object') {
        // 对象
        if (Object.prototype.toString.call(data) === "[object Null]") {
            // null
            return 'null'
        } else if (Object.prototype.toString.call(data) === "[object Array]") {
            // []
            return 'array'
        } else if (Object.prototype.toString.call(data) === "[object Object]") {
            // {}
            return 'object'
        }
    } else {
        // 除 null 的基本数据类型
        if (typeof data === 'string' && data.startsWith('file:')) {
            return 'file'
        }
        return 'common'
    }
}

// 将 json 转为 antd-vue 树形结构需要的数据结构
export const json2TreeData = (data, _prekey, _tns, _data) => {
    const tns = _tns || _data;
    // 判断子元素的数据类型
    let dataType = getDataType(data)
    switch (dataType) {
        case 'object':
            const children = []
            // 记录key值，目的为了寻找对应的插入位置
            for (let i in data) {
                const key = i
                if (getDataType(data[i]) === 'common' || getDataType(data[i]) === 'null') {
                    tns.push({
                        title: `${key}`,
                        key: key
                    })
                    // 如果没有子元素了，一定要插入一个占位符，不然会错位
                    children.push('noChild')
                } else {
                    tns.push({
                        title: key,
                        key
                    })
                    children.push(key)
                }
            }
            children.forEach((key, index) => {
                //寻找对应的插入位置，若没有子元素了，直接返回，如果有，插入key值为children的数组，再次调用函数
                if (key === 'noChild') {
                    return tns
                } else {
                    tns[index].children = []
                    json2TreeData(data[key], key, tns[index].children, null)
                }
            })
            break;
        case 'array':
            // 数组以下标作为key
            data.forEach((value, index) => {
                tns.push({
                    title: '' + index,
                    key: index
                })
                tns[index].children = []
                json2TreeData(data[index], index, tns[index].children, null)
            });
            break;
        default:
            tns.push({
                title: data,
                key: _prekey
            })
    }
}

// 将 json 转为 json-schema 格式
export const json2JsonSchema = (json, schema) => {
    const jsonSchema = schema;
    switch (getDataType(json)) {
        // 对象
        case 'object':
            jsonSchema.type = 'object';
            jsonSchema.properties = {};
            for (let key in json) {
                jsonSchema.properties[key] = {}
                json2JsonSchema(json[key], jsonSchema.properties[key]);
            }
            break;
        case 'array':
            jsonSchema.type = 'array';
            jsonSchema.items = {
                type: 'common',
            };
            jsonSchema.properties = {};
            json.forEach((value, index) => {
                jsonSchema.properties[`field_${index}`] = {}
                json2JsonSchema(value, jsonSchema.properties[`field_${index}`])
            })
            break;
        case 'file':
            jsonSchema.type = 'file';
            jsonSchema.title = json.substr(5)
            break;
        case 'common':
            jsonSchema.type = 'common';
            jsonSchema.title = json;
            break;
        default:
            break;
    }
}

// 将 json-schema 转为 json 格式
export const jsonSchema2Json = (schema) => {
    switch (schema.type) {
        case 'object':
            const obj = {}
            for (let field in schema.properties) {
                const value = jsonSchema2Json(schema.properties[field])
                if (value !== undefined && value !== null)
                    obj[field] = value
            }
            return obj;
        case 'array':
            const arr = [];
            let type = null;
            for (let field in schema.properties) {
                const sub = schema.properties[field]
                if (type === null) type = sub.type
                else if (sub.type !== type) throw new Error('数组类型不一致，请检查')
                const value = jsonSchema2Json(sub)
                if (value !== undefined && value !== null)
                    arr.push(value)
            }
            return arr;
        case 'file':
            if (schema.title !== null && schema.title !== undefined)
                return `file:${schema.title}`
            break
        case 'common':
            if (schema.title !== null && schema.title !== undefined)
                return schema.title;
            break
        default:
            break;
    }
}
