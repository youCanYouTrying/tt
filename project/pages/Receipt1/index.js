var app = getApp();
var com = require("../../common.js");
var ult = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    is_success: false,
    order_id: 1,
    isUpdata: true, //刷新数据
    mapsta: 1, //1、商家，2、骑手->商家，3、骑手->用户
    _riderMark: {
      id: 1,
      latitude: 29.56556,
      longitude: 106.5656,
      iconPath: '../../image/location.png',
      height: 60,
      width: 50,
      callout: {
        content: '骑手',
        fontSize: 14,
        padding: 6,
        display: 'ALWAYS',
        borderRadius: 20,
      }
    },
    _userMark: {
      id: 1,
      latitude: 29.2828,
      longitude: 106.2828,
      iconPath: '../../image/location.png',
      height: 60,
      width: 50,
      callout: {
        content: '用户',
        fontSize: 14,
        padding: 6,
        display: 'ALWAYS',
        borderRadius: 20,
      }
    },
    _shopMark: {
      id: 1,
      latitude: 29.56444,
      longitude: 106.56222,
      iconPath: '../../image/location.png',
      height: 60,
      width: 50,
      callout: {
        content: '商家',
        fontSize: 14,
        padding: 6,
        display: 'ALWAYS',
        borderRadius: 20,
      }
    },
    markers: [],
    hasMarkers: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const imgUrl = getApp().globalData.imgUrl;
    const isIphoneX = getApp().globalData.isIphoneX;
    this.setData({
      status: this.options.sta,
      order_id: this.options.order_id,
      imgUrl: imgUrl,
      isIphoneX: isIphoneX,
      smName: app.globalData.smName,
      nowTime: com.getCurrentTimeStamp()
    })
    this.mapCtx = wx.createMapContext('myMap');
    //数据加载
    this.Initialization_data()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /*map显示全部经纬度*/
  includePoints: function() {
    let that = this
    let rider = that.data._riderMark
    let user = that.data._userMark
    let shop = that.data._shopMark
    let point = []
    if (that.data.mapsta == 1) {
      point.push({
        'latitude': shop.latitude,
        'longitude': shop.longitude
      })
    }
    if (that.data.mapsta == 2) {
      point.push({
        'latitude': shop.latitude,
        'longitude': shop.longitude
      }, {
        'latitude': rider.latitude,
        'longitude': rider.longitude
      })
    }
    if (that.data.mapsta == 3) {
      point.push({
        'latitude': user.latitude,
        'longitude': user.longitude
      }, {
        'latitude': rider.latitude,
        'longitude': rider.longitude
      })
    }
    console.log('显示前坐标：', that.data.markers)
    that.mapCtx.includePoints({
      padding: [40],
      points: point
    })
    that.setData({
      isUpdata: true
    })
  },
  /*初始化数据*/
  Initialization_data() {
    let that = this
    let status = that.data.status
    com.sentHttpRequestToServer( /*HTTP请求*/
      '/userapi/order/order_info', {
        id: this.data.order_id,
      },
      'GET',
      function(res) {
        console.log('获取到的数据：', res.data.data)
        let items = res.data
        let order_id = res.data.data.order_model.id
        let rider = res.data.data.rider || ''
        let obj = {
          m: res.data.data.distance ? res.data.data.distance : '',
          user: {
            latitude: res.data.data.address.wd * 1,
            longitude: res.data.data.address.jd * 1
          },
          rider: {
            latitude: rider ? res.data.data.rider.wd * 1 : '',
            longitude: rider ? res.data.data.rider.jd * 1 : ''
          },
          shop: {
            latitude: res.data.data.shop.shop_address.dimension * 1,
            longitude: res.data.data.shop.shop_address.longitude * 1
          }
        }
        let status = res.data.data.order_model.status
        //改变mark信息
        that.mapIconChangeData(status, obj)
        // 当前地图进程状态
        let staMap = that.conputedMapSta(status, rider, order_id)
        //显示标题
        let showTitle = that.showTitle(status, rider)
        console.log('当前状态', status)
        //期望送达时间（时间戳）
        let endTime = res.data.data.order_model.pre_delivery_time
        //催单时间（时间戳，未催单默认为0，）
        let reminder_time = res.data.data.order_model.reminder_time
        //当前时间（时间戳）
        let nowTime = that.data.nowTime
        //超时（number分钟，负数未超时，正数超时）
        let overTime = ((nowTime - endTime) / 60).toFixed(2)
        //再次催单时间
        let nextTime = ((nowTime - reminder_time) / 60).toFixed(2)
        //显示时间（字符串）
        let show_time = com.formHour(endTime * 1)
        let canReminder = that.isReminder2(nowTime, reminder_time, overTime, nextTime)
        let timeList = that.timeListFilter(res.data.data.order_logs)
        that.setData({
          latitude1: res.data.data.shop.shop_address.dimension,
          longitude1: res.data.data.shop.shop_address.longitude,
          items: res.data.data,
          rider: rider,
          showTitle: showTitle,
          shop_phone: res.data.data.shop.shop_phone,
          timeList: timeList,
          show_time: show_time,
          canReminder: canReminder,
          status: status,
          staMap: staMap
        })
        //  that.GetCachedData()
        //显示地图
        that.includePoints()
        wx.stopPullDownRefresh()
      }
    );
  },
  //订单进程过滤
  timeListFilter(list) {
    let newList = []
    list.forEach((item, index) => {
      if (item.status == 0 || item.status == 2 || item.status == 4 || item.status == 6 || item.status == 7 || item.status == 8) {
        newList.push(item)
      }
    })
    return newList;
  },
  //判断是否可以催单
  isReminder2(nowTime, reminder_time, overTime, nextTime) {
    let Reminder_again = nowTime - reminder_time
    if (Reminder_again == nowTime) { //第一次催单
      if (overTime > 0) {
        return true;
      }
      console.log('还未超出预计送达时间')
      return false;
    } else { //再次催单
      if (nextTime > 10) {
        return true;
      }
      console.log('距离上次催单未超出10分钟')
      return false;
    }
  },
  //计算mapsta
  conputedMapSta(status, rider, order_id) {
    console.log('55555555', status, rider, order_id)
    let mapsta = 0
    let marks = []
    let _rider = rider
    switch (status) {
      case 0:
      case 2:
      case 3:
      case 10:
      case 11:
      case 15:
        mapsta = 1; //单人地图
        break;
      case 4:
      case 12:
        mapsta = 2; //骑手->商家
        break;
      case 5:
        mapsta = 3; //骑手->用户
        break;
      case 13:
        mapsta = _rider ? 2 : 1
        break;
      default:
        mapsta = 0; //其他    
    }
    if (mapsta == 0) {
      if (status == 6) { //订单完成
        wx.navigateTo({
          url: '/Run_leg/Order_completion/index?order_id=' + order_id + 'fromReceipt=1'
        })
      }
      if (status == 9) { //商家主动退款
        wx.switchTab({
          url: '/pages/Order/index',
        })
      }
      console.log('该状态不应该出现地图')
      //刷新到不属于地图状态，自动调回订单

    } else if (mapsta == 1) {
      marks.push(this.data._shopMark)
    } else if (mapsta == 2) {
      marks.push(this.data._shopMark)
      marks.push(this.data._riderMark)
    } else if (mapsta == 3) {
      marks.push(this.data._userMark)
      marks.push(this.data._riderMark)
    }
    this.setData({
      markers: marks,
      mapsta: mapsta
    })
  },
  //下载地图图标
  GetCachedData(name) {
    let that = this
    let shop_icon = app.globalData.imgUrl + "timg1.png"
    let user_icon = app.globalData.imgUrl + "Buyer.png"
    let rider_icon = app.globalData.imgUrl + "horseman.png"
    let _icon = ''
    let url = ''
    if (name == 'rider') {
      url = rider_icon
    } else if (name == 'shop') {
      url = shop_icon
    } else {
      url = user_icon
    }
    wx.downloadFile({
      url: url,
      success: function(res) {
        _icon = res.tempFilePath.replace(/http:\// || /https:\//, '');
        console.log('下载的商家图片：', _icon)
        //显示地图
        debugger;
      }
    })
    setTimeout(function() {
      return _icon;
    }, 500)
  },

  //进度标题
  showTitle(status, rider) {
    let showTitle = ''
    switch (status) {
      case 0:
        showTitle = '等待支付中...';
        break;
      case 2:
        showTitle = '正在等待商家接单';
        break;
      case 3:
      case 10:
      case 11:
      case 15:
        showTitle = '商家出餐中';
        break;
      case 4:
        showTitle = '骑手正在赶往商家';
        break;
      case 5:
        showTitle = '骑手正在配送中';
        break;
      case 12:
        showTitle = '骑手已到店';
        break;
      case 13:
        showTitle = rider ? '骑手正在赶往商家' : '等待骑手接单'
        break;
      default:
        showTitle = '未知状态，请检查'
    }
    return showTitle;
  },
  //图标信息
  mapIconChangeData(status, obj) {
    let _riderMark = this.data._riderMark
    let _shopMark = this.data._shopMark
    let _userMark = this.data._userMark
    let m = obj.m ? this.filter(obj.m) : ''
    _shopMark.latitude = obj.shop.latitude
    _shopMark.longitude = obj.shop.longitude
    _riderMark.latitude = obj.rider.latitude
    _riderMark.longitude = obj.rider.longitude
    _userMark.latitude = obj.user.latitude
    _userMark.longitude = obj.user.longitude

    _shopMark.iconPath = app.globalData.shop_icon
    _riderMark.iconPath = app.globalData.rider_icon
    _userMark.iconPath = app.globalData.user_icon
    console.log('shop_icon下载app', _shopMark.iconPath)
    switch (status) {
      case 0:
        _shopMark.callout.content = '等待支付';
        break;
      case 2:
        _shopMark.callout.content = '等待接单中';
        break;
      case 13:
      case 3:
      case 10:
      case 11:
      case 15:
        _shopMark.callout.content = '商家出餐中'
        break;
      case 4:
        _riderMark.callout.content = '距离商家' + m
        _shopMark.callout.display = 'BYCLICK'
        break;
      case 12:
        _riderMark.callout.content = '骑手已到店'
        _shopMark.callout.display = 'BYCLICK'
        break;
      case 5:
        _riderMark.callout.content = '距离你' + m
        _userMark.callout.display = 'BYCLICK'
        break;
    }
    console.log('_riderMark:', _riderMark, '\n_userMark:', _userMark)
    this.setData({
      _riderMark,
      _shopMark,
      _userMark
    })
  },
  filter(m) {
    let m1 = m >= 1000 ? (m / 1000) + 'KM' : m + 'M'
    return m1;
  },
  //打电话
  call_order(event) {
    let num = event.currentTarget.dataset.num
    if (num == 1) {
      wx.makePhoneCall({ //骑手
        phoneNumber: '1340000'
      })
    } else if (num == 2) { //商家
      wx.makePhoneCall({
        phoneNumber: this.data.shop_phone
      })
    }
  },
  //取消订单
  cancel_btn() {
    let that = this
    wx.showModal({
      title: '取消订单并退款',
      cancelText: '先等等',
      confirmText: '取消订单',
      content: '取消订单后，款项将原路返回到您的支付账号；详情请查看退款进度',
      confirmColor: '#fe6e78',
      success: function(res) {
        if (res.confirm) { //点击确定取消
          com.sentHttpRequestToServer(
            '/userapi/order/cancel_order', {
              id: that.data.order_id
            },
            'GET',
            function(res) {
              console.log(res)
              if (res.data.status.code == 200) {
                that.showNotice()
              } else {
                wx.showToast({
                  title: '取消失败',
                })
              }

            },
            function(res) {
              console.log(res)
            }
          );
        }
      }
    })

  },
  //确定收货
  takeGoods(e) {
    let that = this
    wx.showModal({
      title: '是否确认收货？',
      content: '请确认是否收到订单商品',
      confirmText: '确认收货',
      confirmColor: '#ff6969',
      success: function(res) {
        if (res.confirm == true) {
          com.sentHttpRequestToServer(
            '/userapi/order/received_order', {
              id: that.data.order_id,
            },
            'GET',
            function(res) {
              console.log(res)
            },
            function(res) {
              console.log(res)
            }
          );
          wx.navigateTo({
            url: '/Run_leg/Order_completion/index?order_id=' + that.data.order_id,
          })
        }
      }
    })
  },
  //显示取消成功
  showNotice() {
    let that = this
    let i = 1;
    let time = setInterval(function() {
      if (i == 1) {
        that.setData({
          is_success: true
        })
      }
      if (i == 3) { //3秒后跳转
        clearInterval(time)
        that.setData({
          is_success: false
        })
        wx.navigateBack({
          delta: 1
        })
      }
      i = i + 1
      console.log(i)
    }, 1000)
    time;
  },
  //发送催单
  remind_order() {
    let that = this
    let canReminder = that.data.canReminder
    console.log('查看是否可以催单,点击', canReminder)
    if (canReminder) {
      com.sentHttpRequestToServer(
        '/userapi/order/reminder_order', {
          id: that.data.order_id,
        },
        'GET',
        function(res) {
          if (res.data.status.code == 200) {
            wx.showToast({
              title: '催单成功!',
              icon: 'none'
            })
            that.setData({
              canReminder: false
            })
          }
        },
        function(res) {
          console.log(res)
        }
      );
    } else {
      wx.showToast({
        title: '请勿重复催单!',
        icon: 'none'
      })
    }
  },
  //退款
  Retreat_money(event) {
    let id = event.currentTarget.id
    console.log(event)
    this.setData({
      fromReceipt1: 0
    })
    wx.navigateTo({
      url: '/pages/Application/index?order_id=' + id,
    })
  },
  //未付款支付
  payAgin(event) {
    var order_mainId = event.currentTarget.dataset.mainid
    console.log('微信支付id', order_mainId)
    this.pay(order_mainId)
  },
  //微信提交支付
  pay: function(mainId) {
    let that = this
    console.log('支付mianId', mainId)
    wx.request({
      url: app.globalData.url + 'api/Payment/wxpay',
      data: {
        openid: app.globalData.openid,
        order_id: mainId,
        type: 'JSAPI', //是 string APP(APP) / JSAPI(小程序) 
      },
      method: "POST",
      success: function(res) {
        that.callWx(res.data.data)
      },
      fail: function(err) {

      }
    })
  },
  /*调用微信支付*/
  callWx: function(obj) {
    console.log('发起支付前', obj)
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,

      'success': function(res) {
        wx.reLaunch({
          url: '\/pages/Order/index',
        })
      },
      'fail': function(res) {
        console.log('失败', res)
      },
      'complete': function(res) {
        console.log('都有', res)
      }
    })
  },
  /**

  * 弹窗

  */

  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})