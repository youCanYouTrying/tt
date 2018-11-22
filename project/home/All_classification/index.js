var app = getApp();
var com = require("../../common.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    cart: {
      count: 0,
      total: 0,
      list: {}
    },
    showCartDetail: false,
    items:[]
  },
  onLoad: function (options) {
    this.getClass();
  },

//获取分类
  getClass:function(){
    let that = this;
    wx.request({

      url: app.globalData.url +'userapi/shop_type/index',
      data: {
        keywords: "",
      },
      method: "POST",
      success: function (res) {
        let d = res.data.data;
        var top = 0; 
        d.forEach(function(item){
          item.top = top;
          item.scrollId = "c" + item.id;
          let t = 0; //
          item.shop_business_types.forEach(function(list){   //第二层
            let _len = list.sub_types.length; //获取商品最下层的数量
            let rowNum = Math.ceil(_len / 3)|| 0; 
            let _h = (rowNum*135)+70;
            t+=_h;
           });
           top +=t; 
        })
        that.setData({
          items:d,
          classifySeleted: d[0].scrollId
        });
        var str = '全部分类'
        com.pageTitle(str)
      },
      fail: function (err) { 
        
      }
    })
  },
  onShow: function () {
   
  },

  onGoodsScroll: function (e) {
    let that = this;
    let classifySeleted;
    let sTop = e.detail.scrollTop;
    let d = that.data.items;
    d.forEach(function(item){
      if (sTop >= item.top){
        classifySeleted = item.scrollId;
      }
    })
    this.setData({
      classifySeleted: classifySeleted
    });
  },
  tapClassify: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },
});

