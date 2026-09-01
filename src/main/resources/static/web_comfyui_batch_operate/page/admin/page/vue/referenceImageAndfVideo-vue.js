/*同步Ajax*/
$.ajaxSetup({
	async: false
});

eval(api);
var main = new Vue({
	el: "#main",
	data: {
		/* rh */
		config8: "default",
		defaultSource: defaultSource,
		workflowId: workflowId,
		apiKey: apiKey,
		// prompt_id:null,
		currentTime: new Date().getTime(),
		globalPrompt1: null,
		globalPrompt2: null,
		globalReference: null,
		globalReferenceVideo: null,
		width: 480,
		height: 832,
		length: 81,
		skip: 0,
		seed: 2025,
		blocks_to_swap: 30,
		/* 分页数据 */
		prompts: [],
		columnIndex: 2,
		excelData: {},
		list: [],

		objectData: {
			prompt: "",
			pre_image: "img/bg_image_1.png",
			image_width: 100,
			image_height: 100,
			referenceImage: null,
			referenceVideo: null,
			isContinue: false
		},

		progress: 0,
		intask: false,

		prompt_id: "",

		outputsNum: outputsNum,
		interval: null,
		// 暂时未使用
		totalSteps: 8,
		isContinue: false,

		type: 1,
		taskName: null,
		uploadedImage: null,
		uploadedVideo: null,
		searchTaskName: null,
		tasks: [],
		taskTemlepte: null,

		recordsName: "",
		record: null,
		records: [],

		/* todo V2 */
		startRowNum: 2,
		apis: [],
		apiName: "",
		api: {},
		apiFunction: apiFunction,

		// 自定义
		param1: -99999,
		param2: -99999,
		param3: -99999,
		param4: -99999,
		param5: -99999,
		capCutName: null,
		startIndex: 1,
		resourceImgsKeyWords: null,
		resourceAudiosKeyWord: null,
		showAudioKeyWords: false
	},
	mounted() {
		var data = localStorage.getItem("referenceImageAndVideo")
		if (data) {
			data = JSON.parse(data)
			this.globalPrompt1 = data.globalPrompt1
			this.globalPrompt2 = data.globalPrompt2
			this.width = data.width
			this.height = data.height
			this.seed = data.seed
			this.length = data.length
			this.blocks_to_swap = data.blocks_to_swap
			this.param1 = data.param1
			this.param2 = data.param2
			this.param3 = data.param3
			this.param4 = data.param4
			this.param5 = data.param5
			this.list = data.list
			this.globalReference = data.globalReference
			this.globalReferenceVideo = data.globalReferenceVideo
			this.startIndex = data.startIndex
			this.isContinue = data.isContinue

		}
		var referenceImageAndfVideoInitData = localStorage.getItem("referenceImageAndfVideoInitData")
		if (referenceImageAndfVideoInitData) {
			referenceImageAndfVideoInitData = JSON.parse(referenceImageAndfVideoInitData)
			this.width = referenceImageAndfVideoInitData.width
			this.height = referenceImageAndfVideoInitData.height
			for (var i = 0; i < referenceImageAndfVideoInitData.list.length; i++) {
				if (referenceImageAndfVideoInitData.list[i]) {
					var objectData = {
						prompt: "",
						pre_image: "img/bg_image_1.png",
						image_width: 100,
						image_height: 100,
						referenceImage: referenceImageAndfVideoInitData.list[i],
						referenceVideo: null,
						prompVisiable: false,
						pre_video: null,
						isContinue: false
					}
					this.list.push(objectData)
				}
			}
			localStorage.removeItem("referenceImageAndfVideoInitData")
		}
		/* rh */
		this.getDefaultConfig()
		var that = this;
		if (that.interval) {
			clearInterval(that.interval)
		}
		this.interval = setInterval(() => {
			that.checkTask();
		}, app.cycleTime)
	},
	beforeDestroy() {
		var that = this;
		clearInterval(that.interval)
		console.log("离开视频参考页面")
	},
	watch: {
		isContinue: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		globalPrompt1: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		globalPrompt2: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		width: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		height: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		seed: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		blocks_to_swap: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		length: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param1: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param2: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param3: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param4: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		startIndex: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		list: {
			handler(newVal) {
				this.saveDataInCache()
			},
			deep: true // 关键
		},
		globalReference: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		globalReferenceVideo: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},


	},
	methods: {
		getGlobalResource(resourceType, count) {
			var keyPrompts = null;
			if (resourceType == 1) {
				keyPrompts = this.resourceImgsKeyWords
			} else if (resourceType == 2) {
				keyPrompts = this.resourceAudiosKeyWord
			}
			console.log("keyPrompts:" + keyPrompts)
			if (app.isBlank(keyPrompts)) {
				return
			}
			var that = this;
			$.ajax({
				url: app.base_path_contact_system + "/resourceLibrary/getGlobalResource",
				method: "POST", // 推荐使用 method 替代 type
				async: true, // 默认就是 true，可以省略
				data: {
					resourceType: resourceType,
					prompt: keyPrompts,
					count: count
				},
				success: function(res) {
					/* 处理返回值 */
					if (res.status == 200) {
						if(resourceType == 1){
							if (res.data.resources && res.data.resources.length > 0) {
								that.globalReference = app.base_path_contact_system.split("admin")[0] +
									res.data.resources[0]
								that.updateReferenceImage()
							}
						}
						
					} else {
						alert_warning(res.msg)
					}
				}
		
			})
		},
		/* rule */
		getRources(count,resourceType){
			//count 资产数量 resourceType类型 1图片 2音频
			var that =this;
			for(var i =0 ;i<that.list.length;i++){
				that.list[i].isContinue =true
				const reg = new RegExp(that.rule)
				var res = reg.test(that.list[i].prompt)
				$.ajax({
					url: app.base_path_contact_system + "/resourceLibrary/asyncResources",
					method: "POST", // 推荐使用 method 替代 type
					async: true, // 默认就是 true，可以省略
					data:{
						count:count,
						resourceType:resourceType,
						prompt:that.list[i].prompt,
						index:i
					},
					success: function(res) {
						/* 处理返回值 */
						var index = res.data.index
						that.list[index].prompt = res.data.prompt
						that.list[index].isContinue =false
						if(res.data.resources && res.data.resources.length>0){
							that.list[index].referenceImage = app.base_path_contact_system.split("admin")[0]+res.data.resources[0]
						}						
					}
				
				})
			}			
		},
		checkTask() {
			console.log("checkTask rv2v")
			var that = this
			var resTaskListStr = localStorage.getItem("resTaskListrv2v");
			if (!app.isBlank(resTaskListStr) && JSON.parse(resTaskListStr).length != 0) {

				var resTaskList = JSON.parse(resTaskListStr);
				var resCompleteData = null;
				$.ajax({
					url: app.base_path_contact_system + "/comfyui/checkCompleteTasks",
					method: "POST", // 推荐使用 method 替代 type
					contentType: 'application/json',
					data: resTaskListStr,
					async: true, // 默认就是 true，可以省略
					success: function(response) {
						if (response.status == 200) {
							resCompleteData = response.data
							if (resCompleteData != null) {
								for (var i = 0; i < resCompleteData.length; i++) {
									var item = resCompleteData[i]
									var obj = item.item
									var taskKey = item.taskKey
									var objUrl = item.objUrl
									var taskIndex = item.taskIndex
									// 赋值
									that.list[taskIndex].pre_video = objUrl
									that.list[taskIndex].isContinue = false
									var data = {
										prompt: that.list[taskIndex].prompt,
										type: 0,
										pre_video: objUrl,
										name: that.list[taskIndex].name,
										referenceImage: that.list[taskIndex].referenceImage,
										referenceVideo: that.list[taskIndex].referenceVideo,

									}
									//上传记录
									that.uploadGenerateRecords(data)
									//数据更新
									const index = resTaskList.indexOf(taskKey);
									if (index !== -1) {
										resTaskList.splice(index, 1);
										resTaskListStr = JSON.stringify(resTaskList);
										localStorage.setItem("resTaskListrv2v", resTaskListStr)
									}

								}
							}
						} else {
							console.log("任务查询,无结果")
						}
					}
				})


			} else {
				if (that.isContinue) {
					that.isContinue = false
				}
				var displayVal = $('#loading').css('display');
				if (displayVal != 'none') {
					setTimeout(function() {
						$("#cancel-progress").click()
					}, 1500);
				}
			}

		},
		/* 5.1 */
		showPrompt(item) {
			this.objectData = item
		},
		/* rh */
		updateConfig() {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/config/updateByID",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id: 8,
					url: that.config8
				},
				success: function(response) {
					if (response.status == 200) {
						alert_success(response.msg)

					} else {
						alert_error("操纵失败")
					}
				}

			})

		},
		/* rh */
		getDefaultConfig: function() {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/config/selectById",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id: 8
				},
				success: function(response) {
					if (response.status == 200) {
						that.config8 = response.data.url

					} else {
						alert_warning("未查到配置信息")
					}
				}

			})
		},
		/* rh */
		upload2RH(name) {
			var filename = null
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/comfyui/upload2RH",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name: name,
					apiKey: that.apiKey
				},

				success: function(response) {
					if (response.status == 200) {
						res = JSON.parse(response.data)
						filename = res.data.fileName
					} else {
						alert_warning(response.msg)
					}
				}

			})
			return filename
		},

		toDigital() {
			$.ajax({
				url: app.base_path_contact_system + "/api/getDefalutApi",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					type: 8
				},
				success: function(response) {
					if (response.status == 200) {} else {
						alert_error("未设置相应的API")
						return
					}
				}
			})
			var datas = []
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].pre_video) {
					datas.push(this.list[i].pre_video)
				}
			}
			var d = {
				list: datas,
				width: this.width,
				height: this.height
			}
			localStorage.setItem("baseVideos", JSON.stringify(d))
			localStorage.removeItem("digital_human")
			window.location.href = app.base_path_admin_web + '/page/admin/index.html#/digital_human'
		},
		clearCache() {
			var resTaskListStr = localStorage.getItem("resTaskListrv2v");
			if (!app.isBlank(resTaskListStr) && JSON.parse(resTaskListStr).length != 0) {
				var resTaskList = JSON.parse(resTaskListStr);
				var resCompleteData = null;
				$.ajax({
					url: app.base_path_contact_system + "/comfyui/clearTask",
					method: "POST", // 推荐使用 method 替代 type
					contentType: 'application/json',
					data: JSON.stringify(resTaskList),
					success: function(response) {
						if (response.status == 200) {
							console.log("清除成功")

						} else {
							console.log("清除失败")
						}
					}
				})
			}
			localStorage.removeItem('resTaskListrv2v');
			localStorage.removeItem("referenceImageAndVideo")
			location.reload()
		},
		saveDataInCache() {
			console.log('数据缓存')
			var data = {
				isContinue: this.isContinue,
				globalPrompt1: this.globalPrompt1,
				globalPrompt2: this.globalPrompt2,
				width: this.width,
				height: this.height,
				seed: this.seed,
				length: this.length,
				blocks_to_swap: this.blocks_to_swap,
				param1: this.param1,
				param2: this.param2,
				param3: this.param3,
				param4: this.param4,
				param5: this.param5,
				list: this.list,
				globalReference: this.globalReference,
				globalReferenceVideo: this.globalReferenceVideo,
				startIndex: this.startIndex
			}
			localStorage.setItem("referenceImageAndVideo", JSON.stringify(data))
		},
		saveCapcut() {
			var that = this
			if (app.isBlank(that.capCutName)) {
				alert_warning("未设置模板名称")
				return
			}
			if (that.list.length == 0) {
				alert_warning("未生成任何结果")
				return
			}
			var res = []
			for (var i = 0; i < that.list.length; i++) {

				if (that.list[i].pre_video && that.list[i].pre_video != 'img/bg_image_1.png') {
					res.push(that.list[i].pre_video)
				}
			}
			if (res.length == 0) {
				alert_warning("未生成任何结果")
				return
			}
			var params = {
				name: that.capCutName,
				datas: res
			};
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/comfyui/saveCapcut",
				contentType: "application/json", // 必须指定 JSON 格式
				data: JSON.stringify(params),
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						alert_success("导出成功")
						$("#exportData").click()
					} else {
						alert_error("导出失败")
					}

				}
			});

		},
		//自定义
		setAdance(item) {
			this.objectData = item
		},
		changeAdancec(index, item) {
			if (index == 1) {
				if (app.isBlank(item.param1)) {
					item.param1 = null;
				}
			} else if (index == 2) {
				if (app.isBlank(item.param2)) {
					item.param2 = null;
				}
			} else if (index == 3) {
				if (app.isBlank(item.param3)) {
					item.param3 = null;
				}
			} else if (index == 4) {
				if (app.isBlank(item.param4)) {
					item.param4 = null;
				}
			} else if (index == 5) {
				if (app.isBlank(item.param5)) {
					item.param5 = null;
				}
			}
		},
		deleteGlobalVideo() {
			this.globalReferenceVideo = null
		},
		deleteGlobalImage() {
			this.globalReference = null
		},
		deleteImage(item) {
			item.referenceImage = null
		},
		deleteVideo(item) {
			item.referenceVideo = null
		},
		getLastVideoImage(item, index) {
			var that = this
			if (index == 0 || !that.list[index - 1] || !that.list[index - 1].pre_video) {
				alert_warning("未生成前段视频")
				return
			}
			$.ajax({
				url: app.base_path_contact_system + "/getLastVideoImage",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name: that.list[index - 1].pre_video.split('/').pop().split('?')[0]
				},
				success: function(response) {
					if (response.status == 200) {
						var refeimage = app.base_path_contact_system.split("admin")[0] + response
							.data
						console.log(refeimage)
						item.referenceImage = refeimage

					} else {
						alert_error("获取失败")
					}
				}
			})


		},
		handleGlobalVideoUpload(e) {
			var that = this
			that.uploadedVideo = null
			const file = e.target.files[0];
			if (file) {
				that.uploadedVideo = file;
				var formData = new FormData();
				formData.append('file', file)
				$.ajax({
					url: app.base_path_contact_system + "/upload", // 服务器端点URL
					type: 'POST',
					data: formData,
					processData: false, // 告诉jQuery不要处理发送的数据
					contentType: false, // 告诉jQuery不要设置Content-Type请求头
					success: function(res) {
						if (res.status == 200) {
							that.globalReferenceVideo = app.base_path_contact_system.split("admin")[
								0] + res.data;
							that.updateReferenceVideo()
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert_error("文件上传失败")
						console.log('Error uploading file');
						console.log(textStatus + ': ' + errorThrown);
					}
				});
			}
		},
		updateReferenceVideo() {
			var that = this
			if (that.list.length == 0) {
				return
			}
			for (var i = 0; i < that.list.length; i++) {
				if (that.list[i].referenceVideo) {

				} else {
					if (that.globalReferenceVideo) {
						that.list[i].referenceVideo = that.globalReferenceVideo
					}

				}
			}
		},
		handleGlobalImageUpload(e) {
			var that = this
			that.uploadedImage = null
			const file = e.target.files[0];
			if (file) {
				that.uploadedImage = file;
				var formData = new FormData();
				formData.append('file', file)
				$.ajax({
					url: app.base_path_contact_system + "/upload", // 服务器端点URL
					type: 'POST',
					data: formData,
					processData: false, // 告诉jQuery不要处理发送的数据
					contentType: false, // 告诉jQuery不要设置Content-Type请求头
					success: function(res) {
						if (res.status == 200) {
							that.globalReference = app.base_path_contact_system.split("admin")[0] +
								res.data;
							that.updateReferenceImage()
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert_error("文件上传失败")
						console.log('Error uploading file');
						console.log(textStatus + ': ' + errorThrown);
					}
				});
			}
		},
		updateReferenceImage() {
			var that = this
			if (that.list.length == 0) {
				return
			}
			for (var i = 0; i < that.list.length; i++) {
				if (that.list[i].referenceImage) {

				} else {
					if (that.globalReference) {
						that.list[i].referenceImage = that.globalReference
					}

				}
			}
		},
		clickLocalGlobalVideoInput() {
			$("#handleGlobalVideoUpload").click()
		},
		clickLocalGlobalImagesInput() {
			$("#handleGlobalImageUpload").click()
		},
		getStorageVideo() {

		},
		/* todo V2 */
		clickLocalVideosInput() {
			$("#localVideos").click()
		},
		clickLocalImagesInput() {
			$("#localImages").click()
		},
		getLocalImages(e) {
			console.log("getLocalImages")
			if (e.target.files.length === 0) {
				return;
			}
			var that = this
			var lenghtTempleteData = e.target.files.length
			var listLenght = that.list.length
			if (lenghtTempleteData <= listLenght) {
				for (var i = 0; i < lenghtTempleteData; i++) {
					var file = e.target.files[i];
					if (file) {
						var formData = new FormData();
						formData.append('file', file)
						$.ajax({
							url: app.base_path_contact_system + "/upload", // 服务器端点URL
							type: 'POST',
							data: formData,
							processData: false, // 告诉jQuery不要处理发送的数据
							contentType: false, // 告诉jQuery不要设置Content-Type请求头
							success: function(res) {

								if (res.status == 200) {
									that.list[i].referenceImage = app.base_path_contact_system
										.split("admin")[0] + res.data;
									that.list[i].prompVisiable = false

									if (!that.list[i].referenceVideo && that.globalReferenceVideo) {
										that.list[i].referenceVideo = that.globalReferenceVideo
									}
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
			} else {
				let count = 0
				for (var i = 0; i < listLenght; i++) {
					var file = e.target.files[i];
					if (file) {
						var formData = new FormData();
						formData.append('file', file)
						$.ajax({
							url: app.base_path_contact_system + "/upload", // 服务器端点URL
							type: 'POST',
							data: formData,
							processData: false, // 告诉jQuery不要处理发送的数据
							contentType: false, // 告诉jQuery不要设置Content-Type请求头
							success: function(res) {

								if (res.status == 200) {
									that.list[i].referenceImage = app.base_path_contact_system
										.split("admin")[0] + res.data;
									that.list[i].prompVisiable = false
									if (!that.list[i].referenceVideo && that.globalReferenceVideo) {
										that.list[i].referenceVideo = that.globalReferenceVideo
									}
									count = i + 1
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
				for (var i = count; i < lenghtTempleteData; i++) {
					var file = e.target.files[i];
					if (file) {
						var formData = new FormData();
						formData.append('file', file)
						$.ajax({
							url: app.base_path_contact_system + "/upload", // 服务器端点URL
							type: 'POST',
							data: formData,
							processData: false, // 告诉jQuery不要处理发送的数据
							contentType: false, // 告诉jQuery不要设置Content-Type请求头
							success: function(res) {

								if (res.status == 200) {
									var objectData = {
										prompt: "",
										pre_image: "img/bg_image_1.png",
										image_width: 100,
										image_height: 100,
										referenceImage: app.base_path_contact_system.split(
											"admin")[0] + res.data,
										referenceVideo: null,
										prompVisiable: false,
										pre_video: null,
										isContinue: false
									}
									if (that.globalReferenceVideo) {
										objectData.referenceVideo = that.globalReferenceVideo
									}
									// 对每个元素执行操作
									that.list.push(objectData)
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
			}


		},
		getLocalVideos(e) {
			console.log("getLocalVideos")
			if (e.target.files.length === 0) {
				return;
			}
			var that = this
			var lenghtTempleteData = e.target.files.length
			var listLenght = that.list.length
			if (lenghtTempleteData <= listLenght) {
				for (var i = 0; i < lenghtTempleteData; i++) {
					var file = e.target.files[i];
					if (file) {

						var formData = new FormData();
						formData.append('file', file)
						$.ajax({
							url: app.base_path_contact_system + "/upload", // 服务器端点URL
							type: 'POST',
							data: formData,
							processData: false, // 告诉jQuery不要处理发送的数据
							contentType: false, // 告诉jQuery不要设置Content-Type请求头
							success: function(res) {

								if (res.status == 200) {
									that.list[i].referenceVideo = app.base_path_contact_system
										.split("admin")[0] + res.data;
									that.list[i].prompVisiable = false

									if (!that.list[i].referenceImage && that.globalReference) {
										that.list[i].referenceImage = that.globalReference
									}
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
			} else {
				let count = 0
				for (var i = 0; i < listLenght; i++) {
					var file = e.target.files[i];
					if (file) {
						var formData = new FormData();
						formData.append('file', file)
						$.ajax({
							url: app.base_path_contact_system + "/upload", // 服务器端点URL
							type: 'POST',
							data: formData,
							processData: false, // 告诉jQuery不要处理发送的数据
							contentType: false, // 告诉jQuery不要设置Content-Type请求头
							success: function(res) {

								if (res.status == 200) {
									that.list[i].referenceVideo = app.base_path_contact_system
										.split("admin")[0] + res.data;
									that.list[i].prompVisiable = false
									if (!that.list[i].referenceImage && that.globalReference) {
										that.list[i].referenceImage = that.globalReference
									}
									count = i + 1
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
				for (var i = count; i < lenghtTempleteData; i++) {
					var file = e.target.files[i];
					if (file) {
						var formData = new FormData();
						formData.append('file', file)
						$.ajax({
							url: app.base_path_contact_system + "/upload", // 服务器端点URL
							type: 'POST',
							data: formData,
							processData: false, // 告诉jQuery不要处理发送的数据
							contentType: false, // 告诉jQuery不要设置Content-Type请求头
							success: function(res) {

								if (res.status == 200) {
									var objectData = {
										prompt: "",
										pre_image: "img/bg_image_1.png",
										image_width: 100,
										image_height: 100,
										referenceImage: null,
										referenceVideo: app.base_path_contact_system.split(
											"admin")[0] + res.data,
										prompVisiable: false,
										pre_video: null
									}
									if (that.globalReference) {
										objectData.referenceImage = that.globalReference
									}
									// 对每个元素执行操作
									that.list.push(objectData)
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
			}






		},
		confirmApi() {
			var that = this
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/update",
				data: that.api,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						console.log("API设置成功")
						// location.reload(true);

					} else {
						console.log("API设置失败")
					}

				}
			});
			$.ajax({
				url: app.base_path_contact_system + "/api/getDefalutApi",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					type: 7
				},
				success: function(response) {
					if (response.status == 200) {
						that.outputsNum = response.data.outputsNum
						that.api = response.data.api
						that.defaultSource = response.data.classType
						that.workflowId = response.data.workflowId
						that.apiKey = response.data.apiKey

						eval(that.api)
						that.apiFunction = apiFunction

					} else {
						alert_error("未查询到模板信息")
					}
				}
			})



		},
		selectApi(item, index) {
			item.isSelect = !item.isSelect
			this.api = item
			this.api.isDefault = 1
			for (var i = 0; i < this.apis.length; i++) {
				if (i != index) {
					this.apis[i].isSelect = false
					this.apis[i].isDefault = 0
				}
			}
		},
		getApi(type, name) {
			var that = this
			var data = {
				type: type,
				classType: that.defaultSource
			}
			if (!app.isBlank(name)) {
				data.name = name
			}
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/getApi",
				data: data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						that.apis.splice(0, that.apis.length);
						for (item of res.data) {
							if (item.isDefault == 1) {
								item.isSelect = true
							} else {
								item.isSelect = false
							}


							that.apis.push(item)
						}
					} else {
						that.apis = []
					}

				}
			});


		},
		changeVisiable(item, index) {
			if (item.prompVisiable) {
				item.prompVisiable = false
			} else {
				item.prompVisiable = true
				this.$nextTick(() => {
					//拿到textarea dom
					const ta = this.$refs['textArea' + index][0]
					if (ta) {
						ta.focus()
						//光标移到末尾
						ta.selectionStart = ta.value.length
						ta.selectionEnd = ta.value.length
					}
				})
			}
		},
		changeW() {
			if (isNaN(this.width)) {
				this.width = 480

			}
		},
		changeH() {
			if (isNaN(this.height)) {
				this.height = 720
			}
		},
		changeS() {
			if (isNaN(this.seed)) {
				this.seed = 0

			}
		},
		changeB() {
			if (isNaN(this.blocks_to_swap)) {
				this.blocks_to_swap = 0

			}
		},
		changeL() {
			if (isNaN(this.length)) {
				this.length = 2

			}
		},
		changeSL(item) {
			if (isNaN(item.length)) {
				item.length = null
			}
		},
		changeSS(item) {
			if (isNaN(item.skip)) {
				item.skip = null
			}
		},
		changeSW(item) {
			if (isNaN(item.width)) {
				item.width = null
			}
		},
		changeSH(item) {
			if (isNaN(item.height)) {
				item.height = null
			}
		},
		changeSSeed(item) {
			if (isNaN(item.seed)) {
				item.seed = null
			}
		},
		confirmRecord() {
			var that = this
			if (this.record) {
				var arr = JSON.parse(this.record.taskList);
				that.list.splice(0, that.list.length);
				for (item of arr) {
					item.prompVisiable = false
					that.list.push(item)
				}
			}
		},
		selectRecords(item, index) {
			item.isSelect = !item.isSelect
			this.record = item

			for (var i = 0; i < this.records.length; i++) {
				if (i != index) {
					this.records[i].isSelect = false
				}
			}
			console.log(this.taskTemlepte)
		},
		getRecords() {
			var that = this
			that.taskTemlepte = null
			$.ajax({
				url: app.base_path_contact_system + "/taskRecords/selectByName",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name: that.recordsName,
					type: 7
				},
				success: function(response) {
					if (response.status == 200) {
						that.records.splice(0, that.records.length);
						for (item of response.data) {
							item.isSelect = false
							that.records.push(item)
						}



					} else {
						alert_error("未查询到模板信息")
					}
				}

			})
		},
		base64ToFile(base64, fileName) {
			const binary = atob(base64.split(',')[1]); // 注意这里使用了split(',')[1]来移除data URI的前缀部分
			// 将二进制数据转换为Uint8Array
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			// 创建Blob对象，然后转换为File对象
			return new File([bytes], fileName, {
				type: "image/png"
			});

		},
		async uploadImageToComfyUI(imageUrl, fileName) {
			var that = this
			var uploadedImage = null
			//  url ==> file
			await that.convertImageToBase64WithCanvas(imageUrl).then(item => {
				uploadedImage = that.base64ToFile(item, fileName)
			})

			const formData = new FormData();
			formData.append('image', uploadedImage);
			try {
				const response = await fetch(app.base_path_contact_system + '/comfyui/upload/image', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					return null;
				}

				const data = await response.json();
				return data.name; // 返回图片文件名
			} catch (error) {
				console.error('上传图片失败:', error);
				return null;
			}
		},
		async uploadVideoToComfyUI(videoUrl, fileName) {
			var that = this
			const response = await fetch(videoUrl);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const blob = await response.blob();
			const formData = new FormData();
			formData.append('image', blob, fileName); // 'video' 是服务器端接收文件的字段名

			try {
				const response = await fetch(app.base_path_contact_system + '/comfyui/upload/image', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					return null;
				}

				const data = await response.json();
				return data.name; // 返回图片文件名
			} catch (error) {
				console.error('上传图片失败:', error);
				return null;
			}
		},
		selectTemplete(item, index) {
			item.isSelect = !item.isSelect
			this.taskTemlepte = item

			for (var i = 0; i < this.tasks.length; i++) {
				if (i != index) {
					this.tasks[i].isSelect = false
				}
			}
			console.log(this.taskTemlepte)
		},
		getTaskTemplete() {
			var that = this
			that.taskTemlepte = null
			$.ajax({
				url: app.base_path_contact_system + "/task/selectByName",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name: that.searchTaskName
				},
				success: function(response) {
					if (response.status == 200) {
						that.tasks.splice(0, that.tasks.length);
						for (item of response.data) {
							item.isSelect = false
							that.tasks.push(item)
						}



					} else {
						alert_error("未查询到模板信息")
					}
				}

			})
		},
		handleImageUpload(e) {
			var that = this
			that.uploadedImage = null
			const file = e.target.files[0];
			if (file) {

				that.uploadedImage = file;
				var formData = new FormData();
				formData.append('file', file)
				$.ajax({
					url: app.base_path_contact_system + "/upload", // 服务器端点URL
					type: 'POST',
					data: formData,
					processData: false, // 告诉jQuery不要处理发送的数据
					contentType: false, // 告诉jQuery不要设置Content-Type请求头
					success: function(res) {
						if (res.status == 200) {
							that.objectData.referenceImage = app.base_path_contact_system.split(
								"admin")[0] + res.data;
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert_error("文件上传失败")
						console.log('Error uploading file');
						console.log(textStatus + ': ' + errorThrown);
					}
				});
			}
		},
		handleVideoUpload(e) {
			var that = this
			that.uploadedVideo = null
			const file = e.target.files[0];
			if (file) {

				that.uploadedVideo = file;
				var formData = new FormData();
				formData.append('file', file)
				$.ajax({
					url: app.base_path_contact_system + "/upload", // 服务器端点URL
					type: 'POST',
					data: formData,
					processData: false, // 告诉jQuery不要处理发送的数据
					contentType: false, // 告诉jQuery不要设置Content-Type请求头
					success: function(res) {
						if (res.status == 200) {
							that.objectData.referenceVideo = app.base_path_contact_system.split(
								"admin")[0] + res.data;
						}

					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert_error("文件上传失败")
						console.log('Error uploading file');
						console.log(textStatus + ': ' + errorThrown);
					}
				});
			}
		},
		selectImage(index, data) {
			this.objectData = data
			$("#" + index + "_uploadImage").click()

		},
		selectVideo(index, data) {
			this.objectData = data
			$("#" + index + "_uploadVideo").click()

		},

		save_task() {
			var that = this
			if (that.list.length == 0) {
				alert_warning("当前未生成结果")
				return
			}
			if (app.isBlank(that.taskName)) {
				alert_warning("未给任务命名！")
				return
			}
			var infos = []
			for (var item of that.list) {
				if (item.pre_image == 'img/bg_image_1.png') {
					continue
				}
				var data = {
					"taskName": that.taskName,
					"clientId": item.clientId,
					"prompt": item.prompt,
					"url": item.pre_video,
					"type": 1
				}
				infos.push(data)
			}

			let num = 0
			$.ajax({
				url: app.base_path_contact_system + "/task/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: JSON.stringify(infos),
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(response) {
					if (response.status == 200) {
						num++
					}
				}

			})
			var records = {
				type: 7,
				taskList: JSON.stringify(that.list),
				taskName: that.taskName
			}


			$.ajax({
				url: app.base_path_contact_system + "/taskRecords/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: JSON.stringify(records),
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(response) {
					if (response.status == 200) {
						num++
					}
				}

			})

			if (num == 2) {
				$("#cancel_save_task").click()
				alert_success("操作成功")
			} else {
				alert_error("操作失败")
			}
		},
		getImgArrayBuffer(url) {
			let _this = this;
			return new Promise((resolve, reject) => {
				//通过请求获取文件blob 二进制格式
				let xmlhttp = new XMLHttpRequest();
				xmlhttp.open("GET", url, true);
				xmlhttp.responseType = "blob";
				xmlhttp.onload = function() {
					if (this.status == 200) {
						resolve(this.response);
					} else {
						reject(this.status);
					}
				}
				xmlhttp.send();
			});
		},
		batchDownloadVideo() {
			let _this = this;
			if (_this.list.length == 0) {
				alert_warning("当前未生成结果")
				return
			}
			for (let item of this.list) {
				if (!item.pre_video) {
					continue
				}
				const promise = _this.getImgArrayBuffer(item.pre_video).then(data => {
					// 下载文件, 并存成ArrayBuffer对象(blob)
					const a = document.createElement('a')
					document.body.appendChild(a)
					a.style.display = 'none'
					// 使用获取到的blob对象创建的url
					const url = window.URL.createObjectURL(data)
					a.href = url
					if (!app.isBlank(item.prompt)) {
						a.download = `${item.prompt}.mp4`
					} else {
						var name = item.pre_video.split('/').pop().split('?')[0];
						a.download = name
					}
					// 指定下载的文件名

					a.click()
					document.body.removeChild(a)
					// 移除blob对象的url
					window.URL.revokeObjectURL(url)
				});

			}
		},

		async batchGenerate() {
			if (this.isContinue) {
				alert_warning("有任务生成中!")
				return
			}
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].isContinue) {
					alert_warning("有任务生成中!")
					return
				}
			}
			$("#batchLoading").click()
			this.isContinue = true
			this.progress = 0
			var startNum = 1;
			var endNum = this.list.length
			try {
			 if(isNaN(this.startIndex)){
			 	startNum=this.startIndex.split('-')[0]
				endNum = this.startIndex.split('-')[1]
				 if(isNaN(startNum)){
					 startNum = 1;
				 }
				 if(isNaN(endNum)){
				 	 endNum = this.list.length;
				 }
			 }
			} catch (err) {
			  alert_error("起止编号设置有误")
			}
			
			
			if (isNaN(startNum) || startNum <= 1) {
				startNum = 1
			}

			if (startNum >= this.list.length) {
				startNum = this.list.length
			}
			
			if (isNaN(endNum) || endNum < startNum) {
				endNum = startNum
			}
			
			if (endNum >= this.list.length) {
				endNum = this.list.length
			}
			

			/* task5.1 */
			for (var i = startNum - 1; i < endNum; i++) {
				console.log(endNum)				
				await this.generateImage(this.list[i], 1, i)

			}
			this.isContinue = true

		},
		async cancelTask() {
			this.isContinue = false
			const response = await fetch(app.base_path_contact_system + "/comfyui/interrupt", {
				method: 'post'
			});
			if (response.ok) {
				clearInterval(this.interval);
				alert_success("取消成功！")

			} else {
				throw new Error(`取消失败: ${response.status}`);
			}
			$("#cancelProgress").click()
			this.resetProgress()
		},
		deleteItem(item, index) {
			var canRemove = true
			if (this.isContinue) {
				canRemove = false
				alert_warning("有任务生成中!")
				return
			}
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].isContinue) {
					alert_warning("有任务生成中!")
					canRemove = false
					return
				}
			}
			if (canRemove) {
				/* 重数组中删除数据 */
				this.list.splice(index, 1);
			}
		},
		editPrompt(data, type) {
			var that = this
			that.type = type
			if (type == 1) {
				that.objectData = data
			} else {
				that.objectData = {
					prompt: "",
					pre_image: "img/bg_image_1.png",
					image_width: 100,
					image_height: 100,
					referenceImage: null,
					referenceVideo: null,
					prompVisiable: false,
					pre_video: null,
					isContinue: false
				}
				if (that.globalReference && that.globalReference != null && that.globalReference != 'null') {
					that.objectData.referenceImage = that.globalReference
				}
				if (that.globalReferenceVideo && that.globalReferenceVideo != null && that
					.globalReferenceVideo != 'null') {
					that.objectData.referenceVideo = that.globalReferenceVideo
				}
				// 对每个元素执行操作
				that.list.push(that.objectData)
			}


		},
		addPrompt() {
			if (this.type == 0) {
				this.list.push(this.objectData)
			}
		},
		async generateImage(data, isbatch, taskIndex) {

			try {
				var that = this
				var response = null
				var res_data = null
				if (!data.referenceImage) {
					console.log("未上传参考图！")
				}
				if (!data.referenceVideo) {
					setTimeout(function() {
						var button = document.getElementById('cancelProgress');
						button.click();
						alert_warning("请上传参视频")
					}, 1000)

					return
				}
				data.isContinue = true
				var Imagename = null
				let name = null

				Imagename = data.referenceImage.split('/').pop().split('?')[0];
				Imagename = encodeURI(Imagename);
				let video = null;
				var Videoname = data.referenceVideo.split('/').pop().split('?')[0];
				Videoname = encodeURI(Videoname);

				if (that.defaultSource == 1) {
					name = that.upload2RH(Imagename, that.apiKey)
					video = that.upload2RH(Videoname, that.apiKey)
				} else if (that.defaultSource == 0 || that.defaultSource == 2) {
					name = await that.uploadImageToComfyUI(data.referenceImage, Imagename);
					video = await that.uploadVideoToComfyUI(data.referenceVideo, Videoname);
				}



				var width = data.width
				var height = data.height
				var seed = data.seed
				var w = null;
				var h = null;
				var s = null;
				var l = null;
				var Sk = null;
				if (data.length) {
					l = data.length
				} else {
					l = that.length
				}


				if (data.skip) {
					Sk = data.skip
				} else {
					Sk = that.skip
				}
				if (width) {
					w = width
				} else {
					w = that.width
				}
				if (height) {
					h = height
				} else {
					h = that.height
				}
				if (seed) {
					s = seed
				} else {
					s = that.seed
				}



				console.log(`时长为：${l}`)
				var itemPrompt = data.prompt
				if (!app.isBlank(this.globalPrompt2)) {
					itemPrompt = this.globalPrompt2.concat(",", itemPrompt);
				}
				if (!app.isBlank(this.globalPrompt1)) {
					itemPrompt = this.globalPrompt1.concat(",", itemPrompt);
				}
				console.log(itemPrompt)
				that.validAdvace(data)

				if (that.defaultSource == 1) {
					response = await fetch(app.base_path_contact_system + "/comfyui/rhprompt", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							"nodeInfoList": that.generateWorkFlow(itemPrompt, name, video,
								s, that
								.totalSteps, w, h, l, Sk, that.blocks_to_swap, data
								.param1,
								data.param2, data.param3, data.param4, data.param5),
							"workflowId": that.workflowId,
							"apiKey": that.apiKey,
							"taskIndex": taskIndex,
							"outputsNum": that.outputsNum
						}),
					});

					if (!response.ok) {
						console.log(`HTTP错误: ${response.status}`);
						data.isContinue = false
						return
					}

				} else if (that.defaultSource == 0 || that.defaultSource == 2) {
					response = await fetch(app.base_path_contact_system + "/comfyui/prompt", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						}, //prompt,name,video,seed,totalSteps,width,height,length,skip,blocks_to_swap
						body: JSON.stringify({
							prompt: that.generateWorkFlow(itemPrompt, name, video, s, that
								.totalSteps, w, h, l, Sk, that.blocks_to_swap, data
								.param1,
								data.param2, data.param3, data.param4, data.param5),
							"taskIndex": taskIndex,
							"outputsNum": that.outputsNum
						}),
					});

					if (!response.ok) {
						console.log(`HTTP错误: ${response.status}`);
						data.isContinue = false
						return
					}
				}
				response = await response.json();
				console.log(response)
				var taskKey = response.data

				console.log("taskKey:" + taskKey)
				if (app.isBlank(taskKey)) {
					data.isContinue = false					
					alert_error("非法参考")
					return
				}

				var resTaskListStr = localStorage.getItem("resTaskListrv2v");
				var resTaskList = null;
				if (app.isBlank(resTaskListStr) || JSON.parse(resTaskListStr).length == 0) {
					resTaskList = [];
				} else {
					resTaskList = JSON.parse(resTaskListStr);
				}
				resTaskList.push(taskKey);
				resTaskListStr = JSON.stringify(resTaskList);
				localStorage.setItem("resTaskListrv2v", resTaskListStr)




			} catch (error) {
				console.error('生成图片出错:', error);
				alert_error(`生成失败`);

			}
		},
		uploadGenerateRecords(data) {
			var jsonData = {}
			if (!app.isBlank(data.referenceImage)) {
				jsonData.referenceImage = data.referenceImage
			}
			if (!app.isBlank(data.referenceVideo)) {
				jsonData.referenceVideo = data.referenceVideo
			}
			$.ajax({
				url: app.base_path_contact_system + "/generateRecords/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					prompt: data.prompt,
					type: 1,
					url: data.pre_video,
					name: data.name,
					reference: JSON.stringify(jsonData)
				},

				success: function(response) {
					if (response.status == 200) {
						console.log("上传成功")
					} else {
						console.log("上传失败")
					}
				}

			})
		},
		async uploadFile2admin(fileUrl, ileName) {
			//todo test
			const response = await fetch(app.base_path_contact_system + "/downloadFileByurl", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fileUrl: fileUrl,
					fileName: ileName
				}),
			});
			// const response = await fetch(app.base_path_contact_system+`/downloadFileByurl?fileUrl=${fileUrl}&fileName=${ileName}`);
			if (!response.ok) {
				throw new Error(`获取进度失败: ${response.status}`);
			}

			const res = await response.json();
			if (res.status == 200) {
				return res.data
			} else {
				throw new Error(`获取进度失败: ${response.msg}`);
			}

		},

		setProgress(num) {
			this.progress = num
		},
		resetProgress() {
			this.progress = 0

		},
		generateRandomNumber() {
			var that = this
			var randomNum = '';
			for (var i = 0; i < 10; i++) {
				randomNum += Math.floor(Math.random() * 10);
			}
			that.seed = randomNum;
		},
		getData(e) {
			var that = this
			var file = e.target.files[0]; // 获取文件对象
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				var workbook = XLSX.read(data, {
					type: 'binary'
				});
				var firstSheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
				var worksheet = workbook.Sheets[firstSheetName]; // 获取工作表数据
				that.excelData = XLSX.utils.sheet_to_json(worksheet, {
					header: 1
				}); // 将工作表转换为JSON数组，header: 1表示第一行为标题行

			};
			reader.readAsBinaryString(file); // 以二进制字符串形式读取文件内容
		},
		async convertImageToBase64WithCanvas(url) {
			try {
				const response = await fetch(url);
				const blob = await response.blob();
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = () => {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						canvas.width = img.width;
						canvas.height = img.height;
						ctx.drawImage(img, 0, 0);
						const dataUrl = canvas.toDataURL('image/png'); // 可以改为 'image/jpeg' 根据需要
						resolve(dataUrl);
					};
					img.onerror = reject;
					const objectUrl = URL.createObjectURL(blob);
					img.src = objectUrl;
				});
			} catch (error) {
				console.error('Error converting image to base64:', error);
			}
		},
		async changeCulumDataByTemplete(item) {
			var that = this
			if (!that.taskTemlepte) {
				alert_error("未选择模板")
				return
			}
			const response = await fetch(app.base_path_contact_system + "/task/selectByTaskId", {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"taskId": that.taskTemlepte.taskId
				})
			});
			if (!response.ok) {
				throw new Error(`HTTP错误: ${response.status}`);
			}
			const responseData = await response.json();
			if (responseData.status == 200) {
				if (item == 0) {
					that.list = []
					for (var i = 0; i < responseData.data.length; i++) {

						var data = {
							prompt: "",
							pre_image: "img/bg_image_1.png",
							image_width: 100,
							image_height: 100,
							pre_video: null,
							referenceImage: responseData.data[i].url,
							referenceVideo: null,
							prompVisiable: false,
							isContinue: false
						}
						if (that.globalReferenceVideo && that.globalReferenceVideo != null && that
							.globalReferenceVideo != 'null') {
							data.referenceVideo = that.globalReferenceVideo
						}

						that.list.push(data)
						// 对每个元素执行操作

					}
				}
				if (item == 1) {
					for (var i = 0; i < responseData.data.length; i++) {
						var data = {
							prompt: "",
							pre_image: "img/bg_image_1.png",
							image_width: 100,
							image_height: 100,
							pre_video: null,
							referenceImage: responseData.data[i].url,
							referenceVideo: null,
							prompVisiable: false,
							isContinue: false
						}
						if (that.globalReferenceVideo && that.globalReferenceVideo != null && that
							.globalReferenceVideo != 'null') {
							data.referenceVideo = that.globalReferenceVideo
						}
						that.list.push(data)
						// 对每个元素执行操作

					}
				}
				if (item == 2) {
					var lenghtTempleteData = responseData.data.length
					var lenghtData = that.list.length
					if (lenghtTempleteData <= lenghtData) {
						for (var i = 0; i < lenghtTempleteData; i++) {
							that.list[i].referenceImage = responseData.data[i].url
							if (!that.list[i].referenceVideo) {
								that.list[i].referenceVideo = null
							}
							that.list[i].prompVisiable = false
							if (!that.list[i].referenceVideo && that.globalReferenceVideo && that
								.globalReferenceVideo != null && that.globalReferenceVideo != 'null') {
								that.list[i].referenceVideo = that.globalReferenceVideo
							}
						}
					} else {
						let count = 0
						for (var i = 0; i < lenghtData; i++) {

							that.list[i].referenceImage = responseData.data[i].url
							if (!that.list[i].referenceVideo) {
								that.list[i].referenceVideo = null
							}
							that.list[i].prompVisiable = false
							if (!that.list[i].referenceVideo && that.globalReferenceVideo && that
								.globalReferenceVideo != null && that.globalReferenceVideo != 'null') {
								that.list[i].referenceVideo = that.globalReferenceVideo
							}
							count = i + 1

						}
						for (var i = count; i < lenghtTempleteData; i++) {
							var data = {
								prompt: null,
								pre_image: "img/bg_image_1.png",
								image_width: 100,
								image_height: 100,
								pre_video: null,
								referenceImage: null,
								referenceVideo: null,
								prompVisiable: false,
								isContinue: false
							}

							data.referenceImage = responseData.data[i].url

							if (that.globalReferenceVideo && that.globalReferenceVideo != null && that
								.globalReferenceVideo != 'null') {
								data.referenceVideo = that.globalReferenceVideo
							}
							// 对每个元素执行操作
							that.list.push(data)
						}
					}

				}
			} else {
				alert_error("操作失败")
			}



		},
		changeCulumData(item) {
			var that = this
			that.prompts = []
			if (item == 0) {
				that.list = []
				that.prompts = that.excelData.map(row => row[that.columnIndex - 1]).slice(that.startRowNum - 1);
				for (var i = 0; i < that.prompts.length; i++) {
					var data = {
						prompt: that.prompts[i],
						pre_image: "img/bg_image_1.png",
						image_width: 100,
						image_height: 100,
						pre_video: null,
						referenceImage: null,
						referenceVideo: null,
						prompVisiable: false,
						isContinue: false
					}
					if (that.globalReference) {
						data.referenceImage = that.globalReference
					}
					if (that.globalReferenceVideo) {
						data.referenceVideo = that.globalReferenceVideo
					}
					// 对每个元素执行操作
					that.list.push(data)
				}
			}
			if (item == 1) {
				that.prompts = that.excelData.map(row => row[that.columnIndex - 1]).slice(that.startRowNum - 1);
				for (var i = 0; i < that.prompts.length; i++) {
					var data = {
						prompt: that.prompts[i],
						pre_image: "img/bg_image_1.png",
						image_width: 100,
						image_height: 100,
						pre_video: null,
						referenceImage: null,
						referenceVideo: null,
						prompVisiable: false,
						isContinue: false
					}
					if (that.globalReference) {
						data.referenceImage = that.globalReference
					}
					if (that.globalReferenceVideo) {
						data.referenceVideo = that.globalReferenceVideo
					}
					// 对每个元素执行操作
					that.list.push(data)
				}
			}
			if (item == 2) {
				that.prompts = that.excelData.map(row => row[that.columnIndex - 1]).slice(that.startRowNum - 1);
				var lenghtP = that.prompts.length
				var lenghtData = that.list.length
				if (lenghtData >= lenghtP) {
					for (var i = 0; i < lenghtP; i++) {
						that.list[i].prompt = that.prompts[i]
						that.list[i].prompVisiable = false
						if (!that.list[i].referenceImage && that.globalReference) {
							that.list[i].referenceImage = that.globalReference
						}
						if (!that.list[i].referenceVideo && that.globalReferenceVideo) {
							that.list[i].referenceVideo = that.globalReferenceVideo
						}
					}
				} else {
					var count = 0;
					for (var i = 0; i < lenghtData; i++) {
						count ++;
						that.list[i].prompt = that.prompts[i]
						that.list[i].prompVisiable = false
						if (!that.list[i].referenceImage && that.globalReference) {
							that.list[i].referenceImage = that.globalReference
						}
						if (!that.list[i].referenceVideo && that.globalReferenceVideo) {
							that.list[i].referenceVideo = that.globalReferenceVideo
						}
					}
					for (var i = 0; i < lenghtP - lenghtData; i++) {
						var data = {
							prompt: that.prompts[i+count],
							pre_image: "img/bg_image_1.png",
							image_width: 100,
							image_height: 100,
							pre_video: null,
							referenceImage: null,
							referenceVideo: null,
							prompVisiable: false,
							isContinue: false
						}
						if (that.globalReference) {
							data.referenceImage = that.globalReference
						}
						if (that.globalReferenceVideo) {
							data.referenceVideo = that.globalReferenceVideo
						}
						// 对每个元素执行操作
						that.list.push(data)
					}
				}

			}
			// 

		}, //prompt,name,video,seed,totalSteps,width,height,length,skip,blocks_to_swap
		validAdvace(data) {
			if (app.isBlank(data.param1)) {
				data.param1 = this.param1
			}
			if (app.isBlank(data.param2)) {
				data.param2 = this.param2
			}
			if (app.isBlank(data.param3)) {
				data.param3 = this.param3
			}
			if (app.isBlank(data.param4)) {
				data.param4 = this.param4
			}
			if (app.isBlank(data.param5)) {
				data.param5 = this.param5
			}
			data.param1 = this.isStringNumberAndConvertToInt(data.param1)
			data.param2 = this.isStringNumberAndConvertToInt(data.param2)
			data.param3 = this.isStringNumberAndConvertToInt(data.param3)
			data.param4 = this.isStringNumberAndConvertToInt(data.param4)
			data.param5 = this.isStringNumberAndConvertToInt(data.param5)

		},
		isStringNumberAndConvertToInt(str) {
			if (!isNaN(parseInt(str)) && isFinite(str)) {
				return parseInt(str);
			} else {
				return str; // 或者返回原字符串或抛出错误
			}
		},
		generateWorkFlow(prompt, name, video, seed, totalSteps, width, height, length, skip, blocks_to_swap,
			param1, param2, param3, param4, param5) {
			// var newapi = api.replace(/\\/g, "\\\\");
			var that = this

			var jsondata = that.apiFunction(prompt, name, video, seed, totalSteps, width, height, length, skip,
				blocks_to_swap, param1, param2, param3, param4, param5)

			return jsondata
		},
		previewImage(url) {
			window.open(url, '_blank');
		},

	}
})
