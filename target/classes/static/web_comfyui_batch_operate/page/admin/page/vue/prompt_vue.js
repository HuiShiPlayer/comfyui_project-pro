/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		currentTime: new Date().getTime(),
		name:null,
		param:"",
		/* 分页数据 */
		list:[],
		data:{
			classId:-1
		},
		classId:-1,
		total:20,
		pageNum:1,
		pages:2,
		className:null,
		classes:[],
		class:{},
		
		/* 操作类型 0添加操作，1修改操作*/
		type:0,
		uploadedImage:null
	},
	methods: {
		deleteImage(item){
			$.ajax({
					type:"post",
					url: app.base_path_contact_system + "/prompt/removeImage",
					data: item,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							item.tips=null;
							console.log("操作成功")
						} else {
							console.log("操纵失败")
						}
						
					}
				});
			
		},
		handleImageUpload(e){
			var that =this
			
			const file = e.target.files[0];
			if (file) {			    
				
				var formData = new FormData();
				formData.append('file', file)
				 $.ajax({
				        url: app.base_path_contact_system+"/upload", // 服务器端点URL
				        type: 'POST',
				        data: formData,
				        processData: false, // 告诉jQuery不要处理发送的数据
				        contentType: false, // 告诉jQuery不要设置Content-Type请求头
				        success: function (res) {
							if(res.status==200){
								that.data.tips =app.base_path_contact_system.split("admin")[0]+ res.data;
								$.ajax({
									type: "post",
									url: app.base_path_contact_system + "/prompt/update",
									data: that.data,
									/* 跨域操作开始 */
									xhrFields: {
										withCredentials: true
									},
									crossDomain: true,
									/* 跨域操作结束 */
									success: function(res) {
										if(res.status == 200){
											console.log("操作成功")
										} else {
											console.log("操纵失败")
										}
										
									}
								});
							}
				           
				        },
				        error: function (jqXHR, textStatus, errorThrown) {
							alert_error("文件上传失败")
				            console.log('Error uploading file');
				            console.log(textStatus + ': ' + errorThrown);
				        }
				    });
			}
		},
		selectImage(index,data){
			this.data =data
			$("#"+index+"_uploadImage").click()
			
		},
		updateClass(item){
			if(app.isBlank(item.name)){
				alert_error("请设置分类名称")
				return
			}
			var that =this
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/promptClass/update",
				data: item,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						main.select(1);
						main.getAllClasses()
						alert_success("操作成功")
					} else {
						alert_error("操纵失败")
					}
					
				}
			});
		},deleteClass(item,index){
			var that =this
			if(item.id==-1){
				that.classes.splice(index,1);
			}else{
				
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/promptClass/delete",
					data: item,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							that.classes.splice(index,1);
							main.select(1);
							alert_success("操作成功")
						} else {
							alert_error("操纵失败")
						}
						
					}
				});
			}
			
		},
		addRow(){
			var that =this
			var item={
				id:-1,
				name:null,
				
			}
			that.classes.unshift(item);
		},
		select: function(num) {
			main.search();
			main.pageNum = 1;
			/* 初始化分页插件 */
			$('#pagebox').html("");
			$('#pagebox').html('<div class="M-box1"  style="float: right; margin-top: 10px"></div>');
			$('.M-box1').pagination({
				totalData: main.total,
				pageCount: main.pages,
				coping: true,
				current: main.pageNum,
				callback: function(index) {
					main.search(index)
				}
			});
		},
		/*查询*/
		search: function(num) {
			var that = this;
			var data ={
				pageNum:num,
			}
			if(that.classId && that.classId!=-1){
				data.classId = that.classId
			}
			if(!app.isBlank(that.name)){
				data.name = that.name
			}
			
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/prompt/selectByPage",
				data: data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						that.list = res.data.records
						that.total = res.data.total;
						that.pageNum = res.data.current;
						that.pages = res.data.pages;
					} else {
						that.list = []
						that.total = 0;
						that.pageNum = 1;
						that.pages = 1;
					}
					
				}
			});
			
		},
		deleteItem(item,index){
			var that =this
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/prompt/delete",
				data: that.data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						main.select(1);
						alert_success("操作成功")
					} else {
						alert_error("操纵失败")
					}
					
				}
			});
		},
		setItem(item){
			this.data =item;
			if(!this.data.classId){
				this.data.classId=-1
			}
			this.type =1;
		},
		restform(){
			//重置数据
			this.data ={
				classId:-1
			};
			this.type =0;
		},saveData(){
			if(this.type == 0){//走添加ajax
				var that =this
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/prompt/insert",
					data: that.data,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							main.select(1);
							alert_success("操作成功")
						} else {
							alert_error("操纵失败")
						}
						
					}
				});
				
				
			}else{//走修改ajax
				var that =this
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/prompt/update",
					data: that.data,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							main.select(1);
							alert_success("操作成功")
							$("#cancelItem").click()
						} else {
							alert_error("操纵失败")
						}
						
					}
				});
				
				
			}
			
			
			
			
		},getAllClasses(){
			var that =this
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/promptClass/getAll",
				data: {},
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						that.classes = res.data
					} else {
						that.classes =[]
					}
					
				}
			});
		}
	}
})
main.select(1);
main.getAllClasses()
/*页码渲染*/
