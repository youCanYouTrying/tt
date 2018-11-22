var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    smName:app.globalData.smName
  },
  shareSaa(){
    console.log('11111111')
     this.onShareAppMessage()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    const imgUrl= getApp().globalData.imgUrl;
    console.log('',imgUrl)
    _this.setData({
      imgUrl:imgUrl
    })
    if(app.globalData.userInfo){//获取用户头像和昵称
      _this.setData({
        avatarUrl:app.globalData.userInfo.avatarUrl,
        name:app.globalData.userInfo.nickName
      })
    }
    console.log('用户信息',app.globalData)
    if(app.globalData.userId==null ||app.globalData.userId==undefined ||app.globalData.userId==""){//判断用户是否登录
      _this.setData({
        notLogin:true
      })
    }
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
   onShareAppMessage: function (ops) {
   if (ops.from === 'button') {
     // 来自页面内转发按钮
     console.log(ops.target)
   }
   return {
     title: app.globalData.smName+'小程序',
     path: 'My/my/index',
     success: function (res) {
       // 转发成功
       console.log("转发成功:" + JSON.stringify(res));
     },
     fail: function (res) {
       // 转发失败
       console.log("转发失败:" + JSON.stringify(res));
     }
   }
   }

})