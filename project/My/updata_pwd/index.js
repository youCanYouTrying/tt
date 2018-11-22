var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    showTopTips: false,
    errorMsg: ""
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
    var code = e.detail.value.code;
    var that = this;
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == util.trim(account)) {
      util.isError("密码不能为空", that);
      return;
    } else if (util.trim(account).length < 6 || util.trim(account).length >12) {
      util.isError("输入密码格式不正确", that);
      return;
    } else if ("" == util.trim(password)) {
      util.isError("确认密码不能为空", that);
      return;
    } else if (util.trim(account) != util.trim(password)){
      util.isError("确认密码与输入密码不一致", that);
      return;
    } else if ("" == util.trim(code)){
      util.isError("验证码不能为空", that);
      return;
    } else {
      util.isError("输入正确", that);
    }
  }
})  