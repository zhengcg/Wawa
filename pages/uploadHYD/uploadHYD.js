var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var imgSrc = app.globalData.imgSrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jz_id: '',
    mid: '',
    imgs: []


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      jz_id: options.jz_id
    })
    if(options.imgs){
      this.setData({
        imgs: options.imgs == "" ? [] : options.imgs.split(",")
      })
    }
    this.checkToken()

  },
  checkToken: function () {
    var self = this;
    if (wx.getStorageSync('token')) {
      this.getJz(self.data.jz_id);
      // 添加就诊（一进来先掉一次，然后实际添加数据调用修改接口）


    } else {
      wx.showModal({
        title: '提示',
        content: '登录过期了，请重新登录！',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }
  },
  previewImg: function (e) {
    var self=this;
    var index=e.currentTarget.dataset.index;

    wx.previewImage({
      current: self.data.imgs[index], // 当前显示图片的http链接
      urls: self.data.imgs // 需要预览的图片http链接列表
    })

  },
  getJz: function (id) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Coreout/getJzDetail",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), jz_id: parseInt(id) },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            "mid": res.data.data.m_id
          })

        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        }  else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })

        }
      },
      fail: function () {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        wx.showToast({
          title: '接口调用失败！',
          icon: 'fail',
          duration: 2000
        })
      }
    })

  },
  chooseImg: function () {
    var _this = this;
    wx.redirectTo({
      url: '../carmea/carmea?imgs=' + (_this.data.imgs).toString() + '&jz_id=' + _this.data.jz_id+'&mid='+_this.data.mid
    })
  },
  removeImg: function (e) {
    var self = this;
    self.data.imgs.splice(e.target.dataset.index, 1)
    self.setData({
      imgs: self.data.imgs
    })

  },
  submitBtn: function () {
    var _this = this;
    // try {
    //   wx.showLoading()
    // }
    // catch (err) {
    //   console.log("当前微信版本不支持")
    // }
    // wx.request({
    //   url: api + "Corein/saveJzHy",
    //   method: 'POST',
    //   header: header,
    //   data: { session_3rd: wx.getStorageSync('token'), jz_id: parseInt(_this.data.jz_id), m_id: parseInt(_this.data.mid), imgs: (_this.data.imgs).toString() },
    //   success: function (res) {
    //     try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
    //     if (res.data.code == 200) {
    //       wx.showToast({
    //         title: '保存成功',
    //         icon: 'success',
    //         duration: 2000,
    //         success: function () {
    //           wx.navigateTo({
    //             url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
    //           })

    //         }

    //       })


    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'fail',
    //         duration: 2000
    //       })

    //     }
    //   },
    //   fail: function () {
    //     try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
    //     wx.showToast({
    //       title: '接口调用失败！',
    //       icon: 'fail',
    //       duration: 2000
    //     })
    //   }
    // })
    if(this.data.imgs.length>0){
      wx.showModal({
        title: '提示',
        content: '文件已保存，请到健康档案中查询上传结果',
        showCancel: false,
        success:function(){
          wx.redirectTo({
            url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
          })
        }

      })

    }else{
      wx.showModal({
        title: '提示',
        content: '请先上传后在保存',
        showCancel: false,
       
      })
    }
   

  },
  goBack:function(){
    var _this=this;
    wx.redirectTo({
      url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
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