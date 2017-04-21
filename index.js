/**
 * Created on 2016/5/17.
 * @fileoverview 请填写简要的文件说明.
 * @author joc (Firstname Lastname)
 */
"use strict";

/**
 *
 * 获取对象中指定路径对应的数据
 * @param obj {?Object|string|Array=} 需要查找的对象，默认为__global__
 * @param paths {?string|Array=} 需要查找的路径，格式为"path1.0.path2"
 * @returns {*}
 */
let getDataByPath = function (obj, paths) {
    var fn = function (path) {
        var res = obj;
        path.split('.').forEach(function (p) {
            res = (res || {})[p];
        });
        return res;
    };

    if (!paths || !paths.length) {
        throw new Error('getDataByPath', 'paths can not be empty.');
    }

    if (typeof paths === 'string') {
        return fn(paths);
    }

    return paths.map(function (path) {
        return fn(path);
    });
};

/**
 *
 * 指定一个或多个路径，从传入的对象中依次查找数据，直到找到一项不是undefined类型的数据结果
 * @param obj {?Object|string|Array=} 需要查找的对象，默认为__global__
 * @param paths {?string|Array=} 需要查找的路径，格式为"path1.0.path2"
 * @returns {*}
 */
let searchUntilDefined = function (obj, paths) {
    var res;
    if (typeof paths === 'string') {
        paths = [paths];
    }

    for (var i = 0; i < paths.length; i++) {
        res = getDataByPath(obj, paths[i]);
        if (typeof res !== 'undefined') {
            return res;
        }
    }
};

/**
 * 从指定的对象中搜索满足条件的键值对，将其值替换
 * @param obj {!object}
 * @param search {!Function}
 * @param replace {?Function|Object=} 如果没有传入，则删除指定的key
 */
let searchAndReplace = function (obj, search, replace) {
    if (!obj) {
        return;
    }
    check(search, Function);
    let del = arguments.length === 2;

    traverse(obj, function (val, key, ctx) {
        if (search(val, key, ctx)) {
            if (del) {
                delete ctx[key];
                return;
            }
            ctx[key] = _.isFunction(replace) ? replace(val, key, ctx) : replace;
        }
    });
};

/**
 * 遍历指定的对象，并对每个键值对执行一些操作
 * @param obj {!object}
 * @param handle {!Function}
 */
let traverse = function (obj, handle) {
    if (!obj) {
        return;
    }
    check(handle, Function);

    _.each(obj, function (val, key, ctx) {
        if (val && _.isObject(val) && !_.isDate(val)) {
            traverse(val, handle);
            return;
        }

        handle(val, key, ctx);
    });
};

export default {
    getDataByPath,
    searchUntilDefined,
    searchAndReplace,
    traverse
};