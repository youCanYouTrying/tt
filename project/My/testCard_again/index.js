// My/balance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_num: '',
    ban_name: '根据银行卡号自动获取所属银行',
    isinput:false,//是否输入
    danger:'',//输入错误提示文字
    correct:false//验证正确
  },
  // 输入监听边验证
  isvalue(event) {
    const that = this;
    if (event.detail.cursor > 0) {
      let pre = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!pre.test(event.detail.value)){
        that.setData({
          danger:'手机号格式有误！',
          correct:false
        })
      }else{
        that.setData({
          danger: '输入正确！',
          correct:true
        })
      }
      that.setData({
        isinput: true
      })
    } else {
      that.setData({
        isinput: false
      })
    }
  },
  show(){
    wx.showToast({
      title: '手机号不能为空!',
      icon: 'none',
      image:'/image/banla_close.png'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    //卡后4位加空格显示
    let arr = options.value
    let arr2= arr.replace(/[0-9]{4}/g, function (i) { return i + " "})
    that.setData({
      card_num: arr2
    })
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