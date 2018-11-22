var app = getApp();
var com = require("../../common.js");
var md5 = require("../../utils/md5.js");
var that = null;
var canClick = true; //购物车加减操作
var aa = 1;
let str = '';
var i = 0;
var typeIndex = 0; // 左侧分类下标
var _h = 0;
var current_page = 1,
  last_page = '';
var spans = {
  border1: "border:1px solid #999",
  border2: "border:1px solid #ff5d5d"
};


Page({
  data: {

    modalTop:'15rpx',
    opacity:0,
    userPhoneShow: '',
    imgUrl: app.globalData.imgUrl,
    firstid: '',
    firsetName: '',
    // firsetText:'',
    spans,
    num: '',
    goods_list: [],
    topTable: [{
      id: "table1",
      name: "点餐"
    },
    {
      id: "table2",
      name: "评价"
    },
    {
      id: "table3",
      name: "商家"
    }
    ],
    alls: [{
      id: "0",
      span: "全部"
    },
    {
      id: "1",
      span: "有图"
    }
    ],
    currentTabId: "table1",
    allspanid: "0",
    scrollLength: 0,
    currentTabSwiperIndex: 0,
    scrollLeft: 0,
    winHeight: 0,
    cartList: [], //购物车列表
    menuList: [], //
    sum: 0,
    spread:0, //差价
    carheadIsfiexd: false, //购物车清空flexd
    count: 0,
    total: 0,
    allNum: 0,
    pageList: [], // 商品栏
    showCartDetail: false,
    couponIsshow: false, //优惠券列表显示
    youhuiDetailHide: false, // 公告
    guigeObj:{},  //规格弹出框的对象
    guigeShow:false //规格模态框显示

  },



  onReady: function () {

    
    let that = this;
    
    that.setData({
      platform : (app.globalData.getSystemInfo.platform == 'ios')
    })
     
    
  },
  //转发
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.detail.shop_name,
      path: `home/business/index?id=${that.data.detail.id}&isShare=1`,
      success: function (res) {
        
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {
      
      }
    }
  },
  onLoad: function (po) {

  
  },

  onShow: function () {
    let that = this;
  
    // if (app.globalData.remark) delete app.globalData.remark;   //删除备注

    wx.showShareMenu({
      withShareTicket: true
    })


    if (that.options.isShare  == 1) {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          com.getUsername(that.classQuery());
        }, fail: res => {
          wx.navigateTo({
            url: '\../login/login',
          })
        }
      })
    }else{
      that.classQuery();
    }
    wx.showNavigationBarLoading();
  
  },
  //获取店铺信息
  classQuery: function () {
    let that = this;
    let _h = 0;
    com.sentHttpRequestToServer(
      '/userapi/shop/shopInfo.html', {
        uid: app.globalData.userId ,
        id: that.options.id  
      },
      'GET',
      function (res) {
        if (res.data.status.code == 200) {
          res.data.data.minute = com.conversionTime(res.data.data.minute);
          res.data.data.dis_money = res.data.data.dis_money.toFixed(2)
          res.data.data.shop_coupons.forEach(function (item) {
            item.money = parseInt(item.money);
            item.give_money = parseInt(item.give_money);
          })
          res.data.data.shop_coupons.forEach(item=>{
            item.end_time = com.formatDateTime(item.end_time,true)
          })
          that.setData({
            detail: res.data.data,
            fontColor: '#ffffff',
            backgroundColor: '#333'
          })
          that.getClassList();
          that.setData({
            isIphoneX: app.globalData.isIphoneX,
            userPhoneShow: app.globalData.userPhone
          })
          wx.getSystemInfo({
            success: function (res) {
              wx.createSelectorQuery().select('#youhui').boundingClientRect(function (rect) {
                _h = rect.height;
                that.setData({
                  winHeight: res.windowHeight - (123 + _h * 1),
                })
              }).exec();
            }
          })
          com.pageTitle(res.data.data.shop_name);
          wx.setNavigationBarColor({
            frontColor: that.data.fontColor,
            backgroundColor: that.data.backgroundColor,
          })
        }
      }
    )
  },
  //获取左侧菜单
  getClassList: function () {
    let that = this;
    wx: wx.request({
      url: app.globalData.url + '/userapi/shop/shopTypeList.html',
      data: {
        uid: app.globalData.userId,
        id: that.options.id
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status.code == 200) {
          var d = res.data.data;
          let num = 0;
          d.forEach(function (item, i) {
            item.uunum = 0;
            item.goods_list.forEach(function (arr) {
              item.uunum += arr.num * 1;
              num += arr.num * 1;
            })
          })
          let firstid = d[0].id,
            firsetName = d[0].menu_name,
            firsetText = d[0].describe;
          that.setData({
            menuList: d,
            firstid: firstid,
            firsetName: firsetName,
            firsetText,
            firsetText,
            count: num
          })
          that.getGoodsList();
        } else {
          wx.showModal({
            title: '操作提示',
            content: '商家没有商品',
            showCancel: false,
            success: function () {

            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideNavigationBarLoading();
      },
    })
  },
  //获取商品列表
  getGoodsList() {
    let that = this;
    wx.request({
      url: app.globalData.url + 'userapi/goods/lists',
      data: {
        menu_id: that.data.firstid,
        user_id: app.globalData.userId ,
        page: current_page
      },
      method: "POST",
      success: function (res) {
        let list = that.data.goods_list || [];
        if (res.data.status.code == 200) {
          current_page = res.data.data.current_page;
          last_page = res.data.data.last_page;
          let item = res.data.data.data;
          current_page == 1 ? list = item : list.push.apply(list, item);
          that.setData({
            goods_list: list
          })
          that.getShopCarList();
        }
      },
      fail: function (err) {

      }
    })
  },
  //显示规格的模态框，并且绑定数据上去
  guigeShowClick:function(e){

    let that = this,
    hashStr='',
    str = '',
    hasNum = e.currentTarget.dataset.hasnum,
    obj={
      goods_id:e.currentTarget.dataset.id,
      name:e.currentTarget.dataset.name,
      arr:e.currentTarget.dataset.arr,
      price:e.currentTarget.dataset.price
    },
    cartList = that.data.cartList;
    //还没有去根据shopid 去购物车去找对应的
  
    if (hasNum > 0) {
      let _arr,_str='',_arrStr='';
      cartList.forEach(item=>{
        if (obj.goods_id == item.item_id && !_arr){
          _arrStr = item.norms
        }
      })
      if (_arrStr!=''){
        _arr = _arrStr.replace(/\s+/g, "").split(',');
        obj.arr.forEach((item, index, arr) => {
          _arr.forEach((li,i)=>{
            if(i == index){
              item.selected = li,
                _str+=(item.name+li);
                i + 1 == _arr.length ? str += li : str += li + ',';
            }
          })
        })

        let _obj  = cartList.filter(item=>{
          return item.hash == md5.md5((obj.goods_id + _str).replace(/\s+/g, ""))
        })
        console.log(_obj)
        obj.num = _obj[0].num;
        hashStr = _obj[0].hash;
      }
 
      } else {
        obj.arr.forEach((item,index,arr)=>{
          item.selected = item.attribute[0];
          index + 1 == arr.length ? str += item.selected : str += item.selected + ' , ';
          hashStr += (item.name + item.selected)
        })
        hashStr = md5.md5(obj.goods_id +hashStr);
        obj.num = 0
      }
           
    obj.hashStr = hashStr;
    obj.str = `${str}`;
    that.setData({
      guigeObj:obj,
      guigeShow:true,
    })

    com.modelMiddle('.guige-model',that);
  },
  //规格选择按钮
  guiChangeClick:function(e){
    let that = this,
    cartList = that.data.cartList,
    findex = e.currentTarget.dataset.findex,
    val = e.currentTarget.dataset.val,
    str = '',
    hashStr='',
    guigeObj = that.data.guigeObj;
    guigeObj.arr[findex].selected = val;
    guigeObj.arr.forEach((item,index,arr) =>{
      index + 1 == arr.length ? str += item.selected :str += item.selected + ',';
      hashStr += (item.name+item.selected)
    })
    guigeObj.hashStr = md5.md5(guigeObj.goods_id+hashStr);
    guigeObj.str = `${str}`;
    guigeObj.num = 0;
    
    if (cartList.length>0){
      cartList.forEach(item=>{
        console.log(item.hash)
        if (item.hash == guigeObj.hashStr){
          guigeObj.num = item.num
        }
      })
    }
    that.setData({
      guigeObj:guigeObj
    })

  },
  //购物车数量改变
  carnumChage:function(e){
    if (canClick){
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
          hash = md5.md5(good_id+'规格默认')
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
          user_id: app.globalData.userId,
          shop_id: that.options.id 
        },
        method: 'POST',
        success: (res => {

          if (res.data.status && res.data.status.code == 200) {
            that.shopCartFun(res, guigenum)
          }else{
              canClick = true;
          }
        }),
        fail() { 
          canClick = true;
        }
      })
    }
  },
 //清空购物车
 clearCart:function(){
   let that= this;
   let goods_list = that.data.goods_list;   //商品列表
   let menuList = that.data.menuList;  //菜单列表 
   let cartList = that.data.cartList;  //菜单列表 
   wx.request({
     url: app.globalData.url + '/userapi/user_cart/clear',
     data: {
       user_id: app.globalData.userId,
       shop_id: that.options.id 
     },
     method: 'GET',
     success: (res => {
       if (res.data.status.code == 200) {
         menuList.forEach(list => {   //菜单列表渲染
           list.uunum = 0;
         });
         goods_list.forEach(list => {   //菜单列表渲染
           list.cart_num = 0;
         })

         that.setData({
           cartList:[],
           sum: 0,
           count:0,
           menuList: menuList,
           showCartDetail:false,
           goods_list: goods_list
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
        user_id: app.globalData.userId ,
        shop_id: that.options.id
      },
      method: 'GET',
      success:(res=>{
        if(res.data.status.code == 200){
          that.shopCartFun(res)
        }
      }),
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //购物车核心功能
  shopCartFun(res, guigenum){
    let that = this;
    let cartList =[];
    let total={};
    let goods_list = that.data.goods_list;   //商品列表
    let menuList = that.data.menuList;  //菜单列表 
    if (res.data.data.group_items&&res.data.data.group_items.length>0){   //如果购物车存在
      cartList = res.data.data.group_items;   //购物车列表
      total = {
        sale: res.data.data.items_price || 0,
        price: res.data.data.items_price || 0,
        num: res.data.data.num || 0
      };   //总价，数量等集合
     
    }else{
      that.setData({
        showCartDetail:false
      })
    }
    menuList.forEach(list => {   //菜单列表渲染
      list.uunum = 0;
      if (res.data.data && cartList.length>0){
        cartList.forEach(item => {
          if (list.id == item.menu_id) list.uunum += item.num;
        });
      }
     
    });
    goods_list.forEach(list => {   //商品列表渲染
      list.cart_num = 0;
      if (res.data.data && cartList.length > 0) {
        cartList.forEach(item => {
          if (list.id == item.item_id) list.cart_num += item.num;
        });
      }
    })
   
    if (guigenum){   //是规格点击的话
      let obj = that.data.guigeObj;
      let num = 0;
      cartList.forEach(item=>{
        if (item.hash == obj.hashStr){
          num = item.num
        }
      })
      obj.num = num;
      that.setData({
        guigeObj : obj
      })
    }
    that.setData({
      goods_list: goods_list,
      menuList: menuList,
      cartList: cartList,
      dis_money: res.data.data.shop.base_distribution_fee,
      sum: total.sale || 0,
      count:total.num || 0,
    })
    canClick = true;
  },
  //隐藏购物车详情
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    })
  },
  closeGuige:function(){
    this.setData({
      guigeShow:false
    })
  },




  //菜单栏点击
  tapClassify: function (e) {

    var id = e.currentTarget.dataset.id;
    var mid = e.currentTarget.dataset.mid;
    let name = e.currentTarget.dataset.name;
    let text = e.currentTarget.dataset.text
    current_page = 1;
    this.setData({
      firstid: mid,
      firsetName: name,
      firsetText: text,
      num: 0
    });
    this.getGoodsList();
  },
  //加载更多
  readMore() {
    let that = this;
    if (current_page < last_page) {
      current_page += 1
      that.getGoodsList();
    }
  },
  // 顶部TAB点击 
  tableTap: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.index;
    that.setData({
      currentTabId: e.target.id,
      currentTabSwiperIndex: e.currentTarget.dataset.index
    });


    //that.getInfoList(e.target.dataset.index,0);  
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
        app.globalData.userPhone = res.data.data.phone;
        that.setData({
          userPhoneShow: app.globalData.userPhone 
        })
      },
      fail: function (err) {

      }
    })
  },
  follow: function () {
    this.setData({
      followed: !this.data.followed
    });
  },
  showCartclick() {
    let that = this;
    if (that.data.count > 0) {
      that.getShopCarList();
      this.setData({
        showCartDetail: !this.data.showCartDetail
      });
    }
  },
  //评论全部 和 有图
  allstap: function (e) {
    this.setData({
      allspanid: e.currentTarget.dataset.id,
      // currentTabSwiperIndex: e.currentTarget.dataset.index
    });
    this.getComtent();
    //that.getInfoList(e.target.dataset.index,0);  
  },
  //优惠详情隐藏显示
  yhDetailClick: function () {
    this.setData({
      youhuiDetailHide: !this.data.youhuiDetailHide,
    })
  },
  couponClick: function (e) {
    let t = e.currentTarget.dataset.type;
    let isShow;
    t == 1 ? isShow = true : isShow = false;
    let that = this;
    that.setData({
      couponIsshow: isShow
    })
  },
  //    列表区域滑动 
  onSwiper: function (e) {
    let that = this;
    var currentIndex = e.detail.current;
    if (currentIndex == 1) {
      //评论
      that.getComtent();
      that.shopTalkCount();
    }
  //  console.log(e.detail.current) //0 商家列表   1 评论列表   2 商家信息
    that.setData({
      currentTabId: that.data.topTable[currentIndex].id,
      currentTabSwiperIndex: currentIndex
    });
    if (currentIndex > this.data.topTable.length / 2) {
      that.setData({
        scrollLeft: that.data.scrollLeft + 150
      });
    } else {
      that.setData({
        scrollLeft: 0
      });
    }
  },
  //优惠券选择
  couponSelect: function (e) {
    let that = this;

    let id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    let list = that.data.detail;
    if (list.shop_coupons[index].coupons.length == 0) {
      wx.request({
        url: app.globalData.url + '/userapi/coupon/take',
        data: {
          uid: app.globalData.userId,
          coupon_id: id
        },
        method: "POST",
        success: function (res) {
          if (res.data.status.code == 200) {
            list.shop_coupons[index].coupons.push('1')
          }
          that.setData({
            detail: list
          })
        },
        fail: function (err) {

        }
      })
    }


  },
  //跳转到详情页
  gotoDetail: function (e) {
    let id = e.currentTarget.dataset.detailid;
    wx.navigateTo({
      url: `\/home/detailed/index?id=${id}&send_price=${this.data.detail.send_price}`,
    })
  },
  //全部评价
  shopTalkCount: function () {
    var that = this;
    wx: wx.request({
      url: app.globalData.url + 'userapi/shop/shopTalkCount.html',
      data: {
        id: that.options.id,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status.code == 200) {
          res.data.data.str = Math.round(res.data.data.str);
          console.log('全部评价', res.data.data.str)

          that.setData({
            pinlunInfo: res.data.data
          })
        }
      },
      fail: function (res) { },
    })
  },
  //获取评价
  getComtent: function () {
    let that = this,
      type = that.data.allspanid || 0;
    wx: wx.request({
      url: app.globalData.url + '/userapi/Take_Shop_About/indexList.html',
      data: {
        id: that.options.id,
        t: 1,
        img: type
      },
      method: 'GET',
      success: function (res) {
        if (res.data.status.code == 200) {
          var _d = res.data.data;
          _d.forEach(function (item, i) {
            item.imgList = item.imgurl ? item.imgurl.split(',') : '';
            item.time_num = (item.time_num * 1).toFixed(1)
          })
          that.setData({
            pinlun: res.data.data
          })
        }
      },
      fail: function (res) { },
    })
  },
  //预览图片
  previewImg: function (e) {
    let that = this;
    let arr = [];
    let url = e.currentTarget.dataset.url;
    let _a = that.data.detail.shop_photo;
    _a.forEach(function (item) {
      arr.push(item.imgurl)
    })
    com.previewImg(url, arr)
  },
  // 评论预览
  previewImg1: function (e) {
    let that = this;
    let arr = [];
    let url = e.currentTarget.dataset.url;
    let _a = e.currentTarget.dataset.item;
    console.log(_a)
    // _a.forEach(function (item) {
    //   arr.push(item.imgurl)
    // })
    com.previewImg(url, _a)
  },
  submit: function (e) {
    let that = this;
    if (that.data.sum >= that.data.detail.send_price && that.data.count > 0) {

      wx.navigateTo({
        url: '\/pages/Confirmation_order/index?shopid=' + that.options.id,
      })
   
      // wx.request({
      //   url: app.globalData.url + '/userapi/user_cart/get',
      //   data: {
      //     user_id: app.globalData.userId,
      //     shop_id: that.options.id ,
      //   },
      //   method: "POST",
      //   success: function (res) {
      //     if (res.data.status.code == 200) {
      //       app.globalData.orderObj = res.data.data;
      //     }
        
      //   },
      //   fail: function (err) {

      //   }
      // })

    }
  },
  
});
