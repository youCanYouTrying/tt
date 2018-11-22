var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData: false,
    isOk: true,
    uhide: 1,
    items: [],
    xinlist: [
      "非常号",
      "很好",
      "一般",
      "差",
      "较差"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    const imgUrl = getApp().globalData.imgUrl;
    this.setData({
      imgUrl: imgUrl
    })
    com.sentHttpRequestToServer(
      '/userapi/collect/indexList.html', {
        id: app.globalData.userId,
      },
      'GET',
      function(res) {
        //console.log('aaaa', res)
        if (res.data.data == null || res.data.data == "") {
          that.setData({
            noData: true
          })
        }
        console.log(res.data.status.code)
        if (res.data.status.code == 500) {
          wx.showToast({
            title: '服务器忙！',
            icon: 'loading'
          })
        }
        let star_list = []
        let items = res.data.data
        for (let i in items) {
          star_list.push({
            "star": parseInt(items[i].shop_star)
          })
        }
        console.log(items)
        for (let i = 0; i < items.length; i++) {
          items[i].shop_star = Math.round(items[i].shop_star)
        }
        console.log('星星数组', star_list)
        that.setData({
          isOk: false,
          items: items,
          star_list: star_list
        })
      },
      function(res) {
        console.log(res)
      }
    );
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.items.forEach(function(v, i) {
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
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function(e) {
    let id = e.currentTarget.dataset.id
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
    com.sentHttpRequestToServer(
      'userapi/collect/setStatus.html', {
        id: id,
        status: 'del'
      },
      'POST',
      function(res) {
        console.log(res)
      },
      function(res) {

      }
    )
  }
})