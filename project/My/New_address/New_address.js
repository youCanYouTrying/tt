// My/balance/index.js
var amap= require('../../map/amap-wx.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:1,
    lable:1,
    address:'',
    src: "",
    m_latitude: null,
    m_longitude: null
  },
  //选择性别
  change_sex(event){
    let that=this;
    that.setData({
      sex: event.currentTarget.dataset.id
    })
  },
  //选择地址标签
  change_lable(event){
    let that =this;
    console.log(event)
    that.setData({
      lable: event.currentTarget.dataset.num
    })
  },
  getLocation(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意，后续调用  接口不会弹窗询问
              wx.getLocation({
                type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                success: function (res) {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  wx.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    scale: 28
                  })
                }
              })
            },
            fail(){
              console.log('aaa')
            }
          })
        }
      }
    })
    // wx:wx.navigateTo({
    //   url: '/My/address_map/address_map',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
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
