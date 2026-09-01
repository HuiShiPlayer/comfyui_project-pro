/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		currentTime: new Date().getTime(),
		name: null,
		list: [],
		item: {},
		pageNum: 1,
		totalCount: 0,
		classTypes: [],
		classItem:null
	},
	methods: {
		downLoad(item) {
			const downloadUrl = app.base_path_contact_system + "/resourceLibrary/download?id="+item.id;

			const a = document.createElement("a");
			a.href = downloadUrl;
			a.target = "_blank";
			// 浏览器弹出下载
			a.click();
			// 移除临时a标签
			a.remove();
		},
		editName(item) {
			console.log("edit")
			var name = $("#resourceName" + item.id).text()
			item.name = name
			var that = this;
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/editName",
				method: "POST", // 推荐使用 method 替代 type
				// contentType: 'application/json',
				data: item,
				success: function(response) {
					if (response.status == 200) {
						alert_success("修改成功 ")
					} else {
						alert_warning("修改失败")
					}
				}

			})
		},
		deleteItem(item) {
			var that = this;
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/deleteLocalDataFile",
				method: "POST", // 推荐使用 method 替代 type
				// contentType: 'application/json',
				data:item,
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
		uploadFiles() {
			$("#localFiles").click()
		},
		getLocalFiles(e) {
			console.log("getLocalImages")
			if (e.target.files.length === 0) {
				return;
			}
			var that = this
			for (var i = 0; i < e.target.files.length; i++) {
				var file = e.target.files[i];
				if (file) {

					var formData = new FormData();
					formData.append('file', file)
					$.ajax({
						url: app.base_path_contact_system + "/resourceLibrary/upload", // 服务器端点URL
						type: 'POST',
						data: formData,
						processData: false, // 告诉jQuery不要处理发送的数据
						contentType: false, // 告诉jQuery不要设置Content-Type请求头
						success: function(res) {
							if (res.status == 200) {
								that.getAllFile(1)
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							alert_error("文件上传失败")
							console.log('Error uploading file');
							console.log(textStatus + ': ' + errorThrown);
						}
					});
				}
			}
		},
		updateClass(item,classItem){
			item.classId = classItem.id;
			item.className = classItem.name;
			var that = this;
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/updateClass",
				method: "POST", // 推荐使用 method 替代 type
				// contentType: 'application/json',
				data: item,
				success: function(response) {
					if (response.status == 200) {
						alert_success("修改成功 ")
					} else {
						alert_warning("修改失败")
					}
				}
			
			})
		},
		getClassResource(item){
			if(item != null && item!= 'null'){
				this.classItem = item
			}else{
				this.classItem =null
			}
			this.getAllFile(0)
			
		},
		getAllFile(num) {
			var that = this
			if (num == 1) {
				that.name = null
				that.list = []
				that.pageNum = 1
				this.getCount()
			} else if (num == 0) {
				that.list = []
				that.pageNum = 1
			}
			var data ={
				name: that.name,
				pageNum: that.pageNum
			}
			if(this.classItem){
				data.classId = this.classItem.id
				data.className = this.classItem.name
			}
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/getAllResources", // 服务器端点URL
				type: 'POST',
				data: data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						for (var i = 0; i < res.data.records.length; i++) {
							res.data.records[i].localUrl = app.base_path_contact_system.split(
								"admin")[0] + res.data.records[i].localUrl
							that.list.push(res.data.records[i])
						}
					} else {
						alert_warning("未查询到资产")
					}
				},
				error: function(res, textStatus, errorThrown) {
					alert_warning(res.msg)
				}
			});

		},
		getCount(num) {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/getCount", // 服务器端点URL
				type: 'POST',
				data: {},
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					that.totalCount = res.data
				},
				error: function(res, textStatus, errorThrown) {
					alert_warning(res.msg)
				}
			});
		},
		getAllClass() {
			var that = this
			console.log("here")
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/getAllClass", // 服务器端点URL
				type: 'POST',
				data: {},
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					that.classTypes = res.data
				},
				error: function(res, textStatus, errorThrown) {
					alert_warning(res.msg)
				}
			});
		},
		showHome(){
			window.open('https://space.bilibili.com/269451197', '_blank');
		},addMore(){
			this.pageNum ++
			this.getAllFile(3)
		}

	}
})


/* =====================================================
   信息管理平台 - 图片预览 & 类别下拉 交互脚本
   原生 JavaScript，无任何依赖，直接随页面引入即可
   下拉框：仅点击“修改类别 / 类别胶囊”时出现，始终向下弹出
   ===================================================== */

main.getAllFile(1)
main.getAllClass()
