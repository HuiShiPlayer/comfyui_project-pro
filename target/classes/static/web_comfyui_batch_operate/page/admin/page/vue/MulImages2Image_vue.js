/*同步Ajax*/
$.ajaxSetup({
	async: false
});
var uploadTocomfyUIImgs = {}
// eval(api);
var main = new Vue({
	el: "#main",
	data: {
		config8: "default",
		defaultSource: null,
		workflowId: null,
		apiKey: null,
		prompt_id: null,
		currentTime: new Date().getTime(),
		globalPrompt1: null,
		globalPrompt2: null,
		width: 720,
		height: 1280,
		totalSteps: 8,
		seed: 2025,
		isContinue: false,
		recordsName: "",
		records: [],

		taskName: null,

		startRowNum: 2,
		columnIndex: 2,
		excelData: {},
		prompts: [],
		/* todo v2 */
		globalReference1: null,
		globalReference2: null,
		globalReference3: null,
		list: [],
		objectData: {
			prompt: "",
			pre_image: "img/bg_image_1.png",
			image_width: 100,
			image_height: 100,
			referenceImage1: null,
			referenceImage2: null,
			referenceImage3: null,
			isContinue: false
		},
		interval: null,
		progress: 0,
		isContinue: false,
		outputsNum: null,
		api: null,
		apiFunction0: null,
		apiFunction1: null,
		apiFunction2: null,
		apiFunction3: null,

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
		var data = localStorage.getItem("mulImages2Image")
		if (data) {
			data = JSON.parse(data)
			this.globalPrompt1 = data.globalPrompt1
			this.globalPrompt2 = data.globalPrompt2
			this.width = data.width
			this.height = data.height
			this.seed = data.seed
			this.param1 = data.param1
			this.param2 = data.param2
			this.param3 = data.param3
			this.param4 = data.param4
			this.param5 = data.param5
			this.list = data.list
			this.globalReference1 = data.globalReference1
			this.globalReference2 = data.globalReference2
			this.globalReference3 = data.globalReference3
			this.startIndex = data.startIndex
			this.isContinue = data.isContinue
		}
		this.getDefaultConfig()
		this.getDefaultSource()
		this.getDefaultApiKey()
		var that = this;
		if (that.interval) {
			clearInterval(that.interval)
		}
		this.interval = setInterval(() => {
			that.checkTask();
		}, app.cycleTime)
	},
	/* task5.1 */
	beforeDestroy() {
		var that = this;
		clearInterval(that.interval)
		console.log("离开混合生图页面")
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
		globalReference1: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		globalReference2: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		globalReference3: {
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
		}
	},
	methods: {
		/* rule */
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
						if (res.data.resources && res.data.resources.length > 0) {
							that.globalReference1 = app.base_path_contact_system.split("admin")[0] +
								res.data.resources[0]
							that.updateReferenceImage(1)
						}
						if (res.data.resources && res.data.resources.length > 1) {
							that.globalReference2 = app.base_path_contact_system.split("admin")[0] +
								res.data.resources[1]
							that.updateReferenceImage(2)
						}
						if (res.data.resources && res.data.resources.length > 2) {
							that.globalReference3 = app.base_path_contact_system.split("admin")[0] +
								res.data.resources[2]
							that.updateReferenceImage(3)
						}
					} else {
						alert_warning(res.msg)
					}
				}
		
			})
		},
		getRources(count, resourceType) {
			//count 资产数量 resourceType类型 1图片 2音频
			var that = this;
			for (var i = 0; i < that.list.length; i++) {
				that.list[i].isContinue = true
				const reg = new RegExp(that.rule)
				var res = reg.test(that.list[i].prompt)
				$.ajax({
					url: app.base_path_contact_system + "/resourceLibrary/asyncResources",
					method: "POST", // 推荐使用 method 替代 type
					async: true, // 默认就是 true，可以省略
					data: {
						count: count,
						resourceType: resourceType,
						prompt: that.list[i].prompt,
						index: i
					},
					success: function(res) {
						/* 处理返回值 */
						var index = res.data.index
						that.list[index].prompt = res.data.prompt
						that.list[index].isContinue = false
						if (res.data.resources && res.data.resources.length > 0) {
							that.list[index].referenceImage1 = app.base_path_contact_system.split(
								"admin")[0] + res.data.resources[0]
						}
						if (res.data.resources && res.data.resources.length > 1) {
							that.list[index].referenceImage2 = app.base_path_contact_system.split(
								"admin")[0] + res.data.resources[1]
						}
						if (res.data.resources && res.data.resources.length > 2) {
							that.list[index].referenceImage3 = app.base_path_contact_system.split(
								"admin")[0] + res.data.resources[2]
						}
					}

				})
			}
		},
		/* task5.1 */
		checkTask() {
			console.log("checkTask MulI2I")
			var that = this
			var resTaskListStr = localStorage.getItem("resTaskListMuli2i");
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
									that.list[taskIndex].pre_image = objUrl
									that.list[taskIndex].isContinue = false
									var data = {
										prompt: that.list[taskIndex].prompt,
										type: 0,
										pre_image: objUrl,
										name: that.list[taskIndex].name,
									}
									if (that.list[taskIndex].referenceImage1) {
										data.referenceImage1 = that.list[taskIndex].referenceImage1
									}
									if (that.list[taskIndex].referenceImage2) {
										data.referenceImage2 = that.list[taskIndex].referenceImage2
									}
									if (that.list[taskIndex].referenceImage3) {
										data.referenceImage3 = that.list[taskIndex].referenceImage3
									}
									//上传记录
									that.uploadGenerateRecords(data)
									//数据更新
									const index = resTaskList.indexOf(taskKey);
									if (index !== -1) {
										resTaskList.splice(index, 1);
										resTaskListStr = JSON.stringify(resTaskList);
										localStorage.setItem("resTaskListMuli2i", resTaskListStr)
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
		getDefaultSource: function() {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/config/selectById",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id: 7
				},
				success: function(response) {
					if (response.status == 200) {
						if (response.data.url == "RunningHub") {
							that.defaultSource = 1
						} else if (response.data.url == "CloudPlatform") {
							that.defaultSource = 2
						} else if (response.data.url == "Comfyui") {
							that.defaultSource = 0
						}

					} else {
						alert_warning("未查到配置信息")
					}
				}

			})
		},
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
		getDefaultApiKey: function() {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/config/selectById",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id: 6
				},
				success: function(response) {
					if (response.status == 200) {
						that.apiKey = response.data.url

					} else {
						alert_warning("未查到配置信息")
					}
				}

			})
		},
		nextStep(stepNum) {
			$.ajax({
				url: app.base_path_contact_system + "/api/getDefalutApi",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					type: stepNum
				},
				success: function(response) {
					if (response.status == 200) {} else {
						alert_error("未设置相应的API")
						return
					}
				}
			})
			console.log("next step!")
			var nextData = []
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].pre_image && this.list[i].pre_image.indexOf("bg_image_1.png") === -1) {
					nextData.push(this.list[i].pre_image)
				}
			}
			var d = {
				list: nextData,
				width: this.width,
				height: this.height
			}
			if (stepNum == 4) {
				localStorage.setItem("singleInitData", JSON.stringify(d))
				localStorage.removeItem("singleImage2Image")
				window.location.href = app.base_path_admin_web + '/page/admin/index.html#/singleImage2Image'

			} else if (stepNum == 2) {
				localStorage.setItem("i2vInitData", JSON.stringify(d))
				localStorage.removeItem("i2v")
				window.location.href = app.base_path_admin_web + '/page/admin/index.html#/i2v'
			} else if (stepNum == 3) {
				localStorage.setItem("start2endInitData", JSON.stringify(d))
				localStorage.removeItem("start-end")
				window.location.href = app.base_path_admin_web + '/page/admin/index.html#/start-end'
			} else if (stepNum == 7) {
				localStorage.setItem("referenceImageAndfVideoInitData", JSON.stringify(d))
				localStorage.removeItem("referenceImageAndVideo")
				window.location.href = app.base_path_admin_web +
					'/page/admin/index.html#/referenceImageAndfVideo'
			} else if (stepNum == 8) {
				localStorage.setItem("digitalHumanInitData", JSON.stringify(d))
				localStorage.removeItem("digital_human")
				window.location.href = app.base_path_admin_web + '/page/admin/index.html#/digital_human'
			}


		},
		clearCache() {
			var resTaskListStr = localStorage.getItem("resTaskListMuli2i");
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
			localStorage.removeItem('resTaskListMuli2i');
			localStorage.removeItem("mulImages2Image")
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
				param1: this.param1,
				param2: this.param2,
				param3: this.param3,
				param4: this.param4,
				param5: this.param5,
				list: this.list,
				globalReference3: this.globalReference3,
				globalReference2: this.globalReference2,
				globalReference1: this.globalReference1,
				startIndex: this.startIndex
			}
			localStorage.setItem("mulImages2Image", JSON.stringify(data))
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

				if (that.list[i].pre_image != 'img/bg_image_1.png') {
					res.push(that.list[i].pre_image)
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
		changeSS(item) {
			if (isNaN(item.seed)) {
				item.seed = null
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
		getDefualtApi(type) {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/api/getDefalutApi",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					type: type
				},
				success: function(response) {
					if (response.status == 200) {
						that.outputsNum = response.data.outputsNum
						that.api = response.data.api
						that.defaultSource = response.data.classType
						that.workflowId = response.data.workflowId
						that.apiKey = response.data.apiKey
					} else {
						alert_error(response.msg)
					}
				}
			})

		},
		deleteGlobalImage(num) {
			if (num == 1) {
				this.globalReference1 = null
			}
			if (num == 2) {
				this.globalReference2 = null
			}
			if (num == 3) {
				this.globalReference3 = null
			}
		},
		deleteImage1(item) {
			item.referenceImage1 = null
		},
		deleteImage2(item) {
			item.referenceImage2 = null
		},
		deleteImage3(item) {
			item.referenceImage3 = null
		},
		async downloadIamge(url, name) {
			var that = this
			await that.convertImageToBase64WithCanvas(url).then(item => {
				let imageUrl = item
				let a = document.createElement("a"); // 生成一个a元素
				let event = new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					view: window
				}); // 创建一个单击事件
				a.download = name || "photo"; // 设置图片名称
				a.href = imageUrl; // 将生成的URL设置为a.href属性
				a.dispatchEvent(event); // 触发a的单击事件
			});


		},
		downloadImages() {
			if (this.list.length == 0) {
				alert_warning("当前未生成结果")
				return
			}
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].pre_image) {
					this.downloadIamge(this.list[i].pre_image, this.list[i].prompt)
				}

			}
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
					"url": item.pre_image,
					"type": 0
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
				type: 6,
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
		/* todo v2*/
		async generateImage(data, isbatch, taskIndex) {

			try {
				var that = this
				var response = null
				var res_data = null
				var imageCount = 0

				let Imagename1 = null;
				let name1 = null
				let Imagename2 = null;
				let name2 = null
				let Imagename3 = null;
				let name3 = null

				data.isContinue = true

				if (data.referenceImage1) {
					imageCount = imageCount + 1
					Imagename1 = data.referenceImage1.split('/').pop().split('?')[0];
					Imagename1 = encodeURI(Imagename1);

					if (that.defaultSource == 1) {
						name1 = that.upload2RH(Imagename1, that.apiKey)
					} else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if (uploadTocomfyUIImgs[data.referenceImage1]) {
							name1 = uploadTocomfyUIImgs[data.referenceImage1]
						} else {
							name1 = await that.uploadImageToComfyUI(data.referenceImage1, Imagename1);
							uploadTocomfyUIImgs[data.referenceImage1] = name1
						}
					}

				}
				if (data.referenceImage2) {
					imageCount = imageCount + 1
					Imagename2 = data.referenceImage2.split('/').pop().split('?')[0];
					Imagename2 = encodeURI(Imagename2);

					if (that.defaultSource == 1) {
						name2 = that.upload2RH(Imagename2, that.apiKey)
					} else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if (uploadTocomfyUIImgs[data.referenceImage2]) {
							name2 = uploadTocomfyUIImgs[data.referenceImage2]
						} else {
							name2 = await that.uploadImageToComfyUI(data.referenceImage2, Imagename2);
							uploadTocomfyUIImgs[data.referenceImage2] = name2
						}
					}
				}


				if (data.referenceImage3) {
					imageCount = imageCount + 1
					Imagename3 = data.referenceImage3.split('/').pop().split('?')[0];
					Imagename3 = encodeURI(Imagename3);
					if (that.defaultSource == 1) {
						name3 = that.upload2RH(Imagename3, that.apiKey)
					} else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if (uploadTocomfyUIImgs[data.referenceImage3]) {
							name3 = uploadTocomfyUIImgs[data.referenceImage3]
						} else {
							name3 = await that.uploadImageToComfyUI(data.referenceImage3, Imagename3);
							uploadTocomfyUIImgs[data.referenceImage3] = name3
						}
					}
				}

				console.log("imageCount 值为：" + imageCount)
				if (imageCount == 0) {
					console.log("调用文生图 API == Type0")
					that.getDefualtApi(0)
					if (!that.api) {
						setTimeout(function() {
							alert_warning("未设置单图API")
							$("#cancel-progress").click()
						}, 1000)
						return
					} else {
						eval(that.api)
						that.apiFunction0 = apiFunction
					}
				} else if (imageCount == 1) {
					console.log("调用单图生图 API == Type4")
					that.getDefualtApi(4)
					if (!that.api) {
						setTimeout(function() {
							alert_warning("未设置单图API")
							$("#cancel-progress").click()
						}, 1000)
						return
					} else {
						eval(that.api)
						that.apiFunction1 = apiFunction
					}
				} else if (imageCount == 2) {
					that.getDefualtApi(5)
					console.log("调用双图生图 API == Type5")
					if (!that.api) {
						setTimeout(function() {
							alert_warning("未设置双图API")
							$("#cancel-progress").click()
						}, 1000)
						return
					} else {
						eval(that.api)
						that.apiFunction2 = apiFunction
					}
				} else if (imageCount == 3) {
					that.getDefualtApi(6)
					console.log("调用三图生图 API == Type6")
					if (!that.api) {
						setTimeout(function() {
							alert_warning("未设置三图API")
							$("#cancel-progress").click()
						}, 1000)

						return
					} else {
						eval(that.api)
						that.apiFunction3 = apiFunction
					}
				}



				var width = data.width
				var height = data.height
				var seed = data.seed
				var w = null;
				var h = null;
				var s = null;
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
				var itemPrompt = data.prompt
				if (!app.isBlank(this.globalPrompt2)) {
					itemPrompt = this.globalPrompt2.concat(",", itemPrompt);
				}
				if (!app.isBlank(this.globalPrompt1)) {
					itemPrompt = this.globalPrompt1.concat(",", itemPrompt);
				}
				var apiFunctionRes = null;

				that.validAdvace(data)



				if (imageCount == 0) {
					apiFunctionRes = that.generateWorkFlow0(itemPrompt, s, that.totalSteps, w, h, data
						.param1, data.param2, data.param3, data.param4, data.param5)
				} else if (imageCount == 1) {
					if (name1) {
						apiFunctionRes = that.generateWorkFlow1(itemPrompt, s, that.totalSteps, w, h, name1,
							data.param1, data.param2, data.param3, data.param4, data.param5)
					} else if (name2) {
						apiFunctionRes = that.generateWorkFlow1(itemPrompt, s, that.totalSteps, w, h, name2,
							data.param1, data.param2, data.param3, data.param4, data.param5)
					} else if (name3) {
						apiFunctionRes = that.generateWorkFlow1(itemPrompt, s, that.totalSteps, w, h, name3,
							data.param1, data.param2, data.param3, data.param4, data.param5)
					}
				} else if (imageCount == 2) {
					if (!name1) {
						apiFunctionRes = that.generateWorkFlow2(itemPrompt, s, that.totalSteps, w, h, name2,
							name3, data.param1, data.param2, data.param3, data.param4, data.param5)
					} else if (!name2) {
						apiFunctionRes = that.generateWorkFlow2(itemPrompt, s, that.totalSteps, w, h, name1,
							name3, data.param1, data.param2, data.param3, data.param4, data.param5)
					} else if (!name3) {
						apiFunctionRes = that.generateWorkFlow2(itemPrompt, s, that.totalSteps, w, h, name1,
							name2, data.param1, data.param2, data.param3, data.param4, data.param5)
					}
				} else if (imageCount == 3) {
					apiFunctionRes = that.generateWorkFlow3(itemPrompt, s, that.totalSteps, w, h, name1,
						name2, name3, data.param1, data.param2, data.param3, data.param4, data.param5)
				}
				if (that.defaultSource == 1) {
					response = await fetch(app.base_path_contact_system + "/comfyui/rhprompt", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							"nodeInfoList": apiFunctionRes,
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
						},
						body: JSON.stringify({
							prompt: apiFunctionRes,
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

				var resTaskListStr = localStorage.getItem("resTaskListMuli2i");
				var resTaskList = null;
				if (app.isBlank(resTaskListStr) || JSON.parse(resTaskListStr).length == 0) {
					resTaskList = [];
				} else {
					resTaskList = JSON.parse(resTaskListStr);
				}
				resTaskList.push(taskKey);
				resTaskListStr = JSON.stringify(resTaskList);
				localStorage.setItem("resTaskListMuli2i", resTaskListStr)


			} catch (error) {
				console.error('生成图片出错:', error);
				alert_error(`生成失败`);

			}

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
			$("#cancel-progress").click()
			this.resetProgress()
		},
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
		generateWorkFlow0(prompt, seed, totalSteps, width, height, param1, param2, param3, param4,
			param5) { //todo v2

			var that = this

			var jsondata = that.apiFunction0(prompt, seed, totalSteps, width, height, param1, param2, param3,
				param4, param5)

			return jsondata
		},
		generateWorkFlow1(prompt, seed, totalSteps, width, height, name, param1, param2, param3, param4,
			param5) { //todo v2

			var that = this

			var jsondata = that.apiFunction1(prompt, seed, totalSteps, width, height, name, param1, param2,
				param3, param4, param5)

			return jsondata
		},
		generateWorkFlow2(prompt, seed, totalSteps, width, height, name1, name2, param1, param2, param3, param4,
			param5) { //todo v2

			var that = this

			var jsondata = that.apiFunction2(prompt, seed, totalSteps, width, height, name1, name2, param1,
				param2, param3, param4, param5)

			return jsondata
		},
		generateWorkFlow3(prompt, seed, totalSteps, width, height, name1, name2, name3, param1, param2, param3,
			param4, param5) { //todo v2

			var that = this

			var jsondata = that.apiFunction3(prompt, seed, totalSteps, width, height, name1, name2, name3,
				param1, param2, param3, param4, param5)

			return jsondata
		},
		uploadGenerateRecords(data) {
			/* todo v2 */
			var requestdata = {}
			if (data.referenceImage1) {
				requestdata.referenceImage1 = data.referenceImage1
			}
			if (data.referenceImage2) {
				requestdata.referenceImage2 = data.referenceImage2
			}
			if (data.referenceImage3) {
				requestdata.referenceImage3 = data.referenceImage3
			}

			$.ajax({
				url: app.base_path_contact_system + "/generateRecords/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					prompt: data.prompt,
					type: 0,
					url: data.pre_image,
					name: data.name,
					reference: JSON.stringify(requestdata)
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

		/* todo v2 */
		updateReferenceImage(num) {
			var that = this
			if (that.list.length == 0) {
				return
			}
			for (var i = 0; i < that.list.length; i++) {
				if (num == 1) {
					if (that.list[i].referenceImage1) {

					} else {
						if (that.globalReference1) {
							that.list[i].referenceImage1 = that.globalReference1
						}

					}
				}
				if (num == 2) {
					if (that.list[i].referenceImage2) {

					} else {
						if (that.globalReference2) {
							that.list[i].referenceImage2 = that.globalReference2
						}

					}
				}
				if (num == 3) {
					if (that.list[i].referenceImage3) {

					} else {
						if (that.globalReference3) {
							that.list[i].referenceImage3 = that.globalReference3
						}

					}
				}


			}
		},
		/* todo v2 */
		clickLocalGlobalImagesInput(num) {
			$("#handleGlobalImageUpload" + num).click()
		},
		clickLocalImagesInput() {
			$("#localImages").click()
		},
		getLocalImages(e) { //todo v2
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
									referenceImage1: app.base_path_contact_system.split(
										"admin")[0] + res.data,
									referenceImage2: null,
									referenceImage3: null,
									prompVisiable: false,
									isContinue: false
								}
								if (that.globalReference2) {
									objectData.referenceImage2 = that.globalReference2
								}
								if (that.globalReference3) {
									objectData.referenceImage3 = that.globalReference3
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
		},
		changeCulumData(item) { //todo v2
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
						referenceImage1: null,
						referenceImage2: null,
						referenceImage3: null,
						prompVisiable: false,
						isContinue: false
					}
					if (that.globalReference1) {
						data.referenceImage1 = that.globalReference1
					}
					if (that.globalReference2) {
						data.referenceImage2 = that.globalReference2
					}
					if (that.globalReference3) {
						data.referenceImage3 = that.globalReference3
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
						referenceImage1: null,
						referenceImage2: null,
						referenceImage3: null,
						prompVisiable: false,
						isContinue: false
					}
					if (that.globalReference1) {
						data.referenceImage1 = that.globalReference1
					}
					if (that.globalReference2) {
						data.referenceImage2 = that.globalReference2
					}
					if (that.globalReference3) {
						data.referenceImage3 = that.globalReference3
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
						if (!that.list[i].referenceImage1 && that.globalReference1) {
							that.list[i].referenceImage1 = that.globalReference1
						}
						if (!that.list[i].referenceImage2 && that.globalReference2) {
							that.list[i].referenceImage2 = that.globalReference2
						}
						if (!that.list[i].referenceImage3 && that.globalReference3) {
							that.list[i].referenceImage3 = that.globalReference3
						}
					}
				} else {
					var count = 0;
					for (var i = 0; i < lenghtData; i++) {
						count ++;
						that.list[i].prompt = that.prompts[i]
						that.list[i].prompVisiable = false
						if (!that.list[i].referenceImage1 && that.globalReference1) {
							that.list[i].referenceImage1 = that.globalReference1
						}
						if (!that.list[i].referenceImage2 && that.globalReference2) {
							that.list[i].referenceImage2 = that.globalReference2
						}
						if (!that.list[i].referenceImage3 && that.globalReference3) {
							that.list[i].referenceImage3 = that.globalReference3
						}
					}
					for (var i = 0; i < lenghtP - lenghtData; i++) {
						var data = {
							prompt: that.prompts[i+count],
							pre_image: "img/bg_image_1.png",
							image_width: 100,
							image_height: 100,
							referenceImage1: null,
							referenceImage2: null,
							referenceImage3: null,
							prompVisiable: false,
							isContinue: false
						}
						if (that.globalReference1) {
							data.referenceImage1 = that.globalReference1
						}
						if (that.globalReference2) {
							data.referenceImage2 = that.globalReference2
						}
						if (that.globalReference3) {
							data.referenceImage3 = that.globalReference3
						}
						// 对每个元素执行操作
						that.list.push(data)
					}
				}

			}
			// 

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
					type: 6
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
		/* todo v2 */
		handleGlobalImageUpload1(e) {
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
							that.globalReference1 = app.base_path_contact_system.split("admin")[0] +
								res.data;
							that.updateReferenceImage(1)
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
		handleGlobalImageUpload2(e) {
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
							that.globalReference2 = app.base_path_contact_system.split("admin")[0] +
								res.data;
							that.updateReferenceImage(2)
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
		handleGlobalImageUpload3(e) {
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
							that.globalReference3 = app.base_path_contact_system.split("admin")[0] +
								res.data;
							that.updateReferenceImage(3)
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
		handleImageUpload1(e) { //todo v2
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
							that.objectData.referenceImage1 = app.base_path_contact_system.split(
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
		handleImageUpload2(e) { //todo v2
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
							that.objectData.referenceImage2 = app.base_path_contact_system.split(
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
		handleImageUpload3(e) { //todo v2
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
							that.objectData.referenceImage3 = app.base_path_contact_system.split(
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
		selectImage(index, data, num) {
			this.objectData = data
			$("#" + index + "_uploadImage" + num).click()

		},
		/* todo v2 */
		addRow(type) {
			var that = this
			that.objectData = {
				prompt: "",
				pre_image: "img/bg_image_1.png",
				image_width: 100,
				image_height: 100,
				referenceImage1: null,
				referenceImage2: null,
				referenceImage3: null,
				prompVisiable: false,
				isContinue: false
			}
			if (that.globalReference1 && that.globalReference1 != null && that.globalReference1 != 'null') {
				that.objectData.referenceImage1 = that.globalReference1
			}
			if (that.globalReference2 && that.globalReference2 != null && that.globalReference2 != 'null') {
				that.objectData.referenceImage2 = that.globalReference2
			}
			if (that.globalReference3 && that.globalReference3 != null && that.globalReference3 != 'null') {
				that.objectData.referenceImage3 = that.globalReference3
			}
			// 对每个元素执行操作
			that.list.push(that.objectData)

		},
		generateRandomNumber() { //随机种子
			var that = this
			var randomNum = '';
			for (var i = 0; i < 10; i++) {
				randomNum += Math.floor(Math.random() * 10);
			}
			that.seed = randomNum;
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
		changeS() { //改变种子
			if (isNaN(this.seed)) {
				this.seed = 0

			}
		},
		previewImage(url) { //预览图片
			window.open(url, '_blank');
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
	}
})
