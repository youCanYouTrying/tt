var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromReceipt1:true,
    showModal: false,
    order_id: null,
    isUpdata: true,
    runUp: true,
    markers: [
      {/*第一个位置商家（用户）*/
        id: 1,
        latitude: null,
        longitude: null,
        iconPath: '',
        height: 60,
        width: 50,
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
        height: 60,
        width: 50,
        callout: {
          content: '',
          fontSize: 13,
          padding: 6,
          display: 'ALWAYS',
          borderRadius: 20
        }
      }
    ],
    smName: app.globalData.smName
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // console.log('接到的状态值：',options.sta)
    this.setData({
      status: this.options.sta,
      order_id: this.options.order_id,
      nowTime:com.getCurrentTimeStamp(),
      fromReceipt1:this.options.fromReceipt1
    })
    const imgUrl = getApp().globalData.imgUrl;
    const isIphoneX = getApp().globalData.isIphoneX;
    this.setData({
      imgUrl: imgUrl,
      isIphoneX: isIphoneX
    })
    this.mapCtx = wx.createMapContext('myMap');
    //数据加载
    this.Initialization_data()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
      padding: [60],
      points: point
    })
    this.setData({
      isUpdata:true,
      runUp:true
    })
  },
  /*初始化数据*/
  Initialization_data() {
    let that = this
    com.sentHttpRequestToServer(/*HTTP请求*/
      '/userapi/order/order_info',
      {
        id: that.data.order_id
      },
      'GET',
      function (res) {
        console.log('获取到的数据：', res.data.data)
        let items = res.data
        let status=res.data.data.order_model.status
        let order_id=res.data.data.order_model.id
        console.log('当前状态',status)
        if(status==6){//订单完成
          that.setData({
            fromReceipt1:false
          })
          wx.navigateTo({
            url: '/Run_leg/Order_completion/index?order_id='+order_id+'fromReceipt=1'
          })
        }
        let jd1 = res.data.data.shop.shop_address.dimension * 1
        let wd1 = res.data.data.shop.shop_address.longitude * 1
        let shop_icon = app.globalData.imgUrl+"timg1.png"
        let user_icon = app.globalData.imgUrl+"Buyer.png"
        //期望送达时间（时间戳）
        let endTime=res.data.data.order_model.pre_delivery_time
        //催单时间（时间戳，未催单默认为0，）
        let reminder_time=res.data.data.order_model.reminder_time
        //当前时间（时间戳）
        let nowTime=that.data.nowTime
        //超时（number分钟，负数未超时，正数超时）
        let overTime = ((nowTime-endTime)/60).toFixed(2)
        //再次催单时间
        let nextTime=((nowTime-reminder_time)/60).toFixed(2)
       
        //显示时间（字符串）
        let show_time=com.formHour(endTime*1)
        let canReminder=that.isReminder2(nowTime,reminder_time,overTime,nextTime)
        console.log(`当前时间：${nowTime},预计送达时间：${endTime},reminder_time催单时间：${reminder_time},overTime超出时间：${overTime}`)
        console.log('是否可以催单？？？？',canReminder)
        if (status==5) {
          jd1 = res.data.data.address.wd * 1
          wd1 = res.data.data.address.jd * 1
          that.GetCachedData(user_icon)
        } else {
          that.GetCachedData(shop_icon)
        }
        that.setData({
          jd1: jd1,
          wd1: wd1,
          jd2: res.data.data.rider.jd * 1,
          wd2: res.data.data.rider.wd * 1,
          rider_phone: res.data.data.rider.phone,
          shop_phone: res.data.data.shop.contacts_phone,
          items: res.data.data,
          shop_phone: res.data.data.shop.shop_phone,
          timeList: res.data.data.order_logs,
          distance: res.data.data.distance?res.data.data.distance:1,
          show_time:show_time,
          canReminder:canReminder,
          status:status
        })
      }
    );

  },
  //判断是否可以催单
  isReminder2(nowTime,reminder_time,overTime,nextTime){
   let Reminder_again=nowTime-reminder_time
   if(Reminder_again==nowTime){//第一次催单
     if(overTime>0){
       return true;
     }
     console.log('还未超出预计送达时间')
     return false;
   }else{//再次催单
     if(nextTime>10){
       return true;
     }
     console.log('距离上次催单未超出10分钟')
     return false;
   }
  },
  GetCachedData(url1) {
    let that = this
    console.log('shop', url1)
    wx.downloadFile({
      url: url1,
      success: function (res) {
        let a = res.tempFilePath
        let ben2 = a.replace(/http:\// || /https:\//, '');
        wx.downloadFile({
          url: app.globalData.imgUrl+"horseman.png",
          success: function (ddd) {
            let rider_icon = ddd.tempFilePath.replace(/http:\// || /https:\//, '');
            //改变数据
            that.mapChange(ben2, rider_icon);
            //显示地图
            that.includePoints()
          }
        })

      }
    })
  },
  mapChange(ben2, rider_icon) {
    //商家(用户)
    let content1 = '888888'
    let latitude1 = this.data.jd1
    let longitude1 = this.data.wd1
    let iconPath1 = ben2
    //骑手
    let content2 = this.fliter(this.data.distance)
    let latitude2 = this.data.wd2
    let longitude2 = this.data.jd2
    let iconPath2 = rider_icon
    let mark = this.data.markers;
    for (let i in mark) {//data中的的mark赋值
      if (i == 0) {//商家（用户）
        mark[i].callout.content = content1
        mark[i].latitude = latitude1
        mark[i].longitude = longitude1
        mark[i].iconPath = iconPath1
      } else if (i == 1) {//骑手
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
  fliter(m) {
    if(m==1){
      return "骑手已到店"
    }
    let m1 = m >= 1000 ? (m / 1000) + 'KM' : m + 'M'
    return `距离:${m1}`;
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
    this.setData({
      fromReceipt1:false
    })
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
    let canReminder=that.data.canReminder
    if(canReminder){
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
              canReminder:false
            })
        }
      },
      function(res) {
        console.log(res)
      }
    );
    }else{
      wx.showToast({
        title: '请勿重复催单!',
        icon: 'none'
      })
    }
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
    let that=this
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
              id: that.data.order_id,
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
            url: '/Run_leg/Order_completion/index?order_id=' + that.data.order_id,
          })
        }
      }
    })
  },
  touchUpdate() {
    console.log('ssss')
  },
  preventTouchMove: function (e) {//阻止模态滚动穿透

  },

  //滑动刷新
  touchStart(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
    })
  },
  touchMover(e) {
    let that = this
    let startX = that.data.startX, //开始X坐标
      startY = that.data.startY; //开始Y坐标
    let touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY //滑动变化坐标
    let angle = that.angle({
      X: startX,
      Y: startY
    }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    let moveY = touchMoveY - startY
    if (Math.abs(angle) > 30 && moveY > 80 && that.data.runUp) {
      that.setData({
        runUp: false,
        isUpdata: false
      })
      setTimeout(function () {
        that.setData({
          isUpdata: false
        })
        that.onLoad();
        console.log('sss')
      }, 1000)
    }
  },
  angle(start, end) {

    var _X = end.X - start.X,

      _Y = end.Y - start.Y

    //返回角度 /Math.atan()返回数字的反正切值

    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

  },
  onShow: function () {
    this.setData({
      fromReceipt1:true
    })
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
    /**如果页面来自单图标地图*/
    if(this.data.fromReceipt1){
      wx.switchTab({
        url: '/pages/Order/index',
      })
    }
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

  },

})