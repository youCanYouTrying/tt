var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data:{
    order_id:null,
    clickItem:'',
    allShow: false,
    showModal:false,
    imggeShow: false,
    showAllMoney:0,
    has_distribution_fee:false,//总价是否包含配送费
    imgurl:'',//线上图片地址
    total:0.00,
    tabs: ["你没货了", "地址不正确", "你没货了", "太难吃了", "不想要了"],
    clickId:-1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgUrl= getApp().globalData.imgUrl;
    const isIphoneX= getApp().globalData.isIphoneX;
    this.setData({
      imgUrl:imgUrl,
      order_id:options.order_id,
      isIphoneX:isIphoneX
    })
    this.initializationData()
  },
  /**
   * 数据初始化
   */
  initializationData(){
    let that=this
    //初始化退款商品
    com.sentHttpRequestToServer(
      '/userapi/refund/init',
      {
        order_model_id:that.data.order_id,
      },
      'GET',
      function (res) {      
       that.setData({
          showAllMoney:res.data.data.refund_money,
          goodslist:res.data.data.can_order_goods
        })
      },
      function(res){
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
      }
    );
  },
  //选择退款商品
  rufund:function(e){
    let _this=this
    let selected= e.currentTarget.id;
    let goodsid=e.currentTarget.dataset.goodsid
    let chanNum=e.currentTarget.dataset.channum*1
    if(selected==0){//all+单价*数量+单个餐盒费*数量
      com.sentHttpRequestToServer(//HTTP获取商品
      '/userapi/refund/select',
      {
        order_model_id:_this.data.order_id,
        order_goods_id:goodsid,
        num:chanNum
      },
      'GET',
      function (res) {       
        _this.setData({
          showAllMoney:res.data.data.refund_money,
          goodslist:res.data.data.can_order_goods
        })
      },
      function(res){
        console.log(res)
      }
    );
    }else{
     com.sentHttpRequestToServer(//HTTP获取商品
      '/userapi/refund/unselect',
      {
        order_model_id:_this.data.order_id,
        order_goods_id:goodsid
      },
      'GET',
      function (res) {
        _this.setData({
          showAllMoney:res.data.data.refund_money,
          goodslist:res.data.data.can_order_goods
        })
      },
      function(res){
        console.log(res)
      }
    );
    }
  },
  //减少退款数量
  jian_num(e){
    let that=this
    let goodsid=e.currentTarget.dataset.goodsid
    let channum=e.currentTarget.dataset.channum*1  
    if(channum>1){
      com.sentHttpRequestToServer(//HTTP获取商品
      '/userapi/refund/reduce',
      {
        order_model_id: that.data.order_id,
        order_goods_id:goodsid
      },
      'GET',
      function (res) {      
        that.setData({
           showAllMoney:res.data.data.refund_money,
          goodslist:res.data.data.can_order_goods
        })
      },
      function(res){
        console.log(res)
      }
    );
    }  
  },
  //增加退款数量
  jia_num(e){
    let that=this
    let goodsid=e.currentTarget.dataset.goodsid
    let channum=e.currentTarget.dataset.channum*1
    let allNum=e.currentTarget.dataset.num*1
    if(channum<allNum){
      com.sentHttpRequestToServer(//HTTP获取商品
      '/userapi/refund/add',
      {
        order_model_id:that.data.order_id,
        order_goods_id:goodsid
      },
      'GET',
      function (res) {        
        that.setData({
           showAllMoney:res.data.data.refund_money,
          goodslist:res.data.data.can_order_goods
        })
      },
      function(res){
        console.log(res)
      }
    );
    } 
  },
  click:function (e) {
    var ids = e.currentTarget.dataset.id;  //获取自定义的id     
    this.setData({
      id: ids  //把获取的自定义id赋给当前组件的id(即获取当前组件)    
    })
  }  ,
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false
    })
  },
  //选择退款原因
  select:function(e){
    let clickItem = e.currentTarget.id;
    console.log(clickItem)
    this.setData({
      showModal: false,
      clickItem: clickItem
    })
  },
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          imggeShow: true,
          tempFilePaths: res.tempFilePaths,
          color: '#fff'
        })
        console.log('本地图片地址：',res.tempFilePaths)
        wx.uploadFile({//上传
          url: app.globalData.url+'api/Aliupload/upLoad', 
          filePath: res.tempFilePaths[0],//临时路径
          name: 'file',//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          formData: {//额外数据
            'user':'test'
          },
          success: function (res) {
            var data = res.data
            console.log(data)
            var obj=JSON.parse(data)
           console.log('上传完成后',obj.data.filename)
            _this.setData({
              imgurl:obj.data.filename
            })
          }
        })
      }
    })
  },
  /*显示更多*/
  lookmore(){
    this.setData({
      allShow:true
    })
  },
  /*折叠收起*/
  foldList(){
    this.setData({
      allShow:false
    })
  },
  /*获取订单详细*/
  senGoods(){
      let that=this;
      com.sentHttpRequestToServer(//HTTP获取商品
      '/userapi/order/order_info',
      {
        id:that.data.order_id
      },
      'GET',
      function (res) {
        that.setData({
          goods:res.data.data.order_model.order_goods,
          distribution_fee:res.data.data.order_model.distribution_fee
        })
        //改变数据结构
        that.changegoods(res.data.data.order_model.order_goods,res.data.data.can_refund_goods);
      },
      function(res){
        console.log(res)
      }
    );
    },
  /**改变数据结构 */
  changegoods(goods,can_goods){
    let goods_list=[]
    let list=goods
    let can_refund_goods=can_goods
    for(let i in list){
      goods_list.push({
        id:list[i].id,
        order_goods_id:list[i].goods_id,
        name:list[i].goods.goods_name,
        price:parseFloat(list[i].sale)*1,
        num:list[i].num*1,
        all_num:list[i].num*1,
        one_box_pirce:list[i].goods.lunch_box_price*1,
        seleced:true
      })
    }
    if(can_refund_goods.length==0){
      for(let i in list){
       goods_list[i].chanNum=list[i].num*1
      }
    }else{
      for(let i in can_refund_goods){
      goods_list[i].chanNum=can_refund_goods[i].total*1
      }
    }
    this.setData({
      goodslist:goods_list
    })
    console.log('gaihou',goods_list)
  },
  /**
   * 提交申请
   */
  submit_all(){
    let that=this
    let list=this.data.goodslist
    let reason=this.data.clickItem//原因
    let main_id=this.data.order_id//订单id
    let other_reason=this.data.other_reason ||''//其他原因
    let selected_goods=[]//退款物品
    for(let i in list){
      if(list[i].seleced){
        selected_goods.push({
          'goods_id': list[i].order_goods_id  ,
          'order_goods_id':list[i].id ,
          "num":list[i].num
        })        
      }
    }  
     selected_goods=JSON.stringify(selected_goods)    
    com.sentHttpRequestToServer(
      '/userapi/order/apply_back_money_for_order',
      {
        id:main_id,
        imgurl:that.data.imgurl,
        reason:reason,
        other_reason:other_reason,
        // selected_goods:[{'id':1,'num':2,'order_goods_id':1}]
        selected_goods:selected_goods,
      },
       'POST',
      function(res){
        console.log('元素胡',res.data)
        console.log(res.data.status.message)
        wx.showToast({
          title:res.data.status.message,
          icon:'none',
          duration:2000,
          success:function(){
            
          }
        })
        console.log(res.data.status.code)
        if (res.data.status.code==200){
          that.navgetto()
        }
      },
      function(){
        console.log(res)
      }
    )
    console.log('提交的数组：', selected_goods)
  },
  navgetto(){
    setTimeout(function(){
      wx.reLaunch({
      url: '/pages/Order/index',
      success:function(res){
      },
      fail(res){
        console.log('失败',res)
      }
    })
    },2000)
    
  },
  /**
   * 选填退款原因
   */
  other_reason(e){    
    this.setData({
      other_reason:e.detail.value
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