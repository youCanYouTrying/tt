var app = getApp();
var com = require("../../common.js");
var ult = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:false,
    goLogin:false,
    isLogin:false,
    filterId: 1,
    inquire_code: 0
  },
  //排序
  tapFilter: function(e) {
    this.setData({
      filterId: e.target.dataset.id
    });
    if (e.target.dataset.id == 1) {
      this.setData({
        inquire_code: 0,
        isLoading:false
      })
      this.Initializehttp()
    }
    if (e.target.dataset.id == 2) {
      this.setData({
        inquire_code: 1,
        isLoading:false
      })
      this.Initializehttp()
    }
    if (e.target.dataset.id == 3) {
      this.setData({
        inquire_code: 2,
        isLoading:false
      })
      this.Initializehttp()
    }
  },
  //状态分析跳转
  detailed(event) {
    let that=this
    let sta = event.currentTarget.dataset.sta
    var order_mainId =event.currentTarget.dataset.mainid
    let order_id = event.currentTarget.dataset.id //订单id
    if (sta == 0||sta == 2 || sta == 3 || sta == 10|| sta == 11||  sta == 13) {//2等待商家接单，3，10，11s，12，13等待骑手接单
      wx.navigateTo({ //到单人地图
        url: '/pages/Receipt1/index?sta=' + sta + '&order_id=' + order_id,
      })
    } else if (sta == 4 || sta == 5 || sta == 15||sta == 12) {//4,14,15骑手正在赶往商家；5骑手配送中,12骑手已到店
      wx.navigateTo({ //到双人地图
        url: '/pages/Receipt1/index?sta=' + sta + '&order_id=' + order_id,
      })
    } else if (sta == 6) {
      wx.navigateTo({ //到订单已完成
        url: '/Run_leg/Order_completion/index?sta=' + sta + '&order_id=' + order_id,
      })
    } else if (sta == 8 || sta == 9 || sta==14 ||sta==16) {
      wx.navigateTo({ //到退款
        url: '/pages/speed/index?sta=' + sta + '&order_id=' + order_id,
      })
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if(app.globalData.userId){
      this.setData({
        isLogin:true,
        userID:app.globalData.userId
      })
    }else{
    wx.redirectTo({
      url: '/home/login/login',
      })
    }
    var a={name:"dss",age:"555"}
    
    //获取时间
    let time = ult.formatTime(new Date());
    that.setData({
      nowtime: time,
      imgUrl:app.globalData.imgUrl
    })
    //初始化数据
    that.Initializehttp()
    //下载地图图片
    that.GetCachedData()
  },
  /**HTTP请求
   * 
   */
  Initializehttp() {
    let that = this
    com.sentHttpRequestToServer(
      '/userapi/Order/orderListAll.html', {
        id: app.globalData.userId,
        // id:391,
        // id:372,
        tp: that.data.inquire_code
      },
      'GET',
      function(res) {
        that.setData({
          isLoading:true
        })
        wx.stopPullDownRefresh()
        let list1 = res.data.data
        that.changedate(res.data.data)
        
      },
      function(res) {
        console.log(res)
      }
    );
  },
  /**改变数据结构*/
  changedate(list1) {
    let list = list1
    for (let i in list) {
      //在list中添加一个字段sss保存状态名字
      // list[i]['sss'] = ''; //状态名
      list[i]['showTime'] = ''; //实际显示时间
      if (list[i].status ==0) {
        list[i].sss = '未付款',
        list[i]['showTime'] = list[i].add_time
      } else if (list[i].status ==1) {
        list[i].sss = '订单已取消'
        list[i]['showTime'] = list[i].add_time
      } else if (list[i].status ==2) {
        list[i].sss = '等待商家接单'
        list[i]['showTime'] = list[i].add_time
      } else if (list[i].status == 3 || list[i].status == 10 || list[i].status == 11  ||list[i].status == 15) {
        list[i].sss = '等待骑手接单'
        list[i]['showTime'] = list[i].pre_meal_time
      } else if(list[i].status == 13){
          list[i].sss = '商家已出餐'
      }else if (list[i].status == 4) {
        list[i].sss = '等待骑手取货'
        list[i]['showTime'] = list[i].add_time
      } else if (list[i].status == 12){
        list[i].sss = '骑手已到店'
        list[i]['showTime'] = list[i].add_time
      }else if (list[i].status ==5 || list[i].status ==7 ) {
        list[i].sss = '骑手配送中'
        list[i]['showTime'] = list[i].add_time
      } else if (list[i].status ==6) {
        list[i].sss = '订单已完成'
        list[i]['showTime'] = list[i].add_time        
      } else if (list[i].status ==8) {
        list[i].sss = '退款中'
        list[i]['showTime'] = list[i].add_time
      } else if (list[i].status ==9) {
        list[i].sss = '退款中'
        list[i]['showTime'] = list[i].add_time
      }else if(list[i].status ==14){
        list[i].sss = '退款成功'
      } else {
          console.log('不匹配的status',list[i].status)
          list[i].sss=1
        //  list.splice(i,1)
      }
    }
    for (var i in list) {
      if (list[i].sss==1) {
        list.splice(i,1) //删除其他状态的对象
      }
    }
    for (var i in list) {
      if (list[i].sss == 1) {
        list.splice(i, 1) //删除其他状态的对象
      }
    }
    console.log(list)
    this.setData({
      list: list
    })
  },
  /**确定收货模态 */
  showmodal(e) {
    let id = e.currentTarget.dataset.id
    console.log('id为：', id)
    wx.showModal({
      title: '是否确认收货？',
      content: '请确认是否收到订单商品',
      confirmText: '确认收货',
      confirmColor: '#ff6969',
      success: function(res) {
        if (res.confirm == true) {
          com.sentHttpRequestToServer(
            '/userapi/order/received_order', {
              id: id,
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
            url: '/Run_leg/Order_completion/index?order_id=' + id,
          })
        }
      }
    })
  },
  accept_Receipt() {

  },
  //再来一单
  order_again(event) {
    let order_id = event.currentTarget.dataset.orid
    let shopid = event.currentTarget.dataset.shopid
    com.sentHttpRequestToServer(
      '/userapi/order/again_down', {
        id: order_id,
      },
      'GET',
      function(res) {
        if (res.data.status.code == 200) {
          wx: wx.navigateTo({
            url: '/home/business/index?id=' + shopid,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      function(res) {
        console.log(res)
      }
    );
  },
  //收货详情
  progress(e) {
    let order_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/Speed_progress/index?order_id=' + order_id,
    })
  },
  //点击到店铺去
  goShop(event) {
    let shopid = event.currentTarget.dataset.shopid
    wx.navigateTo({
      url: '/home/business/index?id=' + shopid,
    })
  },
  //未付款支付
  payAgin(event){
    var order_mainId =event.currentTarget.dataset.mainid
    this.pay(order_mainId)
  },
  //登录
  goLogin(){
    wx.navigateTo({
      url: '/home/login/login',
    })
  },
  GetCachedData(){
    let that=this
    let shop_icon = app.globalData.imgUrl+"timg1.png"
    let user_icon = app.globalData.imgUrl +"Buyer.png"
    let rider_icon = app.globalData.imgUrl +"horseman.png"
    let _icon=''
    let url=''
    wx.downloadFile({
      url:shop_icon,
      success:function(res){
         _icon=res.tempFilePath.replace(/http:\// || /https:\//, '');
        console.log('下载 的商家图片：',_icon)
        app.globalData.shop_icon=_icon
      }
     
    })
    wx.downloadFile({
      url:user_icon,
      success:function(res){
         _icon=res.tempFilePath.replace(/http:\// || /https:\//, '');
        console.log('下载的商家图片：',_icon)
        app.globalData.user_icon=_icon
      }
     
    })
    wx.downloadFile({
      url:rider_icon,
      success:function(res){
         _icon=res.tempFilePath.replace(/http:\// || /https:\//, '');
        console.log('下载的商家图片：',_icon)
        app.globalData.rider_icon=_icon
      }
     
    })
  },
  /**
   *去评论
   */
  goComment(e){
    let id=e.currentTarget.id;
    wx.navigateTo({
      url: `/pages/Submission/index?order_id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.Initializehttp();
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
    // wx.startPullDownRefresh({
    // });
    // setTimeout(function(){
    //   wx.stopPullDownRefresh()
    // },1000)
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
  /**
   * 下拉刷新事件
   */
  onPullDownRefresh(){
    this.setData({
      isLoading:false,
      inquire_code:this.data.inquire_code
    })
    this.Initializehttp();
  },


  //微信提交支付
  pay: function (mainId) {
    let that=this
    console.log('支付mianId',mainId)
    wx.request({
      url: app.globalData.url+'api/Payment/wxpay',
      data: {
        openid: app.globalData.openid,
        order_id:mainId,
        type: 'JSAPI', //是 string APP(APP) / JSAPI(小程序) 
      },
      method: "POST",
      success: function (res) {
        that.callWx(res.data.data)
      },
      fail: function (err) {
        
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

        'success': function (res) {
          wx.reLaunch({
            url: '\/pages/Order/index',
          })
        },
        'fail': function (res) {
          console.log('失败', res)
        },
        'complete': function (res) {
          console.log('都有', res)
        }
      })
  },
})