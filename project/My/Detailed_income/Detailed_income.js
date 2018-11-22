// My/balance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    transaction_hour:'',
    Single_number:'',
    Remarks:'',
    getid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取到点击是哪个id的信息
    let that = this;
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
    })
    let id = options.id;
    console.log("得到的："+id)
    wx.request({
      url: 'http://192.168.1.219/userapi/user/userPayLogCon.html',
      method:'GET',
      data:{
        id:id
      },
      success:function(res){
        //console.log('fff')
        console.log(res.data.data)
        that.setData({
          transaction_hour:res.data.data.add_time,
          Single_number:res.data.data.order_num,
          Remarks:res.data.data.type,
          money:res.data.data.money
        })
      },
      fail:function(){
        wx.showToast({
          title: '服务器忙，请稍后再试',
          icon:'loading'
        })
      }
    })
    that.setData({
      getid: id
    })
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