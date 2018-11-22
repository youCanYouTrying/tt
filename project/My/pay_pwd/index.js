var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    showTopTips: false,//提示框显示
    errorMsg: "",//错误信息
    send_code:true,//隐藏获取按钮
    reciprocal:60//定时器初始化
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({//获取系统宽高
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
    if ("" == util.trim(account)){
      util.isError("手机号不能为空", that);
      return;
    } else if (util.trim(account).length < 6 || util.trim(account).length > 12) {
      util.isError("手机号格式不正确", that);
      return;
    } else if ("" == util.trim(code)) {
      util.isError("验证码不能为空", that);
      return;
    } else {
      if(that.data.code_true==that.data.user_code){
        util.isError("输入正确", that);
        wx.navigateTo({
          url: '/My/pay_pwd2/index',
        })
      }else{
        wx.showToast({
          title: '验证码输入错误！',
        })
      }
    }
    
  },
  //手机号输入监听
  phone_code(evnt){
    this.setData({//长度
      phone_leng:evnt.detail.cursor,
      phone_value:evnt.detail.value
    })
  },
   //输入验证码监听
  user_code(event){
    //console.log(event.detail.value)
    this.setData({
      user_code:event.detail.value
    })
  },
  //获取验证码
  send_btn(){
    
    let that=this;
    console.log(that.data.phone_leng)
    let value=that.data.phone_value
    let pre=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let a=pre.test(value)
    if(a){//手机号验证正确后才能发送验证码
      that.setData({
        send_code: false
      })
      let settime = setInterval(function () {//倒计时
        let time = that.data.reciprocal
        if (time != 0) {
          time = time - 1;
          that.setData({
            reciprocal: time
          })
        } else {//清除定时器
          clearInterval(settime)
          that.setData({
            send_code: true,
            reciprocal: 60
          })
        }
      }, 1000);
      wx.request({
        url: 'http://192.168.1.219/userapi/api/setCode.html',
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data.data)
          that.setData({//正确验证码
            code_true: res.data.data
          })
        }
      })
    }else{
      wx.showToast({
        title: '手机号错误',
      })
    }
    
  }
})  