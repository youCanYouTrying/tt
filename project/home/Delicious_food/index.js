var app = getApp();
var com = require("../../common.js");
var typeNum;
var current_page;
var last_page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, //进入页面时，默认选择第3个，如果不需要默认选中，去掉此语句即可；id从0开始  
    showModal:false,  
    imgUrl: app.globalData.imgUrl,  
    carInfoData:[],
    nearbyType: 'id',
    nearbyText: '默认排序',
    nearbyRule: 'desc',
    pres: [
      {
        preX: "附近",
        id: "distance",
        rule: "asc"
      },
      {
        preX: "销量榜",
        id: "monthly_sales",
        rule: "desc"
      },
      {
        preX: "评价",
        id: "num",
        rule: "desc"
      }
    ],
    pres1: [
      {
        preX: "默认排序",
        id: "id",
        rule: "desc"
      },
      {
        preX: "距离最短",
        id: "distance",
        rule: "asc"

      },
      {
        preX: "销量最高",
        id: "monthly_sales",
        rule: "desc"

      },
      {
        preX: "评价最高",
        id: "num",
        rule: "desc"

      },
      {
        preX: "配送费最低",
        id: "dis_money",
        rule: "asc"
      },
      {
        preX: "起送价最低",
        id: "start_price",
        rule: "asc"

      }
    ],
    listTab: [
      { "code": "01", "img": app.globalData.imgUrl+"VCG21gic19571800.jpg" },
      { "code": "02", "img": app.globalData.imgUrl+"VCG21gic19571800.jpg" },
      { "code": "03", "img": app.globalData.imgUrl+"VCG41151586171.jpg" },
      { "code": "04", "img": app.globalData.imgUrl+"VCG21gic19571800.jpg" },
    ],
    winHeight: 0,
    pa: 1,//初始页面
    uhide: 0
  },
  click: function (e) {
    let that = this;
    if (e.currentTarget.dataset.rule) {
      let item = this.data.pres,
        index = e.currentTarget.dataset.index,
        rule = e.currentTarget.dataset.rule,
        text = item[index].preX,
        id = item[index].id;

      this.setData({
        nearbyType: id,
        nearbyText: text,
        nearbyRule: rule,
        pres: item,
        loadAll: false,
        showModal: false
      })
      this.query()

    }else{
      this.setData({
        showModal: !that.data.showModal
      })
    }
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.initData(0),
      wx.getSystemInfo({
        success: function (res) {
          that.setData({ winHeight: res.windowHeight })
        }
      });
    that.query();
  },

  //销量第一的查询
  getNo:function(){
    let that = this;
    wx.request({
      url: app.globalData.url + '/userapi/shop/nearby_shop',
      data: {
        user_id: app.globalData.userId,
        sheng: app.globalData.sheng,
        shi: app.globalData.shi,
        qu: app.globalData.qu,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
        with_goods:1,
        by: "monthly_sales",
        rule: "desc",
        page: 1
      },success:res =>{
        if(res.data.status.code == 200){
           let obj = res.data.data.data[0];
          obj.second ? obj.second = com.conversionTime(obj.second):'0分钟'
          that.setData({
              nearObj:obj
            }); 
        }
      }
    })
  },
  // 分类筛选
  serchChoice:function(e){
    let item = this.data.pres1,
      index = e.currentTarget.dataset.index,
      rule = e.currentTarget.dataset.rule,
      text = item[index].preX,
      id = item[index].id;
      
    this.setData({
      nearbyType: id,
      nearbyText: text,
      nearbyText1:text,
      nearbyRule: rule,
      loadAll: false,
      showModal: false
    })
    console.log(this.data.nearbyText1)
    this.query()
  },
  //获取附近商家
  query: function (pa) {
    let that = this;
    that.setData({
      isHideLoadMore: true
    })
    let obj = that.data;
    var item = [];
    let arr = [];
    wx.request({
      url: app.globalData.url + '/userapi/shop/nearby_shop',
      data: {
        user_id: app.globalData.userId,
        sheng: app.globalData.sheng,
        shi: app.globalData.shi,
        qu: app.globalData.qu,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
        by: obj.nearbyType,
        rule: obj.nearbyRule,
        page: pa || 1
      },
      method: 'Get',
      success: function (res) {
        let list = that.data.carInfoData || [];
        if (res.data.status.code == 200) {
          let d = res.data.data;
          let item = d.data;

          current_page = d.current_page;
          last_page = d.last_page;

          if (item.length > 0) {
            item.forEach(function (i) { //数据处理
              i.num1 = Math.round(i.num * 1);
              i.num = i.num1.toFixed(1);
              if (i.distance < 1) {
                i.m = true;
                i.distance = parseInt(i.distance * 1000) + ' m'
              } else if (i.distance >= 1) {
                i.distance = (i.distance * 1).toFixed(2) + ' km'
              }
              i.second ? i.second = com.conversionTime(i.second) : i.second = '0分钟';
              i.shop_activity.length > 0 ? i.shop_activity = com.youhuiType(i.shop_activity) : null
            })
          }
          current_page == 1 ? list = item : list.push.apply(list, item);

          that.setData({
            carInfoData: list,
            isHideLoadMore: false
          })
          if (last_page == current_page) {
            that.setData({
              loadAll: true
            })
          }
        }
      },
      fail: function () {

      },
      complete: res => {
        wx.hideNavigationBarLoading();
      }
    })
  },
  //初始化数据
  initData: function (index) {

  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  youhuiShow:function(e){
    let that = this;
    let items = that.data.carInfoData;
    let findex = e.currentTarget.dataset.findex;
    items[findex].ishow = !items[findex].ishow;
    that.setData({
      carInfoData:items
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
    if (current_page < last_page) {
      current_page += 1
      that.query(current_page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  modalClick:function(){
    this.setData({
      showModal:false
    })
  },
  //点击切换隐藏和显示
  toggleBtn: function (event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      this.setData({
        uhide: 0
      })
    } else {
      this.setData({
        uhide: itemId
      })
    }
  },
  naviGoto: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },

})