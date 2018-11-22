var app = getApp()
var that = null;
Page({
  data: {
    topTable: [{
        id: "table1",
        name: "文字介绍"
      },
      {
        id: "table2",
        name: "信息填写"
      },
      {
        id: "table3",
        name: "资费查询"
      },
      {
        id: "table4",
        name: "商家入驻"
      }
    ],
    currentTabId: "table1",
    currentTabSwiperIndex: 0,
    scrollLeft: 0,
    winHeight: 0,
    smName:app.globalData.smName
  },
  onLoad: function(options) {
    that = this;
    const imgUrl = getApp().globalData.imgUrl;
    const isIphoneX = getApp().globalData.isIphoneX;
    this.setData({
      imgUrl: imgUrl,
      smName: app.globalData.smName,
      isIphoneX: isIphoneX
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight
        })
      }
    })
    console.log(that.data.winHeight)
  },
  /** 
   * 顶部TAB点击 
   */
  tableTap: function(e) {
    that.setData({
      currentTabId: e.target.id,
      currentTabSwiperIndex: e.target.dataset.index
    });
    //that.getInfoList(e.target.dataset.index,0);  
  },
  /** 
   * 列表区域滑动 
   */
  onSwiper: function(e) {
    var currentIndex = e.detail.current;
    that.setData({
      currentTabId: that.data.topTable[currentIndex].id
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
  }
})