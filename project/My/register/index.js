var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    showTopTips: false,
    errorMsg: "",
    paswd:'password',
    num_phone:'',
    smName: app.globalData.smName
  },
  // 显示密码
  showpsw: function () {
    if (this.data.paswd =="password"){
      this.setData({
        paswd: 'text'
      })
    }else{
      this.setData({
        paswd: 'password'
      })
    }
    
  },
  //清空
  delet_all(){
    this.setData({
      account:''
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
  },

  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用  
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var newpwd = e.detail.value.newpwd;
    var that = this;
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == util.trim(account)) {

      util.isError("账号不能为空", that);
      return;
    } else if ("" == util.trim(password)) {
      util.isError("验证码不能为空", that);
      return;
    } else if ("" == util.trim(newpwd)) {
      util.isError("输入密码不能为空", that);
      return;
    } else if (util.trim(newpwd).length < 6 || util.trim(newpwd).length > 12) {
      util.isError("输入密码必须是6到12位", that);
      return;
    } else {
      util.isError("输入正确", that);
    }
  }
})  
