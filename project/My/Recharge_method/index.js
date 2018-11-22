const app = getApp()

Page({
  data: {
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },
  onLoad: function () {
    this.showInputLayer();
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

    var val = this.data.pwdVal;

    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function () {
      wx.showToast({
        title: val,
      })
    });

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
  },

  pay: function (_payInfo, success, fail) {
    var payInfo = {
      body: '',
      total_fee: 0,
      order_sn: ''
    }
    Object.assign(payInfo, _payInfo);
    if (payInfo.body.length == 0) {
      wx.showToast({
        title: '支付信息描述错误'
      })
      return false;
    }
    if (payInfo.total_fee == 0) {
      wx.showToast({
        title: '支付金额不能0'
      })
      return false;
    }
    if (payInfo.order_sn.length == 0) {
      wx.showToast({
        title: '订单号不能为空'
      })
      return false;
    }
    var This = this;
    This.getOpenid(function (openid) {
      payInfo.openid = openid;
      This.request({
        url: 'api/pay/prepay',
        data: payInfo,
        success: function (res) {
          var data = res.data;
          console.log(data);
          if (!data.status) {
            wx.showToast({
              title: data['errmsg']
            })
            return false;
          }
          This.request({
            url: 'api/pay/pay',
            data: { prepay_id: data.data.data.prepay_id },
            success: function (_payResult) {
              var payResult = _payResult.data;
              console.log(payResult);
              wx.requestPayment({
                'timeStamp': payResult.timeStamp.toString(),
                'nonceStr': payResult.nonceStr,
                'package': payResult.package,
                'signType': payResult.signType,
                'paySign': payResult.paySign,
                'success': function (succ) {
                  success && success(succ);
                },
                'fail': function (err) {
                  fail && fail(err);
                },
                'complete': function (comp) {

                }
              })
            }
          })
        }
      })
    })
  }
})