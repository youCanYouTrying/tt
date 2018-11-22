var app = getApp()
var com = require("../../common.js");
var that = null;
var current_page;
var last_page;
Page({
  data: {
    isHideLoadMore:false,
    imgUrl: app.globalData.imgUrl,
    mark: 0,
    delShow:false,
    pa: 1,//初始页面
    inputName:"",
    youLike:false, // 猜你喜欢
    carInfoData1:[],
    pres: [
      {
        preX: "综合排序",
        img: "../../image/jian_all.png"
      },
      {
        preX: "销量"
      },
      {
        preX: "距离"
      }
    ],
    allspanid: "0",
    pinlun: [ ],
    cart: {
      count: 0,
      total: 0,
      list: {
      }
    },
    showCartDetail: false
  },
  //获取历史搜索和热门搜索

  gethistory:function(){   
    let that =this;
    wx.request({
      url: app.globalData.url + 'userapi/search/user_search_history',
      data: {
        user_id: app.globalData.userId ,
      },
      method: "GET",
      success: function (res) {
        that.setData({
          hot: res.data.data.hot_keywords,
          his: res.data.data.user.keywords
        })
      },
      fail: function (err) {

      }
    })
  },
  delHistory: function () {
    let that = this;
    wx.request({
      url: app.globalData.url + 'userapi/search/empty_user_search_history',
      data: {
        user_id: app.globalData.userId ,
      },
      method: "GET",
      success: function (res) {
        that.setData({
          delShow: false
        })
        that.gethistory();
      },
      fail: function (err) {
        
      }
    })
  }, 
  onLoad: function (options) {
    com.pageTitle('搜索');
    let that = this;
    if(options.key){
      that.setData({
        inputName:options.key
      })
      this.query();
    }else{
      this.gethistory();
    }
  },
  clickSearch:function(e){
    let that = this;
    let key = e.currentTarget.dataset.key;
    that.setData({
      inputName: key
    })
    this.query();
  },
  //输入监听
  bindKeyInput:function(e){
    this.setData({
      inputName:e.detail.value,
    });
    if(e.detail.value.length>0){
      this.setData({
        showLoading: true
      })
      this.query();
    }
  },
  //点击搜索
  searchClick:function(e){
    that.query();
  },
  // 获取搜索结果的请求
  query:function(pa){
    let that = this;
    that.setData({
      isHideLoadMore : true,
      youLike:false,
      carInfoData:[]
    })
    if (that.data.inputName){
      wx.request({
        url: app.globalData.url + 'userapi/shop/nearby_shop',
        data: {
          keywords: this.data.inputName,
          longitude: app.globalData.longitude ,
          latitude: app.globalData.latitude ,
          user_id: app.globalData.userId ,
          with_goods:1,
          page: pa,
        },
        method: 'POST',
        success: function (res) {   //youLike  显示没有搜到结果    // isHideLoadMore 加载 
          if (res.data.status.code == 200) {
            let item = [];
            let _d = res.data.data;
            let list = that.data.carInfoData1;
            
            last_page = _d.last_page;
            current_page = _d.current_page;
            item = _d.data;
            console.log('ddddddddddd', _d.data)
           
            item.forEach(function(i){ //数据处理
              i.num1 = Math.round(i.num * 1);
              i.num = i.num1.toFixed(1);
              if (i.distance <1){
                i.m = true;
                i.distance = parseInt(i.distance * 1000)
              } else if (i.distance>=1){
                i.distance = i.distance.toFixed(2)
              }
              i.second ? i.second = com.conversionTime(i.second) : i.second = '0分钟';
            }) 
      
            current_page == 1 ? list = item : list.push.apply(list, item);
            
            that.setData({
              isHideLoadMore: false,
              carInfoData1: list
            })
            if (last_page == _d.current_page){
              that.setData({
                loadAll : true
              })
            }
            if (list.length>0){
              that.setData({
                youLike: false
              })
            }else{
              that.setData({
                youLike: true,
                carInfoData1: []
              })
              that.getYouLike();
            }
          } else {
            that.setData({
              youLike: true,
              carInfoData1:[]
            })
            
            return false;
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '请求出错',
          })
        },
        complete: function (res) { 
          that.setData({
            showLoading: false,
          })
        },
      })
    }else{
      that.setData({
        carInfoData1 : []
      })
    }
  },
  getYouLike: function () {
    let that = this;
    that.setData({
      carInfoData1: []
    })
    wx.request({
      url: app.globalData.url + 'userapi/shop/guess_you_like',
      data: {
        user_id: app.globalData.userId,
        page: 1,
        longitude:app.globalData.longitude,
        dimension: app.globalData.latitude
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.status.code == 200) {

          let _d = res.data.data;
          let list = that.data.carInfoData1;
          let item = _d.data;
          item.forEach(function (i) { //数据处理
            i.num1 = Math.round(i.num * 1);
            if (i.distance < 1) {
              i.m = true;
              i.distance = parseInt(i.distance * 1000)
            } else if (i.distance >= 1) {
              i.distance = i.distance.toFixed(2)
            }
          }) 
          that.setData({
            carInfoData: res.data.data.data
          })
        }
      },
      fail: function (err) {

      }
    })
  },
  
  showGoods:function(e){
    let that = this;;
    let index = e.currentTarget.dataset.index;
    let item = that.data.carInfoData1;
    item[index].showGoods ? item[index].showGoods = false : item[index].showGoods=true;
    that.setData({
      carInfoData1: item
    })
  },
  youhuiShow:function(e){
    let that = this;
    let items = that.data.carInfoData1;
    let findex = e.currentTarget.dataset.findex;
    items[findex].ishow = !items[findex].ishow;
    that.setData({
      carInfoData1:items
    })
  },
  toggleBtn:function(e){
    let that = this;
    let items = that.data.carInfoData;
    let index = e.currentTarget.dataset.index;
    if (items[index].ishow){
      items[index].ishow = false;
    }else{
      items[index].ishow = true;
    }
    that.setData({
      carInfoData:items
    })
  },
  //删除
  del:function(){
    this.setData({
      delShow:true
    })
  },
  //取消
  cancel:function(){
    this.setData({
      delShow:false
    })
  },

  submit: function (e) {
    wx.navigateTo({
      url: '\/home/Confirmation_order/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onReachBottom:function(){
    let that = this;
    if (that.data.pa < last_page) {
      let pa = that.data.pa + 1;
      that.setData({
        pa: pa
      })
      that.query(pa)
    }
  }
})  