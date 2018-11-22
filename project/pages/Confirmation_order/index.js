var app = getApp();
var newTime = getCurrentMonthFirst();
var leftTime = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore: false,
    imgUrl: app.globalData.imgUrl,
    timeBoxShow: false,
    imgShow: false,
    pagetime: '',
    tabs: ["支付宝", "微信"],
    clickId: 0,
    clickItem: "支付宝",
    blocks: "none",
    Obj: {},
    timeArr: [],
    detilTime: [],
    timeActive: 't0',
    t1: '', //年月日
    t2: '', //时间
    inputName: app.globalData.remark || '',
    userInfo: {}, //用户地址
    goodsList: [], //商品列表
    shopInfo: {},
    disObj: {}, //配送费用对象
    couponObj: {}, //优惠券对象
    redpackObj: {}, //红包对象
    discountList: [], //满减优惠
    timeArr: [], //全部时间
    rightArr: [], //右侧时间
    leftArr: [], //左侧时间
    selectedIndex: 0, //时间是否选中下标
    sysName: ''
  },
  tabclick: function(res) {
    this.setData({
      clickId: res.currentTarget.id,
      clickItem: this.data.tabs[res.currentTarget.id],
      blocks: "none"
    });
  },
  block: function(e) {
    this.setData({
      blocks: "block"
    })
  },
  // 自取查看地图用 ，该版本没用。
  lookShopMap: function(e) {
    let obj = this.data.Obj;
    var a = "<view>adfafdafasfafa</view>";
    wx.openLocation({
      latitude: obj.address.wd * 1,
      longitude: obj.address.jd * 1,
      name: obj.shop_name,
      address: obj.address.sheng + obj.address.shi + obj.address.qu +
        obj.address.address + obj.address.building_card,
      success: function(res) {

      }
    })
  },
  onLoad: function(options) {
    let that = this;
    console.log('option',options)
    this.setData({
      sysName: app.globalData.smName || '系统配送',
      isIphoneX: app.globalData.isIphoneX,
      inputName: app.globalData.remark || ""
    })
  },

  getOrder(){
    let that= this;
    wx.request({
      url: app.globalData.url + '/userapi/user_cart/get',
      data: {
        user_id: app.globalData.userId,
        shop_id: that.options.shopid,
      },
      method: "GET",
      success: function (res) {
        if(res.data.status.code == 200){
          that.orderFun(res)
        }
      },fail:res=>{

      }
      })
  },
  //核心交互
  orderFun(res) {
    let that = this;
    console.log(res)
    let orderObj = res.data.data;
    that.setData({
      time1: orderObj.date_time ? getDateStr(orderObj.date_time) : '',
      orderObj: orderObj,
      userInfo: orderObj.user, //用户地址
      goodsList: orderObj.group_items || [],  //商品列表
      couponObj: orderObj.coupon, //优惠券对象
      couponList: orderObj.coupon_list, //优惠券列表
      packetObj: orderObj.packet,   //红包对象
      packetList: orderObj.packet_list,    //红包列表
      fullObj: orderObj.full,    //满减活动
      shopInfo: orderObj.shop    //店铺信息
    })

  },
  query: function() {
    let that = this;
    that.getOrder();
  },

  //备注输入框
  bindKeyInput: function(e) {
    let val = e.detail.value;
    this.setData({
      inputName: val
    })
    app.globalData.remark = val;
  },

  //获取预约时间
  getTime() {
    let that = this;
    wx.request({
      url: app.globalData.url + '/userapi/user_cart/getDateTime',
      data: {
        stamp: that.data.orderObj.date_time
      },
      method: "GET",
      success: function(res) {
        if (res.data.status.code == 200) {

          let _arr = res.data.data;
          let _a = [];
          let _a1 = [];
          let index = 0;
          let isSelected;
          for (let key in _arr) {
            _a.push(key);
            _a1.push(_arr[key]);
          }
          _a1.forEach((item, i) => {
            item.forEach(li => {
              if (li.selected == 'Y') {
                console.log(index, i)
                index = i;
              }
            })
          })
          let rightArr = _a1[index];
          that.setData({
            timeActive: _a[index],
            timeBoxShow: true,
            rightArr: rightArr,
            timeArr: _a1,
            leftArr: _a,
            selectedIndex: index
          })
        }

      },
      fail: function(err) {

      }
    })
  },
  //获取优惠券
  getcoupon: function() {
    let that = this;
    that.setData({
      youhuitype: 1,
      youhuiList: that.data.couponList,
      youhuiIsshow: true
    })
  },
  // 获取红包
  getRedPack: function() {
    let that = this;
    that.setData({
      youhuitype: 2,
      youhuiList: that.data.packetList,
      youhuiIsshow: true
    })
  },
  //优惠券。红包选择的时候
  checkedYouhui: function(e) {
    let that = this;
    let t = that.data.youhuitype;
    let id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    let url, data;
    let list = that.data.youhuiList;
    data = {
      user_id: app.globalData.userId,
      shop_id:that.data.shopInfo.shop_id,
      hash: e.currentTarget.dataset.hash,
    }

    if (t == 1) {
      url = "/userapi/user_cart/updateCoupon";
  
    } else if (t == 2) {
      url = "/userapi/user_cart/updatePacket"
  
    }
    wx.request({
      url: app.globalData.url + url,
      data: data,
      method: "GET",
      success: function(res) {
        if (res.data.status.code == 200) {
          that.orderFun(res);
          that.data.youhuiList.forEach((item, i) => {
            item.selected = i == index ? "Y" : "N"
          })
          that.setData({
            youhuiList: that.data.youhuiList
          })
        }
      },
      fail: function(err) {

      }
    })

  },

  //隐藏模态
  hideModel: function(e) {
    let t = this;
    t.setData({
      youhuiIsshow: false,
      timeBoxShow: false
    })
  },

  //选择配送时间
  timeSelect: function() {

    let that = this;
    if (that.data.Obj.shop.open_preorder == 1) {
      let time = that.data.Obj.pre_delivery_time;
      let arr = [];
      for (let i = 0; i < 7; i++) {
        arr.push(dateLater(getCurrentMonthFirst(), i));
      }
      that.setData({
        timeBoxShow: true,
        timeArr: arr,
      });
      leftTime = time.trim().split(" ")[0];
    } else {
      this.setData({
        dialogTitle: '商家不支持预定~'
      })
      this.dialog.showDialog();
    }
  },
  timeClear: function(e) {
    this.setData({
      timeBoxShow: false
    })
  },
  lookMore() {
    let that = this;
    this.setData({
      imgShow: !that.data.imgShow
    })
  },
  //左边选日期
  timeLeftClick: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let timeArr = that.data.timeArr;

    that.setData({
      selectedIndex: index,
      rightArr: timeArr[index]
    })
  },
  //右边选时分
  timeRightClick: function(e) {
    let that = this;
    let stamp = e.currentTarget.dataset.stamp;
    let index = e.currentTarget.dataset.index;
    console.log(that.data.orderObj)
    wx.request({
      url: app.globalData.url + '/userapi/user_cart/updateDateTime',
      data: {
        user_id:app.globalData.userId ,
        shop_id: that.data.shopInfo.shop_id,
        stamp: stamp,
      },
      method: "POST",
      success: function(res) {
        if (res.data.status.code == 200) {
          that.data.rightArr.forEach((item, i) => {
            item.selected = index == i ? "Y" : "N";
          })
          that.setData({
            rightArr: that.data.rightArr
          })
          that.orderFun(res);
        }
      },
      fail: function(err) {

      }
    })
    this.setData({

    })
  },
  errorTitle() {
    let that = this;
    that.setData({
      erro: true
    })
    setTimeout(function() {
      that.setData({
        erro: false
      })
    }, 500)
  },

  //微信提交支付
  pay: function(obj) {
    let that = this;
    wx.request({
      url: app.globalData.url + 'api/Payment/wxpay',
      data: {
        openid: app.globalData.openid,
        //  openid: 'ow9z00NQHNYednbM-gzGYEkFNMfk', 
        //  body: obj.shop_name, //是 string 商品描述 
        //  detail: obj.user_remark, //是 string 商品详情 
        //  out_trade_no: obj.order_num, //是 string 订单编号 
        //  total_fee: obj.order_sum_money, //是 int 订单总金额(分) 
        //  total_fee: 1, //是 int 订单总金额(分) 
        //  spbill_create_ip: '12.02.03.3', //是 string 设备IP 
        type: 'JSAPI', //是 string APP(APP) / JSAPI(小程序)
        order_id: obj.id
      },
      method: "POST",
      success: function(res) {
        that.callWx(res.data.data)
      },
      fail: function(err) {
        swx.showToast({
          title: '支付失败',
        })
      }
    })
  },
  /*调用微信支付*/
  callWx: function(obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function(res) {
        wx.switchTab({
          url: '/pages/Order/index',
        })
      },
      'fail': function(res) {
        wx.switchTab({
          url: '/pages/Order/index',
        })
      },
      'complete': function(res) {}
    })
  },
  confirOrder: function() { // 订单支付
    let that = this;
    let arr = [];

    if(that.data.orderObj.can_order == 'N'){
      wx.showToast({
        title: `地址信息不可用
      请修改收货地址~~~`,
        icon: 'none',
        duration: 5000
      })
      return false;
    }
    wx.request({
      url: app.globalData.url + 'userapi/new_order/create',
      data: {
        user_id: app.globalData.userId,
        shop_id: that.data.shopInfo.shop_id,
        remark:app.globalData.remark
      },
      method: "POST",
      success: function(res) {
        that.pay(res.data.data)
        delete app.globalData.remark;
      },
      fail: function(err) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;

    that.query();
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog() {
    this.dialog.showDialog();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

})

/*获取当前时间 */
function getCurrentMonthFirst() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}
/*传入时间后几天 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ((date.getMonth() + 1)) : date.getMonth() + 1);
  dateObj.day = (date.getDate() < 10 ? (date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  dateObj.str = dateObj.month + '月' + dateObj.day + '日';
  dateObj.id = 't' + later;
  dateObj.alltime = dateObj.year + '-' + dateObj.month + '-' + dateObj.day;

  if (later == 0) {
    dateObj.str = '今天'
  } else if (later == 1) {
    dateObj.str = '明天'
  }
  return dateObj;
}
/*对比距离当前时间的天数*/
function getDateStr(str) {
  str = str * 1000;
  let d1 = new Date(),
    _str = '',
    d2 = new Date(str),
    show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六'),
    week = show_day[new Date(str).getDay()];

  if (d1.getDate() == d2.getDate()) {
    _str = '今天'
  } else if (d2.getDate() == (d1.getDate() + 1) || (d1.getMonth() != d2.getMonth() && d2.getDate() == 1)) {
    _str = '明天'
  } else {
    _str = ((d2.getMonth() + 1) < 10 ? ((d2.getMonth() + 1)) : d2.getMonth() + 1) + '月' +
      d2.getDate() + "日"
  }
  _str += "(" + week + ")" +
    (d2.getHours() < 10 ? '0' + d2.getHours() : d2.getHours()) + ':' + (d2.getMinutes() < 10 ? '0' + d2.getMinutes() : d2.getMinutes());

  return _str
}