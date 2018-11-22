// Run_leg/New_address/index.js
const Amap = require('../../map/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: "请选择地址"
  },
  chooseLocation: function (e) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        //console.log(res);
        console.log(res.address)
        that.setData({
          map: res.address
        })
      },

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color1: "#f6ebeb",
      border1: "1px solid #fad2d2",
      color2: "#f5f5f5",
      border2: "1px solid #e6e6e6",
      la_color1: "#f6ebeb",
      la_border1: "1px solid #fad2d2",
      la_color2: "#f5f5f5",
      la_border2: "1px solid #e6e6e6",
      la_color3: "#f5f5f5",
      la_border3: "1px solid #e6e6e6"
    })
  },
  sex1: function (e) {
    this.setData({
      color1: "#f6ebeb",
      border1: "1px solid #fad2d2",
      color2: "#f5f5f5",
      border2: "1px solid #e6e6e6"
    })
  },
  sex2: function (e) {
    this.setData({
      color2: "#f6ebeb",
      border2: "1px solid #fad2d2",
      color1: "#f5f5f5",
      border1: "1px solid #e6e6e6"
    })
  },
  Label1: function (e) {
    this.setData({
      la_color1: "#f6ebeb",
      la_border1: "1px solid #fad2d2",
      la_color2: "#f5f5f5",
      la_border2: "1px solid #e6e6e6",
      la_color3: "#f5f5f5",
      la_border3: "1px solid #e6e6e6"
    })
  },
  Label2: function (e) {
    this.setData({
      la_color2: "#f6ebeb",
      la_border2: "1px solid #fad2d2",
      la_color1: "#f5f5f5",
      la_border1: "1px solid #e6e6e6",
      la_color3: "#f5f5f5",
      la_border3: "1px solid #e6e6e6"
    })
  },
  Label3: function (e) {
    this.setData({
      la_color3: "#f6ebeb",
      la_border3: "1px solid #fad2d2",
      la_color1: "#f5f5f5",
      la_border1: "1px solid #e6e6e6",
      la_color2: "#f5f5f5",
      la_border2: "1px solid #e6e6e6"
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