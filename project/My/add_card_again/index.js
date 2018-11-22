// My/add_card_again/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_name:'张某某',
    isinput:false,
    input_num:'',
    ispass:false,
    notice:'请输入本人银行卡'
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
  // 输入监听
  isvalue(event) {
    let that=this;
    that.setData({
      input_num:event.detail.value
    })
    if (event.detail.cursor>0) {
      if (event.detail.cursor>16){
        that.setData({
          isinput: true
        })
      }else{
        that.setData({
          isinput:false
        })
      }
      that.setData({
        ispass: true
      })
    } else {
      that.setData({
        ispass: false
      })
    }
  },
  test_input(){
    this.setData({
      notice:'银行卡号长度必须是16-19位！'
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