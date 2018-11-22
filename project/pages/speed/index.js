var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // order_id:1,
    smName: app.globalData.smName
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      smName: app.globalData.smName ||'系统',
      status:options.sta,
      order_id:options.order_id
    })
    
  const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
    this.initializationData()
  },
  //数据初始化
  initializationData(){
    let that=this
    com.sentHttpRequestToServer(
      '/userapi/order/order_info',
      {
        id:this.data.order_id ,
      },
      'GET',
      function (res) {
        console.log(res.data.data)
        let status=res.data.data.apply_refund.status
        let showtext=''
        switch(status){
            case 0:
              showtext='订单正在退款中';
              break;
            case 1:
              showtext='订单正在退款中';
              break;
            case 2:
              showtext='订单正在退款中';
              break;
            case 3:
              showtext='退款成功';
              break;
            case 4:
              showtext='退款失败';
              break;
            case 5:
              showtext='商家拒绝退款';
              break;  
            default:
              showtext='不存在该状态'
        }
        let rider_phone=res.data.data.rider ? res.data.data.rider.phone:'11111 '
        let shop_phone=res.data.data.shop.shop_phone ? res.data.data.shop.shop_phone:'2222'

        that.setData({
          items:res.data.data,
          showtext:showtext,
          rider_phone:rider_phone,
          shop_phone:shop_phone
        })
      },
      function (res) {
        console.log(res)
      }
    );
  },
  //跳转到退款详情
  go_details(){
    let that=this
    wx.navigateTo({
      url: '/pages/Speed_progress/index?order_id='+that.data.order_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //打电话
  call_order(event) {
    let num = event.currentTarget.dataset.num
    if (num == 1) {
      wx.makePhoneCall({//骑手
        phoneNumber:this.data.rider_phone
      })
    } else if (num == 2) {//商家
      wx.makePhoneCall({
        phoneNumber:this.data.shop_phone
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})