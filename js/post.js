 var vm = new Vue({
     el: "#app",
     data: {
         show: false,
         topicName: "请选择主题",
         host: "http://bbssc.cloud.hoge.cn/",
         imgArr: [],
         videoArr: [],
         audioArr: [],
         photofiles: [],
         videos: [],
         audiofiles: [],
         selectLists: [],
         forum_id: null,
         content: '',
         complete_status: 0,
         num: 0,
         device_token: undefined,
         access_token: undefined,
         showTips: undefined,
         storage: window.localStorage,
         hasLogin: false
     },
     watch: {
         topicName(val, oldVal) {
             if (val != '请选择主题' && this.content.length > 0) {
                 $(".wrapper_button").addClass("wrapper_button_submit")
             } else {
                 $(".wrapper_button").removeClass("wrapper_button_submit")
             }
         }
     },
     methods: {
        /*输入框内容*/
         descArea: function () {
             var textVal = this.content.length;
             if (textVal > 0 && this.forum_id != null) {
                 $(".wrapper_button").addClass("wrapper_button_submit")
             } else {
                 $(".wrapper_button").removeClass("wrapper_button_submit")
             }
         },
         /* 获取主题板块 */
         getSortData: function () {
             const _this = this;
             param = {
                 m: "Apibbs",
                 a: "index",
                 c: "forum",
                 /*
                 fid: 0,
                 site_Id=10188&custom_appid=352&custom_appkey=itFj7LkvywZBVaNuD7QQQGlheJ7eNbQV
                 is_activity:1,
                 site_Id: 10188,
                 */
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                 access_token: _this.storage.getItem('access_token'),
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         _this.show = !_this.show;
                         _this.selectLists = res.data;
                     }
                 )
         },
         showCont: function () {
             this.show = !this.show;
         },
        /* 主题选择 */
         getTopic: function (list, key) {
             this.num = key;
             this.topicName = list.title;
             this.forum_id = list.id;
             this.show = !this.show;
         },
         /* 添加、删除图片 */
         addPic: function () {
             var vm = this;
             var input = $("#uploaderInput");
             input.unbind('change').on('change', function (e) {
                 console.log(e);
                 var files = input[0].files;
                 for (var i = 0; i < files.length; i++) {
                     vm.photofiles.push(files[i]);
                     var reader = new FileReader();
                     reader.readAsDataURL(files[i]);
                     reader.onload = function () {
                         vm.imgArr.push({
                             src: this.result
                         });
                     };
                 }
             });
         },
         delImg: function (key) {
             this.$delete(this.imgArr, key);
             this.$delete(this.photofiles, key);
         },
         /*添加、删除视频*/
         addVideo: function () {
             var vm = this;
             var inputVideo = $("#videoInput");
             inputVideo.unbind('change').on('change', function (e) {
                 var files = inputVideo[0].files;
                 for (var i = 0; i < files.length; i++) {
                     vm.videos.push(files[i]);
                     var reader = new FileReader();
                     reader.readAsDataURL(files[i]);
                     reader.onload = function () {
                         vm.videoArr.push({
                             src: this.result
                         });
                     };
                 }
             });
         },
         delVid: function (key) {
             this.$delete(this.videoArr, key);
             this.$delete(this.videos, key);
         },
         /*添加、删除音频*/
         addAudio: function () {
             var vm = this;
             var inputAudio = $("#audioInput");
             inputAudio.unbind('change').on('change', function (e) {
                 var files = inputAudio[0].files;
                 for (var i = 0; i < files.length; i++) {
                     vm.audiofiles.push(files[i]);
                     var reader = new FileReader();
                     reader.readAsDataURL(files[i]);
                     reader.onload = function () {
                         vm.audioArr.push({
                             src: this.result
                         });
                     };
                 }
             });
         },
         delAud: function (key) {
             this.$delete(this.audioArr, key);
             this.$delete(this.audiofiles, key);
         },
         /*发帖*/
         getSubmit: function () {
             const _this = this;
             if (!_this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             if (_this.imgArr.length > 0 || _this.videoArr.length > 0 || _this.audioArr.length > 0) {
                 _this.complete_status = 0;
             }
             if (_this.forum_id == null || _this.content == '') {
                 return
             } else {
                 param = {
                     m: "Apibbs",
                     a: "create",
                     c: "post",
                     fid: 0,
                     custom_appid: 462,
                     custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                     access_token: _this.storage.getItem('access_token'), //'ab47875ec2355ddf24516b94e8037cfe'
                     complete_status: _this.complete_status,
                     forum_id: _this.forum_id,
                     content: _this.content,
                     device_token: _this.device_token //'c63767125f5620256532cbea06041885'
                 }
                 config = {
                         headers: {
                            'Content-Type': 'application/json'
                         }
                     },
                     url = _this.host;
                 axios.post(url, param, config)
                     .then(
                         res => {
                             _this.showTips = true;
                             if (res.data.hasOwnProperty('ErrorText')) {
                                 _this.tipMessage = res.data.ErrorText
                                 setTimeout(() => {
                                    _this.showTips = false;
                                }, 1500)
                             } else {
                                 _this.tipMessage = '发布成功';
                                 setTimeout(() => {
                                    _this.showTips = false;
                                }, 1500)
                                 
                                 var post_id = res.data.id;
                                 if (_this.imgArr.length > 0 || _this.videoArr.length > 0 || _this.audioArr.length > 0) {
                                     _this.getSubmitFiles(post_id)
                                 }
                                 setTimeout(() => {
                                    SmartCity.goRoot();
                                }, 2000)
                             }
                         }
                     )
             }
         },
         /*上传帖子图片，视频，文件*/
         getSubmitFiles: function (post_id) {
             const _this = this;
             var post_id = post_id;
             var formData = new FormData();
             /* const access_token=_this.getCookie('access_token')*/
             for (var i = 0; i < _this.photofiles.length; i++) {
                 formData.append('photos[' + i + ']', _this.photofiles[i]);
             }
             for (var i = 0; i < _this.videos.length; i++) {
                 formData.append('videos[' + i + ']', _this.videos[i])
             }
             for (var i = 0; i < _this.audiofiles.length; i++) {
                 formData.append('audios[' + i + ']', _this.audiofiles[i])
             }
             param = {
                 m: "Apibbs",
                 a: "update",
                 c: "post",
                 fid: 0,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                 access_token: _this.storage.getItem('access_token'),//'c6fe9702d0c02487a1a6ee46a0ff3371'
                 post_id: post_id
             }
             for (j in param) {
                 formData.append(j, param[j])
             }
             var config = {
                 headers: {
                     'Content-Type': 'multipart/form-data'
                 }
             }
             url = _this.host;
             axios.post(url, formData, config)
                 .then(
                     res => {
                         /*  console.log(res) */

                     }
                 )
         },

         /* 获取设备信息 */
         _initSystemInfo() {
             const _this = this;
             SmartCity.getSystemInfo(function (res) {
                 _this.device_token = res.device_token
             });
         },
         /* 获取用户信息 */
         _initUserInfo() {
             var _this = this;
             SmartCity.getUserInfo(function (res) {
                 if (res && res.userInfo) {
                     _this.access_token = res.userInfo.userTokenKey;
                     _this.storage.setItem('access_token', _this.access_token)
                 }
             })
         },
         _hideTop() {
             SmartCity.hideTopView({
                 isShow: 0
             })
         },
         goBack() {
             SmartCity.goBack();
         }
     },
     created() {
         this.hasLogin = new UserInfo().isLogin(this.storage.getItem('access_token'));
         this._initSystemInfo();
         this._initUserInfo();
         this._hideTop();
         //new VConsole();
     }
 })