// Run_leg/redPacket/redPacket.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    show: true,
    radio:
      [
        {
          id: 1,
          name: "公司",
          checked: true
        },
        {
          id: 2,
          name: "个人"
        }
      ],
    items: [
      {
        name: '八达面场馆受到法律空档就发附件啊；',
        id: 1,
        "biaoji": "红包",
        "time": "2018-07-12",
        minusprice: 33,
        'img': app.globalData.imgUrl + 'VCG21gic19571800.jpg',
        "baozhaung": 24,
        "allprice": 72,
        "falses": true,
        "youhui": "",
        "yu": "接受预订中"
      }
    ],
    item: [
      {
        name: '八达面场馆受到法律空档就发附件啊；',
        id: 1,
        "biaoji": "红包",
        "time": "2018-07-12",
        minusprice: 33,
        img: app.globalData.imgUrl +'VCG21gic19571800.jpg',
        "baozhaung": 24,
        "allprice": 72,
        "falses": true,
        "yu": "接受预订中"
      }
    ],
    currentTabId: "table1",
    currentTabSwiperIndex: 0,
    scrollLeft: 0,
    winHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
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
  
  }
})