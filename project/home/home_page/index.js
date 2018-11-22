var app = getApp();
var com = require("../../common.js");
var sTop;
var current_page;
var last_page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    qubie:false,
    class3: 'section-active',
    showModal: false,
    toView: 'eeede',
    nearbyType: 'id',
    nearbyText: '默认排序',
    nearbyRule:'desc',
    nearbyShow: false,
    shopCartShow: false,
    sheng: '',
    shi: '',
    jump:'1',
    qu: '',
    jiedao: '',
    latitude: '',
    longitude: '',
    banners: [],
    cartNum: 0, //购物车
    // id => 默认排序 2 => 距离最短 3 => 销量最高 monthly_sales => 评价最高 num => 配送费最低 6 => 起送价最低    //asc 正   //desc 倒序
    pres: [
      {
        preX: "默认排序",
        id: "id",
        rule:"desc"
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
        id: "site_dis_money ",
        rule: "asc"
        
      },
      {
        preX: "起送价最低",
        id: "site_start_money ",
        rule: "asc"
        
      }
    ],
    curIndex: 0,
    curText: null,
    huodongshow:false,
    icons: [],
    // 优惠专区
    youhuiList:[],
    //为你优选
    optimizationList:[],

  },
  tapBanner(e){
    let url = e.currentTarget.dataset.bannerurl;
    if(url&&url !==false){
      wx.reLaunch({
        // url: '\/home/activity/activity',
        url:url
      })
    }
   
  },

  click: function(e) {
    let that = this;
    var ids = e.currentTarget.dataset.id; //获取自定义的id     
    this.setData({
      id: ids //把获取的自定义id赋给当前组件的id(即获取当前组件)    
    })
  },
  onScroll: function(e) {
    let that = this;
    if (e.detail.scrollTop > 30 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true,
      });
    } else if (e.detail.scrollTop <30 && this.data.scrollDown) {
      this.setData({
        scrollDown: false,
      });
    }
    if (that.data.shopCartShow == false){
      this.setData({
        shopCartShow: true
      })
    }
  },
  indexTouchEnd:function(){
    let that = this;
    var time = setTimeout(function () {
         that.setData({
            shopCartShow: false
          })

      },1500)
  },
  indexMove: function(e) {
    wx.navigateTo({
      url: '\/home/Shopping_Cart/index',
    })
  },
  toNearby: function(e) {
    var self = this;
    self.setData({
      scrollIntoView: 'nearby'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(options) {
    wx.hideTabBar()
    this.getTheme();
    wx.showNavigationBarLoading(); 
  },

  //初始化数据
  initData: function(index) {
    var that = this;
    this.setData({
      curIndex: index,
      curText: that.data.listTab[index].text,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  /*获取banner*/
  getBanner: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/userapi/index/banner',
      method: "POST",
      success: function(res) {
        let _a = [];
        let _n = 0;
        _n = Math.ceil(res.data.data.navMenu.length/10);
        res.data.data.navMenu.forEach(function(item){
          item.icon = item.icon
        })
        for(let i = 0;i<_n;i++){
          _a[i] = res.data.data.navMenu.splice(0, 10);
        }
        that.setData({
          banners: res.data.data.banner,
          icons: _a
        });
      },
      fail: function(err) {

      }
    })
  },
  //获取名称 和地图key 
  getTheme: function() {
    
    var that = this;
    wx.request({
      url: app.globalData.url + '/userapi/index/meta_data',
      method: "GET",
      data:{
        version: app.globalData.version
      },
      success: function(res) {
        if(res.data.status.code == 200){
          app.globalData.mapKey = res.data.data.map_key;
          app.globalData.smName = res.data.data.name;
          if (res.data.data.name != '' && res.data.data.auditing_version * 1 !== app.globalData.version ) {
            that.shopName = res.data.data.name;
            com.pageTitle(res.data.data.name);
          }
          app.globalData.jump_url = res.data.data.auditing_version * 1 == app.globalData.version ? res.data.data.auditing_url :null;
          if (app.globalData.jump_url) {
            wx.hideTabBar()
            that.setData({
              jump: app.globalData.jump_url
            })
          } else {
            wx.showTabBar()
            that.setData({
              jump: null
            })
            that.userDetail();
          }
          that.userDetail();
        }
       
      },
      fail: function(err) {

      },
      complete:res=>{
        that.setData({
          qubie:true
        })
      }
    })
  },
  getAddr: function() {
    let that = this;
    //获取用户地址 逆地址解析
    if (app.globalData.jiedao) {
      that.setData({
        jiedao: app.globalData.jiedao
      })
    } else {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (fRes) {
          var latitude = fRes.latitude
          var longitude = fRes.longitude
          var locationString = fRes.latitude + "," + fRes.longitude;
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
            data: {
              "key": app.globalData.mapKey, //注册腾讯地图开放平台中申请，具体方法见下
              "location": locationString
            },
            method: 'GET',
            success: function(res) {
              if(res.data.status == 0){
                let sheng = res.data.result.address_component.province;
                if (!sheng) {
                  wx.navigateTo({
                    url: '\../addressNoFind/addressNoFind',
                  })
                  return false;
                }

                let shi = res.data.result.address_component.city,
                  qu = res.data.result.address_component.district,
                  adcode = res.data.result.ad_info.adcode,
                  jiedao = res.data.result.pois.length > 0 ? res.data.result.pois[0].title : res.data.result.address;

                app.globalData.latitude = latitude;
                app.globalData.longitude = longitude;
                app.globalData.sheng = com.changeSheng(sheng);
                app.globalData.shi = shi;
                app.globalData.qu = qu;
                app.globalData.adcode = adcode;
                app.globalData.jiedao = jiedao;
                that.getBanner();
                that.queryChoiceness();
                that.query();
                that.setData({
                  jiedao: app.globalData.jiedao
                })
              }
            }
          })
        },fail:function(res){
          wx.navigateTo({
            url: '\../addressNoFind/addressNoFind',
          })
        }
      })
    }
  },
  onReady: function() {},

  /*换取用户id*/
  getUsername: function() {
    let that = this;

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: app.globalData.url + 'userapi/user/get_opendid_form_wexin',
          data: {
            code: res.code
          },
          method: "POST",
          success: function(res) {

            let openid = res.data.data.openid; //返回openid
            app.globalData.session_key = res.data.data.session_key;
            app.globalData.openid = openid;
            that.userChagename();
          }
        })
      }
    })


  },

  userChagename: function() {
    let that = this;
    wx.request({
      url: app.globalData.url + 'userapi/user/userInfoSmall',
      data: {
        wx_oppenid: app.globalData.openid,
        nickname: app.globalData.userInfo.nickName,
        head_img: app.globalData.userInfo.avatarUrl
        // phone:, 暂时没写
      },
      method: "POST",
      success: function(res) {
        app.globalData.userId = res.data.data.id;
        app.globalData.userPhone = res.data.data.phone;
        if (app.globalData.jiedao) {
          that.query();
          that.queryChoiceness();
          that.getBanner();
          that.getCarList();
          that.setData({
            jiedao: app.globalData.jiedao
          })
        } else {
          that.getAddr();
          that.getCarList();
        }
      }
    })
  },
  //获取精选店铺
  queryChoiceness: function() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/userapi/shop/recommend_shop',
      data: {
        lng: app.globalData.longitude,
        lat: app.globalData.latitude,
      },
      method: 'Get',
      success: res => {
        if(res.data.status.code == 200){
          that.setData({
            ChoicenessList: res.data.data
          })
        }
      }
    })
  },

  //获取购物车
  getCarList: function() {
    let that = this;
    wx: wx.request({
      url: app.globalData.url + '/userapi/user_cart/getAll',
      data: {
        user_id: app.globalData.userId
      },
      method: 'GET',
      success: function(res) {
        if (res.data.status.code == 200) {
          let item = res.data.data;
          that.setData({
            cartNum:item.length
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //获取附近商家
  query:function(pa){
    let that = this;
    that.setData({
      isHideLoadMore: true
    })
    let obj = that.data;
    var item = [];
    let arr = [];
    obj.sheng = com.changeSheng(obj.sheng);
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
        if (res.data.status.code == 200){
          let d = res.data.data;
          let item = d.data;

          current_page = d.current_page;
          last_page = d.last_page;

          if (item.length > 0) {
            item.forEach(function (i) { //数据处理
              i.num1 = Math.round(i.num * 1);
              i.num = (i.num*1).toFixed(1);
              if (i.distance < 1) {
                i.m = true;
                i.distance = parseInt(i.distance * 1000) + ' m'
              } else if (i.distance >= 1) {
                i.distance = (i.distance * 1).toFixed(2) + ' km'
              }
              i.second ? i.second = com.conversionTime(i.second) : i.second='0分钟';
              i.shop_activity.length > 0 ? i.shop_activity = com.youhuiType(i.shop_activity) : null;
            })
          }
          current_page == 1 ? list = item  : list.push.apply(list, item);

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
 

  //附近商家选择
  checked: function(e) {
    let that = this.data;
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  nearbyClick: function(e) {
    let that = this.data;
    let ishow = that.showModal;
    this.setData({
      showModal: !that.showModal
    })
  },
  //跳转到顶部
  jumpTo: function(e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
  serchChoice: function(e) {
    let item = this.data.pres,
      index = e.currentTarget.dataset.index,
      rule = e.currentTarget.dataset.rule,
      text = item[index].preX,
      id = item[index].id;
    if (index == 2) {
      this.setData({
        class3: '',
        class2: 'section-active',
        class1: '',
      })
    } else if (index == 1) {
      this.setData({
        class3: '',
        class2: '',
        class1: 'section-active',
      })
    } else{
      this.setData({
        class3: 'section-active',
        class2: '',
        class1: '',
      })
    }
    this.setData({
      nearbyType: id,
      nearbyText: text,
      nearbyRule: rule,
      pres: item,
      loadAll: false,
      showModal: false
    })
    this.query();
  },
  modalClick: function() {
    this.setData({
      showModal: false
    })
  },
  toggleBtn: function(e) {
    let that = this;
    let items = that.data.carInfoData;
    let index = e.currentTarget.id;
    if (items[index].ishow) {
      items[index].ishow = false;
    } else {
      items[index].ishow = true;
    }
    that.setData({
      carInfoData: items
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    if(app.globalData.mapKey){
      this.userDetail();
    }
  },
  naviGoto: function(e) {
    let that = this;
    if (app.globalData.sheng=="") {
      wx.showModal({
        // title: '提示',
        content: '"'+that.shopName+'"要获取你的地理位置，是否允许？',
        confirmText: '去设置',
        success: res => {
          if (res.confirm) {
            wx.openSetting(function () {
            })
          }
        }
      })
    } else if (app.globalData.userInfo) {
      let url = e.currentTarget.dataset.url;
      let id = e.currentTarget.dataset.id;
      if(id == 0){
        wx.navigateTo({
          url: '/home/All_classification/index',
          id: id
        })
        return 
      }
      wx.navigateTo({
        url: url,
        id:id
      })
    } else {
      that.userDetail(1)
    }
  },
  userDetail: function(type) {
    let that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        jiedao: app.globalData.jiedao
      });

      that.getUsername();
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {

        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        that.getUsername();

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({ //赋值
        success: res => {
          app.globalData.userInfo = res.userInfo;
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          that.getUsername();
        },
        fail: res => {
          if (type) { //是否跳验证
            wx.navigateTo({
              url: '\../login/login',
            })
          } else {
            that.getAddr();
          }
        }
      })
    };
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onShow();
    let timer = setTimeout(function(){
      wx.stopPullDownRefresh();
      clearTimeout(timer);
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  readMore: function () {
    let that = this;
    if (current_page < last_page) {
      current_page += 1
      that.query(current_page);
    }
  },
 
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})