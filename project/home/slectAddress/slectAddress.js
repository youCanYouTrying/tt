var app = getApp();
const city = require('../../utils/city.js');
const cityObjs = require('../../utils/city.js');
var QQMapWX = require('../../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var com = require("../../common.js");
// 实例化API核心类
var demo = new QQMapWX({
  key: 'U2FBZ-E7NKF-3VRJT-NKCRO-FPSSE-BEBWI' // 必填
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    historyShow: true,
    shi: '',
    adcode: '',
    street: '',
    historyItem:[],
    detailAddList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    const sysInfo = wx.getSystemInfoSync();
    that.setData({
      winHeight: sysInfo.windowHeight,
      shi:app.globalData.shi,
      street:app.globalData.jiedao,
      adcode: app.globalData.adcode
    })
    that.getAdd();
    that.chooierCity();
    that.getHistoryAdd();
  },
  /*详细地址模糊搜索*/
  detailAddrSearch: function () {
    let that = this;
    // 调用接口
    demo.getSuggestion({
      keyword: this.data.detilAdr,
      region: this.data.shi,
      region_fix: 1,
      policy: 1,
      count:20,
      success: function (res) {
        let list = res.data;
        that.setData({
          detailAddList:list,
        })
      },
      fail: function (res) {
      },
    });
  },
  /*清空收货的详细地址 */
  removehisAdd:function(){
    let that = this;
    that.setData({
      detilAdr:'',
      historyShow:true
    })
  },
  //详细的收货地址选择
  detailAddSelect:function(e){
    let that = this;
    let list = e.currentTarget.dataset.item;
  
    app.globalData.sheng = list.province;
    app.globalData.shi = list.city;
    app.globalData.qu = list.district;
    app.globalData.jiedao = list.title;
    app.globalData.latitude = list.location.lat;
    app.globalData.longitude = list.location.lng;

    wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
      url: '/home/home_page/index'
    })
  },
  /*点击选择城市 */
  chooierCity: function () {
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })
  },
  /* 城市选择和历史地址切换按钮*/
  shiClick: function () {
    let that = this;
    let historyShow = !that.data.historyShow;
    that.setData({
      historyShow: historyShow,
      inputName: "",
      detilAdr:""
    })
  },
  /*选择城市 */
  bindCity: function (e) {
    this.setData({
      shi: e.currentTarget.dataset.city,
      adcode: e.currentTarget.dataset.code,
      historyShow: true
    })
  },
  /*右边首拼点击*/
  clickLetter: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  /*点击热门 回到顶部*/
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  /*选择历史收货地址*/
  historyClick:function(e){
    let index = e.currentTarget.dataset.index;
    let cl = e.currentTarget.dataset.cl;
    let item , wd, jd, sheng, shi, qu, adcode,jiedao;
    if(cl){
      item = this.data.nearAddList[index];
      wd = item.location.lat;
      jd = item.location.lng;
      sheng = item.ad_info.province;
      shi = item.ad_info.city;
      qu = item.ad_info.district;
      adcode = item.ad_info.adcode;
      jiedao = item.title;
    }else{
      item = this.data.historyItem[index];
      wd = item.wd;
      jd = item.jd;
      sheng = item.sheng;
      shi = item.shi;
      qu = item.qu;
      adcode = item.building_card;
      jiedao = item.address;
    }
    app.globalData.latitude = wd;
    app.globalData.longitude = jd;
    app.globalData.sheng = com.changeSheng(sheng);
    app.globalData.shi = shi;
    app.globalData.qu = qu;
    app.globalData.adcode = adcode;
    app.globalData.jiedao = jiedao;

    wx.reLaunch({     
      url: '/home/home_page/index'
    })
  },
  // 重新定位
  againGetAddre: function () {
    this.getAdd(1);
    // wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
    //   url: '/home/home_page/index'
    // })
  },
  //*获取经纬度和详细地址 */
  getAdd: function (type) {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let locationString = res.latitude + "," + res.longitude;
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',
          data: {
            "key": "U2FBZ-E7NKF-3VRJT-NKCRO-FPSSE-BEBWI",//注册腾讯地图开放平台中申请，具体方法见下
            "location": locationString
          },
          method: 'Get',
          success: function (res) {
            let sheng = res.data.result.address_component.province,
              shi = res.data.result.address_component.city,
              qu = res.data.result.address_component.district,
              adcode = res.data.result.ad_info.adcode,
              jiedao = res.data.result.pois.length > 0 ? res.data.result.pois[0].title : res.data.result.address;
            if (sheng == "重庆市") {
              sheng = sheng.substring(0, 2)
            }
            app.globalData.latitude = latitude;
            app.globalData.longitude = longitude;
            app.globalData.sheng = sheng;
            app.globalData.shi = shi;
            app.globalData.qu = qu;
            app.globalData.adcode = adcode;
            app.globalData.jiedao = jiedao;
            if (type == 1) {
              wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                url: '/home/home_page/index'
              })
            }else{
              that.setData({
                nearAddList: res.data.result.pois
              })
            }
          }
        })
      }
    })
  },
  /**/
  lookMoreClick:function(){
    let that =this;
    that.setData({
      lookMore: !that.data.lookMore
    })
  },
  /*详细地址搜索*/
  bindDetailBlur: function (e) {
    this.setData({
      // detilAdr:''
    })
  },
  historyKeyInput: function (e) {
    this.setData({
      detilAdr: e.detail.value
    });
    this.detailAddrSearch();
  },
  /*城市搜索*/
  bindBlur: function (e) {
    // this.setData({
    //   inputName: ''
    // })
  },
  bindKeyInput: function (e) {
    if (e.detail.value == ""){
      this.setData({
        completeList:[]
      })
    }
    this.setData({
      inputName: e.detail.value
    });
    this.auto()
  },
  // 获取历史地址
  getHistoryAdd:function(){
    let that = this;
    wx.request({
      url: app.globalData.url + 'userapi/address/indexList.html',
      data: {
        id: app.globalData.userId,
      },
      method: "GET",
      success: function (res) {
        that.setData({
          historyItem:res.data.data
        })
      },
      fail: function (err) {

      }
    })
  },
  // 城市搜索
  auto: function () {
    let inputSd = this.data.inputName.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = cityObjs.cityObjs
    let finalCityList = []

    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase();
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
          return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      return
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