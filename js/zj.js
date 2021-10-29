var vm = new Vue({
    el: '#app',
    data: {
        host: 'http://bbssc.cloud.hoge.cn',
        list: [],
        url: 'http://mapi.kangbatv.com/h5/kb_app'
    },

    methods: {
        getAllList() {
            const _this = this;
            param = {
                m: 'Apibbs',
                c: 'post',
                a: 'index',
                fid: 0,
                user_care: '',
                count: 10,
                offset: 0,
                forum_id: 2529,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            };
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        console.log(res.data, 'res.data')
                        _this.list = res.data;
                        // res.data.forEach(element => {
                        //     element.indexpic.filename = _this.imgAdaptation(element.indexpic.filename, '750', '1334')
                        // });
                    }
                )
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
        // 获取url上的参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
            return null;
        },
        goDetail(id, index) {
            SmartCity.linkTo({
                innerLink: `${this.url}/travel_detail.html?id=${id}`
            });
        },
        goBack() {
            SmartCity.goBack();
        },
        _hideTop() {
            SmartCity.hideTopView({
                isShow: 0
            })
        }
    },
    created() {
        this.getAllList();
        this._hideTop();
        // console.log(this.GetQueryString("id"))
    },
})