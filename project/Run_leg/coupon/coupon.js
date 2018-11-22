var app = getApp();
Page({
  data: {
    show: true,
    imgUrl: app.globalData.imgUrl,
    radio:
    [
      {
        id: 1,
        name: "公司",
        checked: true
      },
      {
        id: 2,
        name: "个人"
      }
    ],
    items: [
      {
        name: '八达面场馆受到法律空档就发附件啊；',
        id: 1,
        "biaoji": "红包",
        "time": "2018-07-12",
        minusprice: 33,
        'img': app.globalData.imgUrl+'VCG21gic19571800.jpg',
        "baozhaung": 24,
        "allprice": 72,
        "falses": true,
        "youhui": "",
        "yu": "接受预订中"
      }
    ],
    item: [
      {
        name: '八达面场馆受到法律空档就发附件啊；',
        id: 1,
        "biaoji": "红包",
        "time": "2018-07-12",
        minusprice: 33,
        img: '../../image/VCG21gic19571800.jpg',
        "baozhaung": 24,
        "allprice": 72,
        "falses": true,
        "yu": "接受预订中"
      }
    ],
    currentTabId: "table1",
    currentTabSwiperIndex: 0,
    scrollLeft: 0,
    winHeight: 0
  },
  onLoad(){
   
  }
})  