// My/balance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition:true,//获取验证码/倒计时
    reciprocal:60,//倒计时
    success:true,//隐藏完成链接按钮
    err:false,//默认显示无连接按钮
    true_num:1425,//验证正确号码
    user_input:''//用户输入的验证号码
  },
  // 点击获取按钮变成倒计时
  get_num(){
    let that=this;
    that.setData({
      condition:false
    })
    let settime=setInterval(function(){//倒计时
      let time=that.data.reciprocal
      if(time!=0){
        time = time - 1;
        that.setData({
          reciprocal: time
        }) 
      }else{//清除定时器
        clearInterval(settime)
        that.setData({
          condition: true,
          reciprocal: 60
        })
      }
    }, 1000);
  },
  // 监听用户输入的长度
  userinput(even){
    let lenght = even.detail.cursor;
    this.setData({
      user_input:even.detail.value
    })
    if(lenght>0){
      this.passed(1)
    }else{
      this.passed(2)
    }
    
  },
  // 验证显示按钮还是隐藏按钮
  passed(data){
    if(data==1){
      this.setData({
        success: false,
        err: true
      })
    }else{
      this.setData({
        success: true,
        err: false
      })
    }
   
  },
  //验证用户输入的验证码
  tapurl(){
    let that=this;
    if(that.data.user_input ==that.data.true_num){

      wx.navigateTo({
        url: '/My/balance/index',
      })
    }else{
      wx.showToast({
        title: '验证码输入错误！',
        image:'/image/banla_close.png'
      })
    }
  },
  text(){
   
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
