/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		data:{
			
		},
		/* 分页数据 */
		list:[],
		
		/* 操作类型 0添加操作，1修改操作*/
		type:0,
	},
	methods: {
		search: function() {
			var that =this
			$.ajax({
				url: app.base_path_contact_system + "/config/getAll",
				method: "POST", // 推荐使用 method 替代 type
				data:{},				
				success: function(response){
					if(response.status == 200){			
						that.list = response.data		
						
					}else{
						alert_warning("未查到配置信息")
					}
				}
			
			})
		},
		saveData(){
			var that =this
			var tempUrl = that.data.url;
			if(tempUrl.endsWith('/')){
				that.data.url = tempUrl.slice(0, -1)
			}
			console.log( that.data.url)
			$.ajax({
				url: app.base_path_contact_system + "/config/update",
				method: "POST", // 推荐使用 method 替代 type
				data:that.data,				
				success: function(response){
					if(response.status == 200){	
						var config = response.data
						/* todo */
						app.base_path_admin_web = config[0]["url"]						
						app.base_path_contact_system =  app.getCookie('ip')
						app.base_path_contact_comfyui = config[1]["url"]
						app.base_path_websocket_comfyui = config[2]["url"]
						
						console.log(app)
						alert_success("操作成功")
						
					}else{
						alert_error("操纵失败")
					}
				}
			
			})
			
			
		},
		setItem(item){
			this.data =item;			
		},getCode(item){
			this.data = item
			var url  = item.tags
			console.log(url)
			const imgElement = document.getElementById('mobile');
			
			
			// 生成二维码图片并赋值给 img
			QRCode.toDataURL(url, {
			    width: 300,
			    margin: 3
			  }).then(url => {
			    imgElement.src = url; // 关键：赋值给 src 就不会报错了
			  }).catch(err => {
			    console.error('生成失败：', err);
			  });
			
			
		}
	}
})
main.search();
/*页码渲染*/
