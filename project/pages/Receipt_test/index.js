var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    order_id: null,
    status: 4,
    imgurl: '../../image/timg1.png',
    markers: [
      {/*第一个位置商家（用户）*/
        id: 1,
        latitude: null,
        longitude: null,
        iconPath: '',
        height: 100,
        width: 86,
        callout: {
          content: '',
          fontSize: 13,
          padding: 6,
          display: 'BYCLICK',
          borderRadius: 20,
          color: '#ffffff'
        }
      },
      {/*第二个位置*/
        latitude: null,
        longitude: null,
        iconPath: '',
        height: 100,
        width: 86,
        callout: {
          content: '',
          fontSize: 13,
          padding: 6,
          display: 'ALWAYS',
          borderRadius: 20
        }
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('接到的状态值：', options.sta)
    this.setData({
      status: options.sta,
      order_id: options.order_id
    })
    const imgUrl = getApp().globalData.imgUrl;
    this.setData({
      imgUrl: imgUrl
    })
    if (options.sta == 5) {
      that.setData({
        imgurl: '../../image/Buyer.png'
      })
    }
    var a=/aaaa/g
    var b='<div>aaaac'
    console.log('正则测试',a.test(b))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
    //时间计算    
    this.distance_time()
    //数据加载
    this.Initialization_data()
  },



  /*map显示全部*/
  includePoints: function () {
    let latitude1 = this.data.latitude1
    let longitude1 = this.data.longitude1
    let latitude2 = this.data.latitude2
    let longitude2 = this.data.longitude2
    let point = []
    //将坐标以对象赋值给points
    point.push(
      { 'latitude': latitude1, 'longitude': longitude1 },
      { 'latitude': latitude2, 'longitude': longitude2 })
    console.log('地图显示的经纬度：', point)
    this.mapCtx.includePoints({
      padding: [40],
      points: point
    })
  },
  /*初始化数据*/
  Initialization_data() {
    let that = this
    com.sentHttpRequestToServer(/*HTTP请求*/
      '/userapi/order/order_info',
      {
        id: 54,
      },
      'GET',
      function (res) {
        console.log('获取到的数据：', res.data.data)
        let items = res.data
        // console.log(res.data.data.shop.shop_address.dimension,
        //   res.data.data.shop.shop_address.longitude,
        //   res.data.data.rider.p_jd,
        //   res.data.data.rider.p_wd)

        let jd1 = res.data.data.shop.shop_address.dimension * 1
        let wd1 = res.data.data.shop.shop_address.longitude * 1
        if (that.data.status == 5) {
          jd1 = res.data.data.address.wd * 1
          wd1 = res.data.data.address.jd * 1
        }
        that.setData({
          jd1: jd1,
          wd1: wd1,
          jd2: res.data.data.rider.jd * 1,
          wd2: res.data.data.rider.wd * 1,
          rider_phone: res.data.data.rider.phone,
          shop_phone: res.data.data.shop.contacts_phone,
          items: res.data.data,
          qu: res.data.data.shop.shop_address.qu,
          // img:res.data.data.shop.logo,
          shop_phone: res.data.data.shop.shop_phone,
          timeList: res.data.data.order_logs
        })
        //改变地图坐标的值
        // console.log(this.jd1,this.wd1,this.jd2,this.wd2,)
        that.mapChange();
        // console.log(that.data.markers[0])
        //显示地图
        that.includePoints()
      }
    );

  },
  mapChange() {
    //商家
    let content1 = '888888'
    let latitude1 = this.data.jd1
    let longitude1 = this.data.wd1
    let iconPath1 = this.data.imgurl

    let content2 = '距离:5KM'
    let latitude2 = this.data.wd2
    let longitude2 = this.data.jd2
    let iconPath2 = '../../image/horseman.png'

    let mark = this.data.markers;
    for (let i in mark) {//data中的的mark赋值
      if (i == 0) {
        mark[i].callout.content = content1
        mark[i].latitude = latitude1
        mark[i].longitude = longitude1
        mark[i].iconPath = iconPath1
      } else if (i == 1) {
        mark[i].callout.content = content2
        mark[i].latitude = latitude2
        mark[i].longitude = longitude2
        mark[i].iconPath = iconPath2
      }
    }

    this.setData({
      markers: mark,
      content1: content1,
      latitude1: latitude1,
      longitude1: longitude1,
      content2: content2,
      latitude2: latitude2,
      longitude2: longitude2,
    })
  },
  distance_time: function () {
    // console.log('',that.data.)
    let that = this;
    let data = {
      mode: 'walking',
      from: 40.4444 + ',' + 116.1111,
      to: 39.071510 + ',' + 117.190091,
      output: 'json',
      key: 'U2FBZ-E7NKF-3VRJT-NKCRO-FPSSE-BEBWI'
    }
    wx.request({//计算两点距离（米，按步行）
      url: 'https://apis.map.qq.com/ws/distance/v1/?parameters',
      data: {
        mode: 'walking',
        from: 40.4444 + ',' + 116.1111,
        to: '39.071510,117.190091',
        output: 'json',
        key: 'U2FBZ-E7NKF-3VRJT-NKCRO-FPSSE-BEBWI'
      },
      success: function (res) {
        let mi = res.data.result.elements[0].distance;
        that.setData({
          mi: mi
        })
        console.log(res.data.result.elements[0].distance)
      }
    })
  },

  //打电话
  call_order(event) {
    let num = event.currentTarget.dataset.num
    if (num == 1) {
      wx.makePhoneCall({//骑手
        phoneNumber: this.data.rider_phone
      })
    } else if (num == 2) {//商家
      wx.makePhoneCall({
        phoneNumber: this.data.shop_phone
      })
    }
  },
  //退款
  Retreat_money(event) {
    let id = event.currentTarget.id
    console.log(event)
    wx.navigateTo({
      url: '/pages/Application/index?order_id=' + id,
    })
  },
  send() {
    wx.navigateTo({
      url: '/pages/chart/chart',
      data: {

      }
    })
  },

  //发送催单
  remind_order() {
    let that = this
    com.sentHttpRequestToServer(
      '/userapi/order/reminder_order',
      {
        id: that.data.order_id,
      },
      'GET',
      function (res) {
        if (res.data.status.code == 200) {
          let remind_time = res.data.data.order_model.reminder_time
          if (remind_time !== null || remind_time !== '') {
            wx.showToast({
              title: '已发送催单了哦！',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '催单成功',
            })
          }

        }
        console.log('催单', res)
      },
      function (res) {
        console.log(res)
      }
    );
  },

  /**
  
     * 弹窗
  
     */

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  showmodal(e) {

    wx.showModal({
      title: '是否确认收货？',
      content: '请确认是否收到订单商品',
      confirmText: '确认收货',
      confirmColor: '#ff6969',
      success: function (res) {
        if (res.confirm == true) {
          com.sentHttpRequestToServer(
            '/userapi/order/received_order',
            {
              id: this.data.order_id,
            },
            'GET',
            function (res) {
              console.log(res)
            },
            function (res) {
              console.log(res)
            }
          );
          wx.navigateTo({
            url: '/Run_leg/Order_completion/index?order_id=' + this.data.order_id,
          })
        }
      }
    })
  },
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
    debugger
  },

})