import { AUTH } from '../constants/ActionTypes'
import { action, restAction, thunkAction } from '../utils/ActionHelper'
import { browserHistory } from 'react-router'

const authFlow = {
  request: () => action(AUTH.REQUEST),
  success: (response) => action(AUTH.SUCCESS, { ...response }),
  failure: (error) => action(AUTH.FAILURE, { ...error })
}

function actionCallback(url, param, callback) {
  return restAction.POST(url, param)
    .then(response => response.json())
    .then(json => {
      if (json.ret_code === 1014) {
        browserHistory.push('login')
      }
      if (callback) {
        callback(json)
      }
    })
}
function actionGetCallback(url, callback) {
  return restAction.GET(url)
    .then(response => response.json())
    .then(json => {
      if (callback) {
        callback(json)
      }
    })
}

export function actionPostBack(param, callback) {
  return actionCallback('api/', param, callback)
}


export function getToken() {
  fetch(`${location.origin}/portal/login/`, {
    method: "get",
    credentials: 'include'
  }).then((res) => {
    console.log('ok')
  })
}


export function getImg(callback) {
  return actionGetCallback('captcha/load', callback)
}

export function fetchLogin(loginInfo) {
  return thunkAction.POST(authFlow, 'login/', { actionType: 'Query', data: loginInfo })
}

export function fetchLogout() {
  return thunkAction.GET(authFlow, 'logout/', { actionType: 'Query' }, false)
}

export function forgetPwd(username) {
  return thunkAction.POST(authFlow, 'password/forget/', { actionType: 'Update', data: username })
}

export function fetchModifyPassword(userId, pwdInfo) {
  return thunkAction.PUT(authFlow, 'users/' + userId, { actionType: 'Update', data: pwdInfo })
}

export function resetPwdCallback(params, callback) {
  return actionCallback('password/reset/', params, callback)
}

export function updatePwdCallback(params, callback) {
  return actionCallback('password/change/', params, callback)
}



function asyncPost(url, param) {
  return new Promise((resolve, reject) => {
    restAction.POST(url, param)
      .then(res => {
        if (res.ok) {
          return resolve(res.json())
        } else {
          return reject(res)
        }
      })
  })
}

export function asyncPostJson(param) {
  return asyncPost('api/', param)
}