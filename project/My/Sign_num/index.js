var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    showTopTips: false,
    errorMsg: "",
    pasw_num:'password',
    smName: app.globalData.smName
  },
  onLoad: function () {
    var that = this;
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },
  // 清空账号
  delet_num(){
    this.setData({
      account:''
    })
  },
  //清空密码
  delet_psw(){
    this.setData({
      password: ''
    })
  },
  //显示密码
  show_psw: function () {
    if (this.data.pasw_num == "password") {
      this.setData({
        pasw_num: 'text'
      })
    } else {
      this.setData({
        pasw_num: 'password'
      })
    }
  },
  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用  
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var subPassword = e.detail.value.subPassword;
    var that = this;
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == util.trim(account)) {
      util.isError("账号不能为空", that);
      return;
    }else if ("" == util.trim(password)) {
      util.isError("密码不能为空", that);
      return;
    }else{
      util.isError("输入正确", that);
    }
  }
})  