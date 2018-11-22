// My/Bring_out/index.js
var app = getApp();
var com = require("../../common.js");
var typeNum;
var current_page = 1;
var last_page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, //进入页面时，默认选择第3个，如果不需要默认选中，去掉此语句即可；id从0开始  
    showModal: false,
    imgUrl: app.globalData.imgUrl,
    carInfoData: [],
    pa: 1,//初始页面
    loadAll:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    com.pageTitle(options.text);
    that.query();
  },
  
  //获取附近商家
  query: function (type) {
    typeNum = type;
    let that = this;
    that.setData({
      loadAll:false
    })
    let obj = that.data;
    var item = [];
    let arr = [];
    wx.request({
      url: app.globalData.url + '/userapi/shop/nearby_shop',
      data: {
        type_id:that.options.id,
        user_id: app.globalData.userId,
        sheng: app.globalData.sheng,
        shi: app.globalData.shi,
        qu: app.globalData.qu,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
        by: 'id',
        rule: 'asc',
        page: current_page
      },
      method: 'Get',
      success: function (res) {
        if (res.data.status.code == 200) {
          current_page = res.data.data.current_page;
          last_page = res.data.data.last_page;
          item = res.data.data.data;
          if (item.length > 0) {

            item.forEach(i =>{
              i.second ? i.second = com.conversionTime(i.second) : i.second = '0分钟';

            })
            let list = that.data.carInfoData;
            list.push.apply(list, item)

            that.setData({
              carInfoData: list
            })

          } else {
            that.setData({
              loadAll: true,
              carInfoData: item
            })
          }
          if (last_page == current_page) {
            that.setData({
              loadAll: true
            })
          }else{

            that.setData({
              loadAll: false
            })
            let t = setTimeout(function () {
              that.setData({
                loadAll: true
              })
              clearTimeout(t)
            }, 3000)
          }
        }
      },
      fail: function () {
      }
    })
  },
  //初始化数据
  initData: function (index) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  youhuiShow: function (e) {
    let that = this;
    let items = that.data.carInfoData;
    let findex = e.currentTarget.dataset.findex;
    items[findex].ishow = !items[findex].ishow;
    that.setData({
      carInfoData: items
    })
  },
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
    
    let that = this;
    if (last_page > current_page){
      current_page +=1;
      that.query(pa);
    }else{
      let t = setTimeout(function () {
        that.setData({
          loadAll: true
        })
        clearTimeout(t)
      }, 10000)
    }
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 
})