import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchLogin, forgetPwd, getToken, getImg } from '../../actions/auth'
import { notification, Button } from 'antd'
import classNames from 'classnames'
import { push } from 'react-router-redux'
import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailRequired: '',
      password: '',
      passwordRequired: '',
      code: '',
      codeRequired: '',
      loginTab: true,
      reload: '',
      resetDis: false,
      imgSrc: '',
      imgCode: '',
      showCode: false
    }
    notification.config({
      duration: 3,
    })
    this.onLogin = this.onLogin.bind(this)
    this.forgetPwd = this.forgetPwd.bind(this)
    this.emailChange = this.onTextboxChange.bind(this, 'email')
    this.pwdChange = this.onTextboxChange.bind(this, 'password')
    this.codeChange = this.onTextboxChange.bind(this, 'code')
    this.showLogin = this.showLogin.bind(this)
    this.getCode = this.getCode.bind(this)
  }

  componentWillMount() {
    window.addEventListener('keypress', this.enterClick.bind(this))
    getToken()
  }

  componentWillReceiveProps(nextProps) {
    const { auth, dispatch } = nextProps
    if (auth.completed) {
      if (auth.error && auth.error.message) {
        notification.error({
          message: '调用失败',
          description: auth.error.message
        })
        return
      }
    }
    if (auth.completed && auth.actionType === 'Query' && auth.userInfo) {
      if (auth.userInfo.ret_code === 0) {
        localStorage.setItem('customer', auth.userInfo.ret_set[0].customer)
        localStorage.setItem('user_role', auth.userInfo.ret_set[0].role === 'admin' ? 'justice' : 'league')
        localStorage.setItem('displayname', auth.userInfo.ret_set[0].name)
        localStorage.setItem('group', auth.userInfo.ret_set[0].type === 'internal' ? 'shield' : 'hydra')
        localStorage.setItem('owner', auth.userInfo.ret_set[0].owner)
        dispatch(push('/index'))
      } else {
        if (auth.userInfo.captcha) {
          this.getCode()
          this.setState({
            showCode: true,
            code: ''
          })
        }
        notification.error({
          message: '登录失败',
          description: auth.userInfo.ret_msg
        })
      }
    }
    if (auth.completed && auth.actionType === 'Update') {
      if (auth.userInfo.ret_code === 0) {
        notification.success({
          message: '发送成功',
          description: '请登录邮箱查看'
        })
        let time = 60
        const setInter = setInterval(() => {
          if (time === 0) {
            clearInterval(setInter)
            this.setState({
              reload: '',
              resetDis: false
            })
          } else {
            this.setState({
              reload: time,
              resetDis: true
            })
            time -= 1
          }
        }, 1000)
      } else {
        notification.error({
          message: '发送失败',
          description: auth.userInfo.ret_msg
        })
      }
    }
  }

  onLogin() {
    const { email, password, code, imgCode, showCode } = this.state
    const { dispatch } = this.props
    let requireRlt = 0
    requireRlt = this.txtEmptyRequire('email', email)
    if (requireRlt > 0) return
    requireRlt = this.txtEmptyRequire('password', password)
    if (requireRlt > 0) return
    if (password.length < 6) {
      this.setState({
        ['passwordRequired']: "密码不能为空且至少6位"
      })
      requireRlt = 1
    }
    if (requireRlt > 0) return
    if (showCode) {
      requireRlt = this.txtEmptyRequire('code', code)
      if (requireRlt > 0) return
    }
    const loginInfo = {
      username: email,
      password
    }
    if (showCode) {
      loginInfo.captcha_value = code
      loginInfo.captcha_key = imgCode
    }
    dispatch(fetchLogin(loginInfo))
  }

  onTextboxChange(key, e) {
    let value = e.target.value
    value = value.trim()
    if (value.length >= 0) {
      this.setState({
        [key]: value,
        [`${key}Required`]: ''
      })
    }
  }

  forgetPwd() {
    const { email } = this.state
    const { dispatch } = this.props
    const requireRlt = this.txtEmptyRequire('email', email)
    if (requireRlt > 0) return
    const userInfo = {
      username: email
    }
    dispatch(forgetPwd(userInfo))
  }

  showLogin() {
    this.setState({
      loginTab: !this.state.loginTab,
      emailRequired: '',
      passwordRequired: '',
      email: '',
      password: '',
      code: ''
    })
  }

  txtEmptyRequire(key, value) {
    let stateValue = ''
    stateValue = value.length === 0 ? '不能为空' : ''
    this.setState({
      [`${key}Required`]: stateValue
    })
    return stateValue.length
  }

  enterClick(e) {
    if (e.charCode === 13) {
      this.onLogin()
    }
  }

  getCode() {
    const callback = (data) => {
      if (data.ret_code === 0) {
        this.setState({
          imgSrc: `${location.origin}/portal/captcha/load${data.ret_set.captcha_image}`,
          imgCode: data.ret_set.captcha_key
        })
      }
    }
    getImg(callback)
  }

  render() {
    const { email, password, emailRequired, passwordRequired, loginTab, reload, resetDis, codeRequired, code, imgSrc, showCode } = this.state
    return (
      <div className="login-background login-backcolorgrey">
        <div className="login-paper">
          <div className="login-left-img">
            <div className={`login-img`}>
              <img src="../assets/img/loginlogo.png" style={{ width: 260 }} />
            </div>
            <div className="login-title">
              <span>客&nbsp;户&nbsp;自&nbsp;助&nbsp;服&nbsp;务&nbsp;平&nbsp;台</span>
            </div>
          </div>
          <div style={{ display: 'inline-block' }} className={`div-shadow ${classNames({ mgTop30: !showCode })}`} >
            <div className={classNames({ hidden: !loginTab })}>
              <div className="login-form">
                <div className={`login-txtbox ${classNames({ errborder: emailRequired })}`} style={{ marginTop: 40 }}>
                  <span style={{ color: 'c3c3c3' }}><img className="login-txt-img" src="/assets/img/uname.png" alt="" />|</span><input type="text" value={email} placeholder="填写用户名" onChange={this.emailChange} />
                </div>
                <span className="login-err-user">{emailRequired}</span>
                <div className={`login-txtbox ${classNames({ errborder: passwordRequired })}`}>
                  <span style={{ color: 'c3c3c3' }}><img className="login-txt-img" src="/assets/img/pwd.png" alt="" />|</span><input type="password" value={password} placeholder="填写密码" onChange={this.pwdChange} />
                </div>
                <span className="login-err-pwd">{passwordRequired}</span>
                <div className={classNames({ hidden: !showCode })}>
                  <div className={`login-txtbox ${classNames({ errborder: codeRequired })}`}>
                    <span style={{ color: 'c3c3c3' }}><img className="login-txt-img" src="/assets/img/code.png" alt="" />|</span><input style={{ width: 110 }} type="text" value={code} placeholder="填写验证码" onChange={this.codeChange} />
                    <img className="login-code" src={imgSrc} alt="点击刷新" onClick={this.getCode} />
                  </div>
                  <span className="login-err-code">{codeRequired}</span>
                </div>
              </div>
              <div className="login-btn">
                <Button type="primary" onClick={this.onLogin}>登录</Button>
              </div>
              <div className="login-remember">
                <a href="javascript:void(0)" onClick={this.showLogin}>忘记密码</a>
              </div>
            </div>
            <div className={classNames({ hidden: loginTab })}>
              <div className="login-pwd-title">
                <span>重置密码</span>
              </div>
              <div className="login-form">
                <div className={`login-txtbox ${classNames({ errborder: emailRequired })}`}>
                  <span style={{ color: 'c3c3c3' }}><img style={{ width: 25, verticalAlign: 'middle', marginRight: 12 }} src="/assets/img/uname.png" alt="" />|</span><input type="text" placeholder="填写用户名" value={email} onChange={this.emailChange} />
                </div>
                <span className="login-err-user">{emailRequired}</span>
              </div>
              <div className="login-btn">
                <Button type="primary" onClick={this.forgetPwd} disabled={resetDis}>发送重置密码邮件 {reload}</Button>
              </div>
              <div className="login-remember" style={{ marginBottom: 63 }}>
                <a href="javascript:void(0)" onClick={this.showLogin}>返回登录</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(Login)
