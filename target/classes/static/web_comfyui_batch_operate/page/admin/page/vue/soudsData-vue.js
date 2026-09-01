/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		currentTime: new Date().getTime(),
		name:null,
		list:[],
		item:{},
	},
	methods: {
		
		changeL(item){
			if(isNaN(item.count)){
				item.count=0
				
			}
		},
		showData(data){
			this.item=data
		},
		toggleSelect(item){
			
		},
		clearList(){
			
		},download(item){
			var that = this;
			const promise= this.getImgArrayBuffer(item.url).then(data => {
			  // 下载文件, 并存成ArrayBuffer对象(blob)
				const a = document.createElement('a')
				document.body.appendChild(a)
				a.style.display = 'none'
				  // 使用获取到的blob对象创建的url
				const url = window.URL.createObjectURL(data)
				a.href = url
				  // 指定下载的文件名
				a.download = item.name
				a.click()
				document.body.removeChild(a)
				  // 移除blob对象的url
				window.URL.revokeObjectURL(url)
			});
		},getImgArrayBuffer(url){
			let _this=this;
			return new Promise((resolve, reject) => {
			  //通过请求获取文件blob 二进制格式
				let xmlhttp = new XMLHttpRequest();
				xmlhttp.open("GET", url, true);
				xmlhttp.responseType = "blob";
				xmlhttp.onload = function () {
				  if (this.status == 200) {
					resolve(this.response);
				  }else{
					reject(this.status);
				  }
				}
				xmlhttp.send();
			});
		},deleteItem(){
			var that = this;
			that.item.isAudio=1;
			$.ajax({
				url: app.base_path_contact_system + "/deleteLocalDataFile",
				method: "POST", // 推荐使用 method 替代 type
				// contentType: 'application/json',
				data: that.item,
				success: function(response) {
					if (response.status == 200) {
						main.getAllFile(1)		
						alert_success("操作成功")
						
					} else {
						alert_warning(response.msg)
					}
				}
			
			})
		},
		uploadVideos(){
			$("#localVideos").click()
		},getLocalVideos(e){
			console.log("getLocalVideos")
			if (e.target.files.length === 0) {			       
			    return;
			}
			var that =this;
			for(var i=0;i<  e.target.files.length;i++){
				var file = e.target.files[i];
				if (file) {				
					var formData = new FormData();
					formData.append('file', file)
					formData.append("isAudio",1)
					 $.ajax({
						url: app.base_path_contact_system+"/uploadDataFile", // 服务器端点URL
						type: 'POST',
						data: formData,
						processData: false, // 告诉jQuery不要处理发送的数据
						contentType: false, // 告诉jQuery不要设置Content-Type请求头
						success: function (res) {
							if(res.status==200){
								that.getAllFile(1)
							}else{
								alert_error(res.msg)
							}				           
						},
						error: function (res, textStatus, errorThrown) {
							
							console.log('Error uploading file');
							console.log(textStatus + ': ' + errorThrown);
						}
					});
				}
			}
		},getAllFile(num){			
			var that =this
			that.list =[]
			if(num == 1){
				that.name =null
			}
			
			$.ajax({
				url: app.base_path_contact_system+"/getAllLocalFile", // 服务器端点URL
				type: 'POST',
				data: {name:that.name,
					isAudio:1
				},
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function (res) {
					if(res.status==200){
						for(var i =0 ;i<res.data.length;i++){
							res.data[i].url = app.base_path_contact_system.split("admin")[0] +res.data[i].url
							that.list.push(res.data[i])
						}
						console.log(that.list)
					}else{
						// alert_warning(res.msg)
					}				           
				},
				error: function (res, textStatus, errorThrown) {
					alert_warning(res.msg)
				}
			});
			
		}
	}
})

main.getAllFile(1)