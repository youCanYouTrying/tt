// My/balance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '25.00',
    input_vlue:'',
    switch_btn:true,
    bankCard:[{
      icon_url:'/image/banla_gs.png',
      bankName:'工商银行卡',
      bankNumber:5625,
      isdefault:true
    }, {
        icon_url: '/image/Satisfied_click.png',
        bankName: '三峡银行卡',
        bankNumber: 8658,
        isdefault: false
      }]
  },

  //全部提现
  allWithdrawals(){
    const data=this.data.balance;
    this.setData({
      input_vlue: data
    })
  },
  //选取银行卡按钮
  choose_card(){
    const that=this;
    that.setData({
      switch_btn:false
    })
  },
  //选取提现的银行卡
  chooseDefault(e){
    const that=this;
    let index = e.currentTarget.id;
    let list = that.data.bankCard;
    let allStr = '';
    let allnum='';
    for(let i = 0; i<list.length; i++){
      list[i].isdefault = false;
    }
    list[index].isdefault = true;
    allStr = list[index].bankName;
    allnum = list[index].bankNumber;
    that.setData({
      bankCard:list,
      allStr: allStr,
      allnum: allnum
    })
  },
  close_choose(){
    const that = this;
    that.setData({
      switch_btn: true
    })
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
    let that=this;
    let list = that.data.bankCard;
    let initial='';
    for(let i=0;i<list.length;i++){
      if (list[i].isdefault){
        initial=i;
      }
    }
    let data=list[initial].bankName;
    let data2 = list[initial].bankNumber;
    that.setData({
      allStr: data,
      allnum: data2
    })
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