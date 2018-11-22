var app = getApp();
var com = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jake:1,
    order_id:1,
    imggeShow:false,
    dates: [
      { "data_name": "衣着整齐", "state": 0 },
      { "data_name": "长得帅", "state": 0 },
      { "data_name": "非常礼貌", "state": 0 },
      { "data_name": "声音好听",  "state": 0 },
      { "data_name": "态度很好", "state": 0 },
      { "data_name": "配送很准时", "state": 0 },
      { "data_name": "速度很快", "state": 0 }
     ],
    star: 0,
    showView: true,
    starMap: [
      '非常差',
      '差',
      '一般',
      '好',
      '非常好',
    ],
    tempFilePaths: ''  ,
    color:'',
    image1:'../../image/Satisfied_click.png',
    image2:'../../image/not_Satisfied.png',
    border1:'1px solid #fc656f',
    colors1:'#fc656f',
    border2:'',
    colors2:'',
    nomal:''
  },
  menuClick:function(e){
    this.setData({
      nomal: 'nomal'
    })
  },
  //骑手评论
  select_date: function (e) {    
     var index = e.currentTarget.dataset.key;
     let  rider_comment=this.data.dates[index].data_name
     //console.log(this.data.dates[index]);
     if (this.data.dates[index].state == 1) {
       this.data.dates[index].state = 0;
      
    } else if (this.data.dates[index].state == 0) {
       this.data.dates[index].state = 1;      
    }
     this.setData({
        dates: this.data.dates,
        rider_comment:rider_comment
      });
    
  },
  submiss1:function(){
    this.setData({
      image1: '../../image/Satisfied_click.png',
      image2: '../../image/not_Satisfied.png',
      border1: '1px solid #fc656f',
      colors1: '#fc656f',
      border2: '',
      colors2: '',
      jake:1
    })
  },
  submiss2: function () {
    this.setData({
      image1: '../../image/Satisfied.png',
      image2: '../../image/not_Satisfied_click.png',
      border1: '',
      colors1: '',
      border2: '1px solid #fc656f',
      colors2: '#fc656f',
      jake:0
    })
  },
  //星星数
  myStarChoose(e) {
    console.log(e)
    let star = parseInt(e.target.dataset.star) || 0;
    console.log('sssssssss',star)
    this.setData({
      star: star,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('拿到的order——id',options.order_id)
    this.setData({
    order_id:options.order_id
    })
    const imgUrl= getApp().globalData.imgUrl;
    const isIphoneX= getApp().globalData.isIphoneX;
    this.setData({
      imgUrl:imgUrl,
      isIphoneX:isIphoneX
    })
    this.initialization()
  },
  //初始化数据
  initialization(){
    let that=this
    com.sentHttpRequestToServer(
      '/userapi/order/order_info',
      {
        id:that.data.order_id,
      },
      'GET',
      function (res) {
       	console.log(res.data.data)
         let goods_list=res.data.data.order_model.order_goods
         let name_arr=[]
         console.log('订单商品列表：',goods_list)
         for(let i in goods_list){           
           let name=goods_list[i].goods.goods_name
           name_arr.push(name)
         }
         console.log('商品名：',name_arr)
         that.setData({
           items:res.data.data,
           name_arr:name_arr
         })
      },
      function(res){
        console.log(res)
      }
    );
  },
  chooseimage: function() {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          imggeShow:true,
          tempFilePaths: res.tempFilePaths,
          color:'#fff'
        })
        wx.uploadFile({//上传
          url: app.globalData.url+'api/Aliupload/upLoad', 
          filePath: res.tempFilePaths[0],//临时路径
          name: 'file',//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          formData: {//额外数据
            'user':'test'
          },
          success: function (res) {
            var data = res.data
            var obj=JSON.parse(data)
            _this.setData({
              imgurl:obj.data.filename
            })
          }
        })
      }
    })
  },
  //商家评论内容
  user_input(e){
    this.setData({
      shop_comment:e.detail.value
    })
  },
  //骑手评论数组
  addContent(){
    let comment=[]
    this.data.dates.forEach(function(item,index){
      if(item.state==1){
        comment.push(item.data_name)
      }
    })
    return comment;
  },
  //提交数据
  submiss(){
    let uid=this.data.items.user.id
    let sid=this.data.items.shop.id
    let num=this.data.star
    let shop_comment=this.data.shop_comment ||""
    let rider_id=this.data.items.rider.id
    // let rider_text=this.data.rider_comment ||""
    let rider_text=this.addContent()||""
    let jake=this.data.jake
    let imgurl=this.data.imgurl ||""
    let order_comment =`{"uid":"${uid}","sid":"${sid}","num":"${num}","content":"${shop_comment}","imgurl":"${imgurl}","is_anonymous":"0"}`
    let rider_comment =`{"rider_id":"${rider_id}","shop_id":"${sid}","content":"${rider_text}","jake":"${jake}","stars":"${num}","img":"${imgurl}"}`
    com.sentHttpRequestToServer(
      '/userapi/order/comment_shop_and_rider',
      {
        order_comment:order_comment,
        rider_comment:rider_comment,
        id:this.data.order_id
      },
      'POST',
      function (res) {
        if (res.data.status.code==200){
          wx.showToast({
            title: '评论成功',
          })
          setTimeout(function(){
            wx.switchTab ({
              url: '/pages/Order/index',
            })
          },1500)
        }else{
          wx.showToast({
            icon:'none',
            title: res.data.status.message,
          })
        }
      },
      function(res){
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (){
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (){
    
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