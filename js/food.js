 // 获取url上的参数
 function GetQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
     if (r != null) return r[2];
     return null;
 }
 var vm = new Vue({
     el: '#app',
     data: {
         host: 'http://bbssc.cloud.hoge.cn/',
         iconDetailList: [],
         CityDataList: [],
         videoData: {},
         h: undefined,
         topPic: [],
         flag: false,
         audioFlag: false,
         show: false,
         content: undefined,
         post_id: undefined,
         user_id: undefined,
         count: 3,
         page: 1,
         showTips: false,
         flagMore: true,
         hasLogin: undefined,
         access_token: undefined,
         storage: window.localStorage,
         documentTitle: decodeURIComponent(GetQueryString('title'))
     },
     filters: {
         getTimeData(dataTime) {
             var currentTime = new Date().getTime();
             let forwardTime;
             // var dataTime = parseInt(val.publish_time_stamp) * 1000;
             var seconds = parseInt((currentTime - dataTime * 1000) / 60000);
             if (seconds < 1) {
                 forwardTime = '1分钟前'
             } else if (seconds < 60 && seconds > 1) {
                 forwardTime = seconds + '分钟前'
             } else if (seconds > 60 && seconds < 1440) {
                 forwardTime = parseInt(seconds / 60) + '小时前'
             } else if (seconds > 1440) {
                 forwardTime = parseInt(seconds / 1440) + '天以前'
             }
             return forwardTime
         }
     },

     methods: {
         //获取url的参数
         GetQueryString(name) {
             var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
             var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
             if (r != null) return r[2];
             return null;
         },
         imgAdaptation(filename, w, h) {
             var reg = RegExp(/\{\$hgPicSizeStart\}/);
             if (filename.match(reg)) {
                 filename = filename.replace("{$hgPicSizeStart}", "");
                 filename = filename.replace("{$hgPicSizeEnd}", "");
                 filename = filename.replace("{$hgPicSizeWidth}", w);
                 filename = filename.replace("{$hgPicSizeHeight}", h);
             }
             return filename
         },
         // top 图片
         getTopPic() {
             const _this = this;
             _this.h = _this.GetQueryString("history");
             param = {
                 m: "Apibbs",
                 c: "forum",
                 a: "detail",
                 forum_id: _this.GetQueryString("id"),
                 custom_appid: 462,
                 access_token: _this.storage.getItem('access_token'),
                 //  access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             return new Promise((resolve, reject) => {
                 axios.get(url, {
                         params: param
                     })
                     .then(
                         res => {
                             if (res.data.background.filename) {
                                 res.data.background.filename = _this.imgAdaptation(res.data.background.filename, '750', '380')
                             }
                             resolve(res.data)
                                 // _this.topPic = res.data
                         },
                         err => {
                             reject(err.data)
                         }
                     )
             })

         },
         // 话题 
         getCityData() {
             const _this = this;
             // const access_token = _this.getCookie("access_token"),
             param = {
                 m: "Apibbs",
                 c: "post",
                 a: "postList",
                 count: _this.count,
                 offset: (_this.page - 1) * _this.count,
                 parent_forum: _this.GetQueryString("id"),
                //  site_Id: 10188,
                 custom_appid: 462,
                 access_token: _this.storage.getItem('access_token'),
                 //  access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             return new Promise((resolve, reject) => {
                 axios.get(url, {
                         params: param
                     })
                     .then(
                         res => {
			     console.log(res.data,'列表');
                             if (res.data.ErrorCode || res.data.ErrorText) {
                                 return
                             }
                             res.data.forEach(element => {
                                 if (element.pics_num == 1) {
                                     element.pics[0].filename = _this.imgAdaptation(element.pics[0].filename, '702', '400')
                                 } else if (element.pics_num == 2) {
                                     element.pics.forEach(key => {
                                         key.filename = _this.imgAdaptation(key.filename, '344', '350')
                                     })
                                 } else if (element.pics_num >= 3) {
                                     element.pics.forEach(key => {
                                         key.filename = _this.imgAdaptation(key.filename, '226', '226')
                                     })
                                 }
                                 _this.CityDataList.push(element)
                             });
                             if (_this.CityDataList.length < (_this.page) * _this.count) {
                                 _this.flagMore = false
                             }
                             resolve(_this.CityDataList)
                             _this.videoData = res.data[0];
                         },
                         err => {
                             reject(err.data)
                         }
                     )
             })

         },
         //  getmore() {
         //      this.page++;
         //      this.getCityData()
         //  },
         // 添加关注 
         getFollowed(index, user_id) {
             event.preventDefault();
             this.followData(index, user_id)
         },
         followData(index, user_id) {
             var user_id = user_id;

             const _this = this;
             if (!_this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "care",
                 access_token: _this.storage.getItem('access_token'),
                 //  access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 care_type: 2,
                 uorf_id: user_id,
                 is_second: 1,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         _this.CityDataList[index].user_care = 1;
                         // console.log( _this.CityDataList[index].user_care);
                         // console.log(res.data);
                     }
                 )
         },
         // 取消关注   base_url?m=Apibbs&c=care&a=deleteCare
         deleteFollowed(index, user_id) {
             event.preventDefault();
             this.deleteFollowData(index, user_id)
         },

         deleteFollowData(index, user_id) {
             // console.log(index);
             // m=Apibbs&c=care&a=deleteCare
             // http://mobilesc.city.hogesoft.com/index.php?__hgActionType=xcs/bbs_care_care.php
             const _this = this;
             if (!_this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "deleteCare",
                 access_token: _this.storage.getItem('access_token'),
                 //  access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 // 关注帖子1   关注人2
                 care_type: 2,
                 // 被关注的用户ID
                 uorf_id: user_id,

                 // is_second（是否是子集）：1
                 is_second: 1,
                 // offset: (_this.page - 1) * _this.count,
                 // count: _this.count,
                //  site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         _this.CityDataList[index].user_care = 0;
                         // console.log( _this.CityDataList[index].user_care);
                         // console.log(res.data);
                     }
                 )
         },

         // 点赞功能 完成
         dianzan(index, id) {
             event.preventDefault();
             this.getDianzanData(index, id);
         },
         // 点赞功能   ?m=Apibbs&c=post&a=praise  
         // post_id  帖子ID
         getDianzanData(index, id) {
             const _this = this;
             if (!_this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             param = {
                 m: "Apibbs",
                 c: "post",
                 a: "postPraise",
                 // access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                 access_token: _this.storage.getItem('access_token'),
                 post_id: id,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',

             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         let praise_userinfoList = _this.CityDataList[index].praise_userinfo;
                         praise_userinfoList.unshift(res.data);
                         _this.CityDataList[index].is_praise = 1;
                         _this.CityDataList[index].praise_num++;
                         _this.user_id = _this.CityDataList[index].praise_userinfo[0].user_id
                             // _this.getCityData();
                     }
                 )
         },
         // 取消点赞 ?m=Apibbs&c=post&a=praise 
         deleteDianzan(index, id) {
             event.preventDefault();
             this.deleteDianzanData(index, id);
         },
         deleteDianzanData(index, id) {
             const _this = this;
             if (!_this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             param = {
                 m: "Apibbs",
                 c: "post",
                 a: "postPraise",
                 op: "del",
                 access_token: _this.storage.getItem('access_token'),
                 // access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                 post_id: id,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         // console.log(res.data.user_id)
                         _this.CityDataList[index].is_praise = 0;
                         _this.CityDataList[index].praise_num--;
                         _this.CityDataList[index].praise_userinfo.forEach((key, index1) => {
                             if (key.user_id == res.data.user_id) {
                                 _this.CityDataList[index].praise_userinfo.splice(index1, 1)
                             }
                         })
                     }
                 )
         },


         changeColor() {
             if (this.content.length > 0) {
                 this.$refs.sendBtn.style.color = "#333";
             } else {
                 this.$refs.sendBtn.style.color = "#999";
             }
         },
         // 音频播放
         playVideo() {
             const _this = this;
             event.preventDefault();
             var audioEle = _this.$refs.audio[0];
             if (audioEle.paused) {
                 audioEle.play(); // 这个就是播放 
                 _this.audioFlag = true;
             } else {
                 audioEle.pause(); // 这个就是暂停
                 _this.audioFlag = false;
             }
             if (audioEle) {
                 audioEle.loop = false;
                 audioEle.addEventListener('ended', function() {
                     _this.audioFlag = false;
                 }, false);
             }
         },
         getAllPeople(index, id) {
             event.preventDefault();
             window.location.href = `index_detail.html?post_id=${id}`;
         },


         // 发表评论
         getComment(index, id) {
             event.preventDefault();
             if (!this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             this.show = !this.show;
             this.post_id = id;
             this.$nextTick(function() {
                 this.$refs.textareaBox.focus()
             })
         },
         // 分享功能 ---
         shareAll(index, id) {
             // console.log(111)
             event.preventDefault();
             const _this = this;
             if (!_this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             var param = {
                 title: _this.CityDataList[index].title,
                 brief: _this.CityDataList[index].brief,
                 contentURL: _this.CityDataList[index].content_url,
                 imgLink: `${_this.CityDataList[index].indexpic.host}${_this.CityDataList[index].indexpic.dir}${_this.CityDataList[index].indexpic.filepath}${_this.CityDataList[index].indexpic.filename}`
             }
             SmartCity.shareTo(param);
         },

         showCont: function() {
             this.show = !this.show;
         },
         // 创建评论  m=Apibbs&c=post&a=comment
         sendComment(index, id) {
             this.show = !this.show;
             const _this = this;
             //  const access_token = _this.getCookie("access_token"),
             param = {
                 m: "Apibbs",
                 a: "comment",
                 c: "post",
                 post_id: _this.post_id,
                 content: _this.content,
                //  site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                 access_token: _this.storage.getItem('access_token'),
                 //  access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         setTimeout(() => {
                             _this.showTips = false;
                         }, 1500)

                         _this.showTips = true;
                         if (res.data.ErrorCode) {
                             //  console.log(res.data.ErrorText || res.data.ErrorText);
                             _this.tipMessage = res.data.ErrorText
                             _this.content = ''
                             return
                         }
                         _this.content = '';
                         _this.tipMessage = "发布成功"
                             //  console.log("发布成功")
                     }
                 )
         },
         // 获取用户信息
         _initUserInfo() {
             const _this = this;
             SmartCity.getUserInfo(function(res) {
                 if (res && res.userInfo) {
                     _this.access_token = res.userInfo.userTokenKey;
                     _this.storage.setItem('access_token', _this.access_token);
                 }
                 _this.promiseAll()
             })
         },
         promiseAll() {
             const _this = this;
             Promise.all([_this.getTopPic(), _this.getCityData()]).then(function(result) {
                 _this.topPic = result[0];
                 _this.CityDataList = result[1];
                 _this.flag = true;
                 _this.hasLogin = new UserInfo().isLogin(_this.storage.getItem('access_token'));
             })
         },
         //获取滚动条当前的位置 
         getScrollTop() {
             var scrollTop = 0;
             if (document.documentElement && document.documentElement.scrollTop) {
                 scrollTop = document.documentElement.scrollTop;
             } else if (document.body) {
                 scrollTop = document.body.scrollTop;
             }
             return scrollTop;
         },

         //获取当前可视范围的高度 
         getClientHeight() {
             var clientHeight = 0;
             if (document.body.clientHeight && document.documentElement.clientHeight) {
                 clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
             } else {
                 clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
             }
             return clientHeight;
         },

         //获取文档完整的高度 
         getScrollHeight() {
             return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
         },
         goDetail(id, index) {
            SmartCity.linkTo({
                innerLink: `${this.url}/travel_detail.html?id=${id}`
            });
         },
         goBack() {
            SmartCity.goBack();
        },
     },
     created() {
   //      this.promiseAll()
    
         this._initUserInfo();
        if (GetQueryString('title')) {
             document.title = decodeURIComponent(GetQueryString('title'))
         }
         //滚动事件触发
         window.addEventListener('scroll', () => {
             if (this.getScrollTop() + this.getClientHeight() == this.getScrollHeight()) {
		 this.page++;
		 this.getCityData();
             }
         })
     }
 })
