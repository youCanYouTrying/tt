var app = getApp();
var com = require("../../common.js");
Page({
  data: {
    isHideLoadMore:false,
    isOk: false,
    noData:false,
    finishLoad:false,//完成加载
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    page: 1,
    curIndex: 0,
    curText: null,
    scrollLength: 0,
    currentTabId: "01",
    winHeight: 0,
    uhide: 0
  },
  onLoad: function() {
    var that = this;
    that.initData(0),
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            winHeight: res.windowHeight
          })
        }
      });
    const imgUrl = getApp().globalData.imgUrl;
    this.setData({
      imgUrl: imgUrl
    })
    that.initialization()
    
  },
  /*初始化数据*/
  initData: function(index) {
    var that = this
    that.setData({
      curIndex: index,
     
    })
  },
  //tab点击事件，刷新数据
  reflashData: function(event) {
    var that = this

    var index = event.currentTarget.dataset.index
    //移动滚动条,//200和35是我估算的
    if (index > that.data.curIndex) {
      if (that.data.scrollLength < 200) {
        that.setData({
          scrollLength: that.data.scrollLength + 35 * (index - that.data.curIndex)
        })
      }
    } else {
      if (that.data.scrollLength > 0) {
        that.setData({
          scrollLength: that.data.scrollLength - 35 * (that.data.curIndex - index)

        })
      }
    }
    //移动view位置，改变选中颜色
    that.initData(index)


  },

  /*点击切换隐藏和显示*/
  toggleBtn: function(event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    var index = event.currentTarget.dataset.index    
    var items = that.data.items;
    items[index].isShow = !items[index].isShow
    for (let i in items) { //其他关闭
      if (i != index) {
        items[i].isShow = false
      }
    }
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: itemId
      })
    }
    that.setData({
      items: items
    })
  },

  /*手指触摸动作开始 记录起点X坐标*/
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

  /*滑动事件处理*/
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
  initialization(nowPage){    
    let that=this   
    wx.request({
      url: app.globalData.url + '/userapi/user_track/index',
      method: 'GET',
      data: {
        user_id:app.globalData.userId,
        page:nowPage || 0
      },
      success: function(res) {
        let showArr = []
        let itemShow = that.data.items
        let items = res.data.data.data
        if(!items){
          that.setData({
            noData:true            
          })
        }
        items.forEach(function(items, indexs, arr) {
          let showArr = []//放一个空盒子给每一个item
          items.isShow = false//加一个字段用于图标上下切换
          items.trackable.shop_activity ? showArr= com.youhuiType(items.trackable.shop_activity) : null;
          items.showArr = showArr;      
        })
        for (let i = 0; i < items.length; i++) {
          itemShow.push(items[i])
        }
        that.setData({
          items: itemShow,
          finishLoad:true,
          page:res.data.data.current_page,
          isOk: true,
          last_page: res.data.data.last_page,
          isHideLoadMore:false
        })        
      }
    })
  },
  //删除事件
  del: function(e) {
    let id = e.currentTarget.dataset.id
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
    com.sentHttpRequestToServer(
      '/userapi/Track/setStatus.html', {
        id: id,
        status: 'del'
      },
      'POST',
      function(res) {
        console.log(res)
      },
      function(res) {
        console.log(res)
      }
    );
  },
  //点击到店铺去
  goShop(event) {
    let shopid = event.currentTarget.dataset.shopid
    wx.navigateTo({
      url: '/home/business/index?id=' + shopid,
    })
  },
  //加载更多
  loadMore() {
    let nowPage = this.data.page+1
    let last_page = this.data.last_page
    thi.setData({
      isHideLoadMore:true
    })
    if (nowPage < last_page) {      
      this.initialization(nowPage)
    }
  }
})