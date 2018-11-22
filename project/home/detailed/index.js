var app = getApp();
var com = require("../../common.js");
var md5 = require("../../utils/md5.js");
var that = null;
var isClick1 = true;
var isClick2 = true;


Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    scrollLength: 0,
    carAddorMiu: true, // 加减是否可加减
    goodsObj:{},
    count:0,
    goodsList:[],
    spread:0,
    dis_money:0,
    guigeShow:false,
    alls: [
      {
        id: "0",
        span: "全部"
      },
      {
        id: "1",
        span: "有图"
      }
    ],
    allspanid: "0",
    showCartDetail: false
  },
  onLoad: function (options) {
    
    console.log(options)
    let that =this;
    that.setData({
      send_price: options.send_price,
      isIphoneX: app.globalData.isIphoneX,
      userPhoneShow: app.globalData.userPhone 
    })
    that.getdetaill()
  },
  //获取商品详情
  getdetaill:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'userapi/goods/detail',
      data: {
        id: that.options.id ,
        user_id : app.globalData.userId
      },
      method: "GET",
      success: function (res) {

        let obj = res.data.data.goods;
        obj.num = res.data.data.goods.cart_num || 0 ;
        that.setData({
          goodsObj: obj,
        })
        console.log(that.data.goodsObj)
        com.pageTitle('商品详情');
        that.getComtent();
        that.getShopCarList();
      },
      fail: function (err) {

      }
    })
  },


  //显示规格的模态框，并且绑定数据上去
  guigeShowClick: function (e) {
    let that = this,
      hashStr = '',
      str = '',
      hasNum = e.currentTarget.dataset.num,
      obj = {
        goods_id: that.options.id  ,
        name: e.currentTarget.dataset.name,
        arr: that.data.goodsObj.attribute,
        price: e.currentTarget.dataset.price
      },
      cartList = that.data.cartList;
    //还没有去根据shopid 去购物车去找对应的

    if (hasNum > 0) {
      let _arr, _str = '',_arrStr;
      cartList.forEach(item => {
        if (obj.goods_id == item.item_id && !_arr) {
          _arrStr = item.norms
        }
      })
      console.log(_arrStr)
      if (_arrStr!='') {
        _arr = _arrStr.replace(/\s+/g, "").split(',');
        obj.arr.forEach((item, index, arr) => {
          _arr.forEach((li, i) => {
            if (i == index) {
              item.selected = li,
                _str += (item.name + li);
              i + 1 == _arr.length ? str += li : str += li + ',';
            }
          })
        })

        let _obj = cartList.filter(item => {
          return item.hash == md5.md5((obj.goods_id + _str).replace(/\s+/g, ""))
        })
        obj.num = _obj[0].num;
        hashStr = _obj[0].hash;
      }
    } else {
      obj.arr.forEach((item, index, arr) => {
        item.selected = item.attribute[0];
        index + 1 == arr.length ? str += item.selected : str += item.selected + ' , ';
        hashStr += (item.name + item.selected)
      })
      hashStr = md5.md5(obj.goods_id+hashStr);
      obj.num = 0
    }
    obj.price = that.data.goodsObj.goods_price

    obj.hashStr = hashStr;
    obj.str = `${str}`;
    that.setData({
      guigeObj: obj,
      guigeShow: true
    })
    com.modelMiddle('.guige-model', that);

  },
  //规格选择按钮
  guiChangeClick: function (e) {
    let that = this,
      cartList = that.data.cartList,
      findex = e.currentTarget.dataset.findex,
      val = e.currentTarget.dataset.val,
      str = '',
      hashStr = '',
      guigeObj = that.data.guigeObj;
    guigeObj.arr[findex].selected = val;
    guigeObj.arr.forEach((item, index, arr) => {
      index + 1 == arr.length ? str += item.selected : str += item.selected + ',';
      hashStr += (item.name + item.selected)
    })
    guigeObj.hashStr = md5.md5(guigeObj.goods_id + hashStr);
    guigeObj.str = `${str}`;
    guigeObj.num = 0;

    if (cartList.length > 0) {
      cartList.forEach(item => {
        if (item.hash == guigeObj.hashStr) {
          guigeObj.num = item.num
        }
      })
    }
    that.setData({
      guigeObj: guigeObj
    })

  },
  //购物车数量改变
  carnumChage: function (e) {
    let that = this,
      dataobj = {},
      good_id = e.currentTarget.dataset.id || that.data.guigeObj.goods_id,
      url = e.currentTarget.dataset.type == 1 ? '/userapi/user_cart/addItem' : '/userapi/user_cart/reduceItem',
      hasGuige = e.currentTarget.dataset.hasguige,
      hash = '',
      guigenum = e.currentTarget.dataset.guigenum,
      arr = [],
      arrStr = '';
    if (hasGuige && hasGuige == 1) {   //购物车外面的点击
      if (e.currentTarget.dataset.id) {  //没有规格的点击加减
        arrStr = '规格,默认'
        hash = md5.md5(good_id + '规格默认')
      } else {  //有规格的点击加减
        let _obj = that.data.guigeObj;
        let _str = '';
        _obj.arr.forEach(item => {
          let _o = {
            norm_name: item.name,
            norm_value: item.selected
          }
          arr.push(_o);
          _str += (item.name + item.selected);
        })
        arrStr = _obj.str;
        console.log(_obj.goods_id)
        hash = md5.md5(_obj.goods_id + _str);
      }

    } else { //购物车里面的点击
      arrStr = e.currentTarget.dataset.arrstr;
      hash = e.currentTarget.dataset.hash;
    }
    wx.request({
      url: app.globalData.url + url,
      data: {
        goods_id: good_id,
        norms: arrStr,
        hash: hash,
        user_id: app.globalData.userId ,
        shop_id: that.data.goodsObj.shop_id 
      },
      method: 'POST',
      success: (res => {
        if (res.data.status.code == 200) {
          that.shopCartFun(res, guigenum)
        }
      }),
      fail() { }

    })

  },
  //清空购物车
  clearCart: function () {
    let that = this;
    let cartList = that.data.cartList;  //菜单列表 
    wx.request({
      url: app.globalData.url + '/userapi/user_cart/clear',
      data: {
        user_id: app.globalData.userId,
        shop_id: that.data.goodsObj.shop_id ,
      },
      method: 'GET',
      success: (res => {
        if (res.data.status.code == 200) {
          that.data.goodsObj.num = 0;
          that.setData({
            goodsObj: that.data.goodsObj,
            cartList: [],
            sum: 0,
            count: 0,
            showCartDetail: false,
          })
        }
      }),
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取购物车信息
  getShopCarList: function (type) {
    let that = this;
    let carheadIsfiexd;
    wx.request({
      url: app.globalData.url + '/userapi/user_cart/get',
      data: {
        user_id: app.globalData.userId,
        shop_id: that.data.goodsObj.shop_id,
      },
      method: 'GET',
      success: (res => {
        if (res.data.status.code == 200) {
          that.shopCartFun(res)
        }
      }),
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //购物车核心功能
  shopCartFun(res, guigenum) {
    let that = this;
    let cartList = [];
    let goodsObj = that.data.goodsObj;
    let total = {};
    if (res.data.data.group_items && res.data.data.group_items.length>0) {   //如果购物车存在
       cartList = res.data.data.group_items; //购物车列表
      total = {
        sale: res.data.data.items_price || 0,
        price: res.data.data.items_price || 0,
        num: res.data.data.num || 0
      };   //总价，数量等集合
    } else {
      that.setData({
        showCartDetail: false
      })
    }
    if(cartList.length>0){
      let num = 0;
      cartList.forEach(item=>{
        if (item.item_id == goodsObj.id) num += item.num;
      })
      goodsObj.num = num;
    }else{
      goodsObj.num = 0;
      that.setData({
        showCartDetail: false
      })
    }
    if (guigenum) {
      let obj = that.data.guigeObj;
      let num = 0;
      cartList.forEach(item => {
        if (item.hash == obj.hashStr) {
          num = item.num
        }
      })
      obj.num = num ;
      that.setData({
        guigeObj: obj
      })
    }
    that.setData({
      goodsObj: goodsObj,
      cartList: cartList,
      sum: total.sale ||0,
      count: total.num ||0,
      dis_money: res.data.data.shop.base_distribution_fee
    })
  },
  //隐藏购物车详情
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    })
  },
  //获取用户手机
  getPhoneNumber: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/userapi/user/put_phone',
      data: {
        user_id: app.globalData.userId,
        session_key: app.globalData.session_key,
        encrypted_data: e.detail.encryptedData,
        iv: e.detail.iv
      },
      method: "GET",
      success: function (res) {
        app.globalData.userPhone = res.data.data.phoneNumber;
        that.setData({
          userPhoneShow: app.globalData.userPhone
        })
      },
      fail: function (err) {

      }
    })
  },
  showCartclick: function () {
    let that = this;
    if (that.data.count > 0) {
      that.getShopCarList();
      this.setData({
        showCartDetail: !this.data.showCartDetail
      });
    }
  },
  hideCartDetail:function(){
    this.setData({
      showCartDetail: false
    })
  },
  //获取评价
  getComtent: function () {
    let that = this,
      type = that.data.allspanid || 0;
    wx: wx.request({
      url: app.globalData.url + '/userapi/Take_Shop_About/indexList.html',
      data: {
        id: that.data.goodsObj.shop_id,
        t: 1,
        gid: that.options.id,
        img: type
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status.code == 200) {
          var _d = res.data.data;
          _d.forEach(function (item, i) {
            item.add_time = item.add_time.substring(0, 11)
            item.imgList && (item.imgList = item.imgurl.split(','));
          })
          that.setData({
            pinlun: res.data.data
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
 
  closeGuige: function () {
    this.setData({
      guigeShow: false
    })
  },
  submit: function (e) {
    var that = this;
    if (that.data.count > 0 && that.data.sum >= that.data.send_price*1) {
      wx.navigateTo({
        url: '\/pages/Confirmation_order/index?shopid=' + that.data.goodsObj.shop_id,
      })
    }
  }
})  