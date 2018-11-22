// My/balance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informations:[{
      information_name:'订单已取消',
      information_time:'2017-12-11 11:15'
    },{
      information_name:'平台服务协议',
      information_time:'2017-12-11 11:15'
    },{
      information_name:'小程序更新提醒',
      information_time:'2017-12-11 11:15'
    }]
  },
  get_detailed(event){
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/My/information_detailed/information_detailed?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
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