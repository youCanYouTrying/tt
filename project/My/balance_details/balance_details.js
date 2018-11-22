var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    SwiperIndex:0,
    winHeight:'',
    balance_all:[],
    income_arr:[],
    out_arr:[],
    balance_arr:[{
      id:1,
      balance_name:'充值',
      balance_time:'2018-07-04 09:42:21',
      balance_money: '+12',
    },{
      id:2,
      balance_name:'提现',
      balance_time:'2018-07-04 09:42:21',
      balance_money: '-10.00',
    },
    {
      id:3,
      balance_name:'延时违约金',
      balance_time:'2018-07-04 09:42:21',
      balance_money: '+17.20',
    }],


    income: [{
      id:1,
      balance_name: '充值',
      balance_time: '2018-07-04 09:42:21',
      balance_money: '+12',
    },{
      id:3,
      balance_name:'延时违约金',
      balance_time:'2018-07-04 09:42:21',
      balance_money: '+17.20',
    }],
    balance_out:[{
      id:2,
      balance_name:'提现',
      balance_time:'2018-07-04 09:42:21',
      balance_money: '-10.00',
    }]
  },
  // 手动切换
  tabchange(e){
    let that =this;
    let index = e.target.dataset.tap;
    that.setData({
      SwiperIndex: index
    })
  },
  /** 
   * 列表区域滑动 
   */
  onSwiper: function (e) {
    let that=this;
    let currentTab = e.detail.current;
    that.setData({
      currentTab: currentTab
    })
  },
  // 跳转到收入详细
  choose_url1(event){
    console.log("111111111111")
    let index = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/My/Detailed_income/Detailed_income?id='+index,
    })
  },
  // 跳转到支出详细
  choose_url2(event) {
    let index = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/My/Expenditure_details/Expenditure_details?id=' + index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
    wx.getSystemInfo({//获取屏幕高度
      success: function (res) {
        that.setData({ winHeight: res.windowHeight })
      }
    }),
    com.sentHttpRequestToServer(
      '/userapi/user/userPayLog.html',
      {
        //id:1,
      },
      'GET',
      function (res) {
       	console.log(res.data.data)
        let balance_all=res.data.data;
        let  income_arr=[];
        let out_arr=[];
        let icome=[]
        for(let i=0;i<balance_all.length;i++){
          if(balance_all[i].money>0) {
            income_arr.push(balance_all[i])
          }else{
            out_arr.push(balance_all[i])
          }
           
         }
        // console.log("收入："+income_arr)
        // console.log("支出："+out_arr)
        console.log(income_arr)
        console.log(out_arr)
        that.setData({
          balance_all:balance_all,
          income_arr:income_arr,
          out_arr:out_arr
        })
      },
      function(res){
        console.log(res)
      }
    );
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