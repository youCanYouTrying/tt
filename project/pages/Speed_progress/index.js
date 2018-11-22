var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:1,
    list:[],
    _show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
    order_id:options.order_id
    })
    this.initializationData()
  },
  initializationData(){
    let that=this
    com.sentHttpRequestToServer(
      '/userapi/order/order_info',
      {
        id:this.data.order_id,
      },
      'GET',
      function (res) {
        let listAll=[]//筛选出退款数组
        let flag1=false
        let showtext=''//标题
        res.data.data.order_logs.forEach(function(item,index){
          //筛选出属于退款的信息
          let flag=that.hasSta(item.status)
          if(flag){
            listAll.unshift(item)
            if(item.status==13){//有用户申请退款状态
              flag1=true
            }
          }
        })
        //有成功状态
        let flag3=that.has18(listAll)
        if(flag3){
          showtext="退款成功"
        }
        try{
          showtext="退款中，"+listAll[0].status_text
        }catch(err){
          showtext="暂无退款信息"
        }
        let otherReson=res.data.data.apply_refund.other_reason ||'无'
        //取退款原因
        let reson=flag1?(res.data.data.apply_refund.reason+"，其他原因："+otherReson):"没有原因哦"       
        
        that.setData({
          items:res.data.data,
          showtext:showtext,
          list:listAll,
          reson:reson,
          flag3:flag3//退款是否成功         
        })
      },
      function (res) {
        
      }
    );
  },
  //显示更多
  showMore(){
    this.setData({
      _show:true
    })
    console.log('ssss')
  },
  //收起
  hideMore(){
    this.setData({
      _show:false
    })
  },
  hasSta(sta){
    switch(sta){
      case 13:
        return true
        break;
      case 16:
        return true
        break;
      case 17:
        return true
        break;
      case 18:
        return true
        break;
      case 19:      
        return true
        break;
      default:
        return false      
    }
  },
  has18(arr){//退款是否成功
    arr.forEach(function(item,index){
      if(item.status==18){
        return true
      }
      return false
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