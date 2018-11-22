// home/login/login.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    obj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTheme()
  },
  onGotUserInfo:function(){
    wx.navigateBack()
    // wx.reLaunch({
    //   url: '../../home/home_page/index',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },

  getTheme: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/userapi/index/meta_data',
      method: "GET",
      success:res=> {
          let _obj = {};
        if (res.statusCode == 200){
          _obj = res.data.data;
          that.setData({
            obj:_obj
          })
        }
      },
      fail: function (err) {

      },
      complete: res => {
    
      }
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