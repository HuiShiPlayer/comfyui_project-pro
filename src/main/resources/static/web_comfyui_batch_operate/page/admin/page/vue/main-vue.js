/*同步Ajax*/
$.ajaxSetup({
	async: false
});
var main = new Vue({
	el: "#main",
	data: {
		currentTime: new Date().getTime(),
		pageNum: 1,
		/* 分页数据 */
		pageSize: 20,
		list: [],
		item:{
			
		},
		collectionList:[]
	},
	methods: {
		
		deleteItems(type){
			console.log(this.collectionList)
			var that = this;
			$.ajax({
				url: app.base_path_contact_system + "/generateRecords/batchdelete",
				method: "POST", // 推荐使用 method 替代 type
				contentType: 'application/json',
				data: JSON.stringify({
					ids:that.collectionList,
					type:type
				}),
				success: function(response) {
					if (response.status == 200) {
						that.clearList()
						that.list=[]
						that.pageNum=1;
						main.search();						
						alert_success("操作成功")
						
					} else {
						alert_warning(response.msg)
					}
				}
			
			})
		},
		clearList(){
			var that =this
			for(var i=0;i<that.collectionList.length;i++){
				$("#imageBox"+that.collectionList[i]).removeClass("checked")
			}
			that.collectionList = []
			
			
		},
		fillList(){
			var that =this
			for(var i=0;i<that.list.length;i++){
				$("#imageBox"+that.list[i].id).addClass("checked")
				res=that.collectionList.indexOf(that.list[i].id)
				if(res == -1){
					that.collectionList.push(that.list[i].id)
				}				
			}
			console.log(that.collectionList.length)
		},
		toggleSelect(item) {
			res=this.collectionList.indexOf(item.id)
			if(res!= -1){
				this.collectionList.splice(res, 1);
			}else{
				this.collectionList.push(item.id)
			}
			
			console.log(this.collectionList)
		},
		showHome(){
			window.open('https://space.bilibili.com/269451197', '_blank');
		},
		download(item){
			
			const promise= this.getImgArrayBuffer(item.url).then(data => {
			  // 下载文件, 并存成ArrayBuffer对象(blob)
				const a = document.createElement('a')
				document.body.appendChild(a)
				a.style.display = 'none'
				  // 使用获取到的blob对象创建的url
				const url = window.URL.createObjectURL(data)
				a.href = url
				if(item.type == 1){
					// 指定下载的文件名
					a.download = `${item.prompt}.mp4`
				}else{
					a.download = `${item.prompt}.png`
				}

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
		},
		addMore(){
			this.pageNum ++
			this.search()
		},
		showData(data){
			this.item=data
		},
		isVideo(fileName) {
			const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
			const parts = fileName.split('.');
			const extension = parts[parts.length - 1].toLowerCase();
			return videoExtensions.includes(extension);
		},previewImage(url){
			window.open(url, '_blank');
		},
		/*查询*/
		search: function() {
			var that = this;
			$.ajax({
				url: app.base_path_contact_system + "/generateRecords/selectByPage",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					pageNum: that.pageNum,
					pageSize: that.pageSize
				},
				success: function(response) {
					if (response.status == 200) {
						
						for(item of response.data.records){
							if(item.reference != null && item.reference != 'null'){
								item.reference = JSON.parse(item.reference)
							}
							that.list.push(item)
						}
						
					} else {
						alert_warning("为查询到任何生成资源~")
					}
				}

			})

		},deleteItem(type){
			var that = this;
			for(var i=0;i<that.collectionList.length;i++){
				$("#imageBox"+that.collectionList[i]).removeClass("checked")
			}
			that.collectionList = []
			$.ajax({
				url: app.base_path_contact_system + "/generateRecords/delete",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id:that.item.id,
					type:type
				},
				success: function(response) {
					if (response.status == 200) {
						that.list=[]
						that.search();
						alert_success("删除成功")
						
					} else {
						alert_error("删除失败")
					}
				}
			
			})
			
		},

	}
})
main.search();
