/*
 * @Author: your name
 * @Date: 2020-05-27 09:01:09
 * @LastEditTime: 2020-06-01 10:53:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue\src\api\index.js
 */
import request from '@/utils/request'
import qs from 'qs'
import { Form } from 'element-ui'
// const url = '/api'
const url = ''

/**
 * 获取赛事新鲜事列表
 */
export function getnews (params) {
  return request({
    url: url + '/myInterFace/NewThing.ashx',
    params,
    method: 'get'
  })
}

/**
 * 删除赛事新鲜事
 */
export function deleteThing (id) {
  return request({
    url: url + '/myInterFace/NewThing.ashx',
    params: {
      flag: 'deleteThing',
      thingId: id
    },
    method: 'post'
  })
}

/**
 * 评论
 */
export function apicomment (data) {
  return request({
    url: url + '/myInterFace/NewThing.ashx',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      commentContent: data.commentContent
    }),
    params: {
      flag: 'thingComment',
      thingId: data.thingId,
      ContentId: data.ContentId
    },
    method: 'post'
  })
}

/**
 * 点赞
 */
export function apilike (id) {
  return request({
    url: url + '/myInterFace/NewThing.ashx',
    params: {
      flag: 'thingLike',
      thingId: id
    },
    method: 'post'
  })
}

/**
 * 取消点赞
 */
export function deletelike (id) {
  return request({
    url: url + '/myInterFace/NewThing.ashx',
    params: {
      flag: 'deleteLike',
      thingId: id
    },
    method: 'post'
  })
}

/**
 * 删除评论
 */
export function apiDelComment (id) {
  return request({
    url: url + '/myInterFace/NewThing.ashx',
    params: {
      flag: 'deleteComment',
      id: id
    },
    method: 'post'
  })
}

/**
 * 微信功能初始化
 */
export function apiWxJSAPI () {
  return request({
    url: url + '/myInterFace/wxConfig.ashx?flag=share',   
    method: 'get'
  })
}

/**发布新鲜事  http://www.supwk.com/myInterFace/NewThing.ashx?flag=publishNewThing
 * @param form form表单
*/
export function publishNewThing(form){
  return request({
    url:url + '/myInterFace/NewThing.ashx?flag=publishNewThing',
    params:form,
    config :{
      //formData  提交请求头有两种 multipart/form-data  和 application/x-www-form-urlencoded
      // multipart/form-data   用于type=file 的input提交
      headers: {
             "Content-Type": "multipart/form-data"
      }
   },
    method:'post'
  });
}
