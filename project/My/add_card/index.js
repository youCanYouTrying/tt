// My/balance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ispass:true,
    userinput:'',
    issuccess:false,
    notification:'为了保证您的资金安全，请绑定本人的银行卡'
  },
  // 简单验证卡号，输入正确进入下一步
  filter_card(event){
    let that=this
    let input = event.detail.value
    let card = /^[0-9]{16,19}$/
    let test = card.test(input)
    if(event.detail.cursor>0){
      if(test){
        that.setData({
          issuccess: true,
          notification: '输入长度正确！'
        })
      }else{
        that.setData({
          issuccess: false,
          notification: '输入长度有误!'
        })
      }
      that.setData({
        ispass:false,
        userinput:input
      })
    }else{
      that.setData({
        ispass: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgUrl= getApp().globalData.imgUrl;
    this.setData({
      imgUrl:imgUrl
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