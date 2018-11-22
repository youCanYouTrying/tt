// My/pay_pwd2/index.js
const app = getApp()

Page({
  data: {
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },
  onLoad: function (options) {
    this.showInputLayer();
    console.log(options.val)
    this.setData({
      first_pwd:options.val
    })
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
  },
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function () {
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {
    //支付密码
    var val = this.data.pwdVal;
    var first_pwd=this.data.first_pwd
    if (val == first_pwd) {
      this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
        wx.showToast({
          title: '设置成功！',
          duration: 1500,
          success: function () {//提示后再跳转
            setTimeout(function () {
              wx.navigateBack({
                delta: 3
              })
            }, 1500);

          }
        })
      });
    }else{
      wx.showToast({
        title: '请再次确认密码！',
        image:'/image/banla_close.png'
      })
    }
    

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({ pwdVal: e.detail.value });

    if (e.detail.value.length >= 6) {
      this.hidePayLayer();
    }
  }
})