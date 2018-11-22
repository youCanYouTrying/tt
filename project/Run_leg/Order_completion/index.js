var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan:3,
    order_id:1,
    showModal: false,
    roter_flag:true,
    morenImg: app.globalData.imgUrl + "qishou.png"
  },
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    let that=this
    this.setData({
      smName: app.globalData.smName,
    order_id:this.options.order_id
    })
    const imgUrl= getApp().globalData.imgUrl;
    const isIphoneX= getApp().globalData.isIphoneX;
    this.setData({
      imgUrl:imgUrl,
      isIphoneX:isIphoneX
    })
    that.initialization();    
  },
  /**数据初始化 */
  initialization(){
    let that=this
    com.sentHttpRequestToServer(
      '/userapi/order/order_info',
      {
        id:that.data.order_id,
      },
      'GET',
      function (res) {
        if(res.data.data){
        console.log(res.data.data)
        let riderPhone     
        try{//没拿到骑手电话
          riderPhone=res.data.data.rider.phone
        }catch(error){         
          riderPhone=1111
        }
        that.setData({
          items:res.data.data,
          rider_phone: riderPhone,
          shop_phone:res.data.data.shop.contacts_phone,
          timeList: res.data.data.order_logs
        })
        }
      },
      function (res) {
        console.log(res)
      }
    );
  },
  /**

   * 弹窗

   */

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
   /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */

  preventTouchMove: function () {
  },
 


  /**

   * 对话框取消按钮点击事件

   */

  onCancel: function () {

    this.hideModal();

  },

  /**

   * 对话框确认按钮点击事件

   */

  onConfirm: function () {

    this.hideModal();

  },
  
  
  //跳转到申请退款
  gorefund(){
    this.setData({
      fromReceipt:0
    })
    wx.navigateTo({
      url: '/pages/Application/index?order_id='+this.data.order_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //跳转到评论
  gocomment(){
    this.setData({
      fromReceipt:0
    })
    wx.navigateTo({
      url: '/pages/Submission/index?order_id='+this.data.order_id,
    })
  },
  preventTouchMove: function () {

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
    this.setData({
      roter_flag:true
    })
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
    if(this.data.roter_flag){
      wx.switchTab({
        url: '/pages/Order/index',
      })
    }
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
  
  },
  /*滑动监听事件*/
  onPageScroll:function(e){
    //console.log(e)
  },
  call_order(event){
    let num=event.currentTarget.dataset.num
    if(num==1){
      wx.makePhoneCall({//骑手
        phoneNumber: this.data.rider_phone
      })
    }else if(num==2){//商家
      wx.makePhoneCall({
        phoneNumber: this.data.shop_phone
      })
    }
  },
})