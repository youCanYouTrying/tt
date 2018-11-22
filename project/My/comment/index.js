var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData:false,
    star:[],
    comments:[]
  },
  //删除事件
  del: function (e) {
    let that=this;
    let id=e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.index)
    that.data.comments.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      comments: this.data.comments
    })
    com.sentHttpRequestToServer(
        '/userapi/Take_Shop_About/setStatus.html',
        {
          id:id,
          status:'del'
        },
        'POST',
        function (res) {
          console.log('删除评论成功：',res)
        },
        function (res) {
          console.log(res)
        }
      );
    
  },
  goShop(event) {
    let shopid = event.currentTarget.dataset.shopid
    console.log('shopid', shopid)
    wx.navigateTo({
      url: '/home/business/index?id=' + shopid,
    })
  },
  share(){
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
    com.sentHttpRequestToServer(
      '/userapi/Take_Shop_About/indexList.html',
      { 
        //id:1,
        t:0
      },
      'GET',
      function (res) {
        let comments = res.data.data
        if(comments==null || comments==""){
          that.setData({
            noData:true
          })
        }
        if(comments){
          comments.forEach(function(item,index){
          item.time_num=parseInt(item.time_num)
          item.content=item.content?item.content:"暂无评论"
          item.revert=item.revert?item.revert:"暂无回复"
          })
        }
        console.log('请求数据',comments)
        that.setData({
          comments: comments
        })
        //let data=Object.assign(glod,d);
      },
      function (res) {
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