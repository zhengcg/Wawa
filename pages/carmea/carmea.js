var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var imgSrc = app.globalData.imgSrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    imgs:"",
    jz_id:'',
    mid:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   var self=this;
    this.setData({
      imgs: options.imgs,
      jz_id: options.jz_id,
      mid: options.mid
    })
    wx.showModal({
      title: '温馨提示',
      content: '为更加准确的识别化验单数据，请将化验单摆放在光线明亮且平整的地方，同时将手机摄像头与化验单尽可能保持垂直的角度进行拍照',
      showCancel: false,
      success: function (res) {
        self.ctx = wx.createCameraContext()
      }
    })
    
  },
  takePhoto() {
    var _this=this;
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.redirectTo({
          url: '../distinguish/distinguish?imgs=' + (_this.data.imgs).toString() + '&jz_id=' + _this.data.jz_id + '&filePath=' + res.tempImagePath + '&mid=' + _this.data.mid
        })
     
      }
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