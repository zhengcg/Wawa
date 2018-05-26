var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var imgSrc = app.globalData.imgSrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    info:[],
    jbxx:{},
    imgs:[],
    jz_id:"",
    img:'',
    filePath:'',
    mid:''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgs: options.imgs == "" ? [] : options.imgs.split(","),
      jz_id: options.jz_id,
      filePath: options.filePath,
      mid: options.mid
    })
    this.checkToken()

  },
  changeName:function(e){
    this.data.jbxx.name=e.detail.value;
    this.setData({
      jbxx:this.data.jbxx
    })
    console.log(this.data.jbxx)

  },
  changeAge: function (e) {
    this.data.jbxx.age = e.detail.value;
    this.setData({
      jbxx: this.data.jbxx
    })

  },
  changeSex: function (e) {
    this.data.jbxx.sex = (e.detail.value=="男")?1:0;
    this.setData({
      jbxx: this.data.jbxx
    })

  },
  changeType: function (e) {
    this.data.jbxx.check_type = e.detail.value;
    this.setData({
      jbxx: this.data.jbxx
    })

  },
  uploadImg:function(){
    var self=this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.uploadFile({
      url: api + 'Corein/coreUpload',
      filePath: self.data.filePath,
      name: 'imgs',
      formData: {
        session_3rd: wx.getStorageSync('token')
      },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        var array = [imgSrc + JSON.parse(res.data).data.img_url];
        var img = imgSrc + JSON.parse(res.data).data.img_url;

        self.setData({
          imgs: self.data.imgs.concat(array)
        })
        self.sbHYD(img)
      }
    })

  },
  sbHYD: function (img) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Corein/saveJzHy",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), jz_id: parseInt(_this.data.jz_id), m_id: parseInt(_this.data.mid), imgs: img },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          wx.showToast({
            title: '识别成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              _this.setData({
                id: res.data.data
              })
              _this.getInfo(res.data.data);
              
         

            }

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

        } else {
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
  changeTitle:function(e){
    var index=parseInt(e.currentTarget.dataset.index);
    var val=e.detail.value;
    this.data.info[index].title=val
    this.setData({
      info:this.data.info
    })

  },
  changeTitleCn: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var val = e.detail.value;
    this.data.info[index].title_cn = val
    this.setData({
      info: this.data.info
    })

  },
  changeResult: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var val = e.detail.value;
    this.data.info[index].result = val
    this.setData({
      info: this.data.info
    })

  },
  changeRange: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var val = e.detail.value;
    this.data.info[index].range = val
    this.setData({
      info: this.data.info
    })

  },
  checkToken: function () {
    var self = this;
    if (wx.getStorageSync('token')) {
      this.uploadImg()
     
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

  getInfo: function (id) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Ai/readPic",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), id: parseInt(id) },
      // data: { session_3rd: wx.getStorageSync('token'), id: 61 },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            "info": res.data.data.data,
            "jbxx": res.data.data.data_info
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
  submit:function(){
      var _this = this;
      try {
        wx.showLoading()
      }
      catch (err) {
        console.log("当前微信版本不支持")
      }
      wx.request({
        url: api + "coreIn/saveJzHys",
        method: 'POST',
        header: header,
        data: { 
          session_3rd: wx.getStorageSync('token'),
           id: _this.data.id,
           data:JSON.stringify(_this.data.info),
           data_info: JSON.stringify(_this.data.jbxx)
           },
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '为确保数据分析准确，请您确认化验单用户与当前选定用户为同一人',
              showCancel: false,
              success: function (res) {
                wx.redirectTo({
                  url: '../uploadHYD/uploadHYD?imgs=' + _this.data.imgs.toString() + '&jz_id=' + _this.data.jz_id
                })
              }
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

          } else {
            
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