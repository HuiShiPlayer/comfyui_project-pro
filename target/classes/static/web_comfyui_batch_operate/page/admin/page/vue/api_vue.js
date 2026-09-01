/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		//prompt,name,video,seed,totalSteps,width,height,length1,skip1,maskP1,length2,skip2,maskP2,blocks_to_swap,referenceAudio1,referenceAudio2
		name:null,
		/* 分页数据 */
		list:[],
		data:{},
		total:1,
		pageNum:1,
		pages:1,
		
		/* 操作类型 0添加操作，1修改操作*/
		type:0,
		classType:-1,
		source:-1,
		
		apifile:null
		
	},
	methods: {
		getData(e){
			var that =this
			var file = e.target.files[0]; // 获取文件对象
			that.apifile = file;
		},
		synchronizeData(){
			var that =this;
			if(!that.apifile){
				alert_error("请上传API数据文件")
				return
			}
			const file = that.apifile;
			if (file) {			    
				var formData = new FormData();
				formData.append('file', file)
				 $.ajax({
				        url: app.base_path_contact_system+"/api/synchronizeData", // 服务器端点URL
				        type: 'POST',
				        data: formData,
				        processData: false, // 告诉jQuery不要处理发送的数据
				        contentType: false, // 告诉jQuery不要设置Content-Type请求头
				        success: function (res) {
							if(res.status==200){
								alert_success(res.msg)
								$("#synchronizeDataFrame"),click()
							}else{
								alert_error(res.msg)
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
		addApi(){
			sessionStorage.setItem("type",0)
			window.open(app.base_path_admin_web + '/page/admin/page/api_edit.html')			
		},updateApi(item){
			sessionStorage.setItem("type",1)
			sessionStorage.setItem("api",JSON.stringify(item))
			window.open(app.base_path_admin_web + '/page/admin/page/api_edit.html')			
		},
		updateDefault(item,status){
			var that =this
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/updateDefaultStatus",
				data: {
					id:item.id,
					status:status,
					type:item.type,
					classType:item.classType
				},
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						item.isDefault = status
						that.search(that.pageNum);
						alert_success("修改成功")
					} else {
						alert_warning("修改失败")
					}
					
				}
			});
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
			if(!app.isBlank(that.name)){
				data.name = that.name
			}
			if(that.classType != -1){
				data.type = that.classType
			}
			data.classType=that.source
			/* 初始化假数据 */
			
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/selectByPage",
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
		deleteItem(){
			var that =this
			/* 重数组中删除数据 */
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/delete",
				data: that.data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						that.select(1);
						alert_success("操作成功")
					} else {
						alert_error("操作失败")
					}
					
				}
			});
			// this.list.splice(index,1);
		},
		setItem(item){
			this.data =item;
			this.type =1;
		},
		restform(){
			//重置数据
			this.data ={
				type:-1,
				isDefault:0
			};
			this.type =0;
		},saveData(){
			var that =this
			if(app.isBlank(that.data.name) ){
				alert_warning("请填写名称")
				return
			}
			if(!that.data.outputsNum ){
				alert_warning("请填写输出编号")
				return
			}
			if(app.isBlank(that.data.api) ){
				alert_warning("请填写api")
				return
			}
			if( that.data.type == -1){
				alert_warning("请填写类型")
				return
			}
			that.data.startWords = that.startWords[that.data.type]
			that.data.endWords = that.endWords
			
			if(this.type == 0){//走添加ajax
				
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/api/insert",
					data: that.data,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							$("#cancel").click()
							that.select(1);
							alert_success("操作成功")
						} else {
							alert_error("操作失败")
						}
						
					}
				});
			}else{//走修改ajax
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/api/update",
					data: that.data,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							$("#cancel").click()
							that.select(1);
							alert_success("操作成功")
						} else {
							alert_error("操作失败")
						}
						
					}
				});
			}
			
			
		}
	}
})
main.select(1);
/*页码渲染*/
