var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOk:false,
    noData:false,
    uhide: 1,
    items:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //检测到返回时刷新本页
  onShow(){
    var that = this;
    const imgUrl = getApp().globalData.imgUrl;
    const isIphoneX = getApp().globalData.isIphoneX;
    this.setData({
      imgUrl: imgUrl,
      isIphoneX: isIphoneX,
      isOrder:that.options.isOrder || null
    })
    if (that.options.isOrder == "1") {
      com.sentHttpRequestToServer(
        '/userapi/address/index',
        {
          shop_id:that.options.shop_id ,
          user_id:app.globalData.userId
        },
        'GET',
        function (res) {
          if (!res.data.data) {
            that.setData({
              noData: true
            })
          }
          let items = res.data.data
          for (let i = 0; i < items.length; i++) {
            if (items[i].sex == '男') {
              items[i].sex = '先生'
            } else {
              items[i].sex = '女士'
            }
            if (items[i].label == 1) {
              items[i].label = '家'
            } else if (items[i].label == 2) {
              items[i].label = '公司'
            } else {
              items[i].label = '学校'
            }
          }
          that.setData({
            items: items,
            isOk: true
          })
        },
        function (res) {
        }
      );

    }else{
      /*HTTP请求 */
    
      com.sentHttpRequestToServer(
        '/userapi/address/indexList.html',
        {
          //id:1,
        },
        'GET',
        function (res) {
          if (!res.data.data) {
            that.setData({
              noData: true
            })
          }
          let items = res.data.data
          for (let i = 0; i < items.length; i++) {
            if (items[i].sex == '男') {
              items[i].sex = '先生'
            } else {
              items[i].sex = '女士'
            }
            if (items[i].label == 1) {
              items[i].label = '家'
            } else if (items[i].label == 2) {
              items[i].label = '公司'
            } else {
              items[i].label = '学校'
            }
          }
          that.setData({
            items: items,
            isOk: true
          })
        },
        function (res) {
        }
      );
    }
  },
  overScope(){
    wx.showToast({
      title: '超出配送范围',
      icon:'none'
    })
  },
  //点击切换默认收货地址
  toggleBtn(event) {
    let that=this;
    let canSelect = event.currentTarget.dataset.canselect;
      if (that.options.isOrder == "1") {
        if (canSelect){
          wx.request({
            url: app.globalData.url + '/userapi/user_cart/updateUser',
            data: {
              shop_id: that.options.shop_id,
              user_id: app.globalData.userId,
              address_id: event.currentTarget.dataset.id
            },
            method: "POST",
            success: function (res) {
              if (res.data.status.code == 200) {
                wx.navigateBack({
                  url: '\/pages/Confirmation_order/index',
                })
              }
            },
            fail: function (err) {

            }
          })
        }
      } else {
        let indexid = event.currentTarget.dataset.index;
        let defaultid = that.data.isdefault;
        let items=that.data.items
        let defaultup = event.currentTarget.dataset.id
        if(items[indexid].isdefault==1) return;
        com.sentHttpRequestToServer(
          '/userapi/address/set_to_default',
          {
            id: defaultup,
          },
          'POST',
          function (res) {
            if (res.statusCode == 200) {
              items.forEach(function(item,index){
                item.isdefault=0
              })
              items[indexid].isdefault=1
              that.setData({
                items:items
              })
            } else {
              wx.showToast({
                title: '修改失败!',
                icon: 'none'
              })
            }
          },
          function (res) {
          }
        );
      }
    
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    let that =this;
      //开始触摸时 重置所有删除
      this.data.items.forEach(function (v, i) {
        if (v.isTouchMove)//只操作为true的
          v.isTouchMove = false;
      })
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        items: this.data.items
      })
  },
  
  //滑动事件处理
  touchmove: function (e) {
    var that = this;
    
    if(that.options.isOrder !== '1'){
      var index = e.currentTarget.dataset.index,//当前索引
        startX = that.data.startX,//开始X坐标
        startY = that.data.startY,//开始Y坐标
        touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
        touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
        //获取滑动角度
        angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      that.data.items.forEach(function (v, i) {
        v.isTouchMove = false
        //滑动超过30度角 return
        if (Math.abs(angle) > 30) return;
        if (i == index) {
          if (touchMoveX > startX) //右滑
            v.isTouchMove = false
          else //左滑
            v.isTouchMove = true
        }
      })
      //更新数据
      that.setData({
        items: that.data.items
      })
    }
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    let id=e.currentTarget.dataset.id
    this.setData({
      items: this.data.items
    })
    com.sentHttpRequestToServer(
      '/userapi/address/setStatus.html',
      {
        id:id,
        status:"del"
      },
      'POST',
      function (res) {
      },
      function(res){
      }
    );    
  },
  edit_btn(e){
    let addressId = e.currentTarget.dataset.addressid
    wx.navigateTo({
      url: '/Run_leg/change_address/change_address?id=' + addressId,
    })
  }
})