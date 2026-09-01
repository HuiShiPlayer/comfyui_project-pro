var titles = [{},{},{}];//表头
var xh_main = [[],[],[]];//表格中的字段
var isHaveImg_flag = [true,false,false]//是否勾选添加图片
var xh_list = [{'text':'颜色','isUse':false},{'text':'尺寸','isUse':false},{'text':'批次','isUse':false},{'text':'厂家','isUse':false}];//下拉框中的值
var bigID = '';//当点击 “+添加型号”按钮时，确定点击的是第几级参数
var parameter_data = {};//价格，库存，商品编号
var xh_topDiv_id = 0;//分级计数，共三级，xh_topDiv_id<=2

function append_xh_topDiv(){//添加型号分级
	alert_warning('当前版本不支持商品属性功能');
	return;
	clear_list();
	if(xh_topDiv_id >= 3){
		alert_warning('','只能添加3级参数分类');
		return false;
	}
	if(xh_topDiv_id != 0 && !isHaveTrue(xh_main[xh_topDiv_id-1])){
		alert_warning('','请先添加'+ (xh_topDiv_id) +'级参数内容后，再添加'+(xh_topDiv_id+1)+'级商品参数内容');
		return false;
	}
	$('#xh_topDiv-' + xh_topDiv_id++).css('display','block');
}

function xh_title_text(target) {//获取改分级的title，并更改table的title和更新下拉框
	var txt1 = $(target).html();
	var bid = '#' + $(target).parent().parent().parent().parent().parent().attr('id');
	$(bid + ' .dropdown-toggle font').html(txt1);
	var titleID = parseInt(bid.substr(bid.indexOf('-')+1));
	titles[titleID].text = txt1;
	for(var i=0;i<xh_list.length;i++){
		for(var j=0;j<titles.length;j++){
			if(xh_list[i].text == titles[j].text){
				xh_list[i].isUse = true;
				break;
			}else{
				xh_list[i].isUse = false;
			}
		}
	}
	clear_list();
	setTable_title();
}

function clear_list(){//设置型号列表分级title的下拉框里的值
	var listStr = '';
	for(var i=0;i<xh_list.length;i++){
		if(!xh_list[i].isUse){
			listStr += '<li class="li"><a href="javascript:void(0)" onclick="xh_title_text(this)">'+xh_list[i].text+'</a></li>';
		}
	}
	$('li').remove('.li');
	$('.xh_topDiv .divider').before(listStr);
}

function isChecked(val) {//参数==选择器，判断chenkbox是否勾选
	return $(val).is(':checked');
}

function xh_addParameter(target){//点击title下拉框里的 “自定义”
	$('#open_xh_addlist').trigger('click');
}

function xh_add_list(){//点击“自定义型号分类”弹出框中确认按钮
	var txt = $('#xh_list_key').val();
	xh_list.push({
		'text':txt,
		'isUse':false//判断改字段是否在其他下拉框中被引用
	});
	clear_list();
	$('#cancel2').trigger('click');
}

function xh_isHaveImg(target){//勾选  添加图片
	var bid = '#' + $(target).parent().parent().parent().attr('id');
	var titleID = parseInt(bid.substr(bid.indexOf('-')+1));
	if(isChecked(target)){
		isHaveImg_flag[titleID] = true;
		$(bid + ' .xh_box-02 img').css('display','block');
		$('.xh_box-04').css('display','block');
	}else{
		isHaveImg_flag[titleID] = false;
		$(bid + ' .xh_box-02 img').css('display','none');
		$('.xh_box-04').css('display','none');
	}
}
var liliNum = 0;
function xh_addmain(target){//点击  +添加型号
	bigID = '#' + $(target).parent().parent().attr('id');
	if($(bigID + ' .xh_title1 font').html() == '请选择'){
		alert_warning('','请先选择该参数的标题');
		return false;
	}
	$('#open_xh_addXH').trigger('click');
	var titleID = parseInt(bigID.substr(bigID.indexOf('-')+1));
	$('.xh_main_list').html('');
	for(var i=0;i<xh_main[titleID].length;i++){//循环 titleId 级的参数数组
		if(isHaveImg_flag[titleID]){//判断当前分级是否允许上传图片
			if(xh_main[titleID][i].img){//允许的情况下，是否含有已上传的图片
				$('#container01').html($('#seed_02').html());
				$('#container01 .imgType1_box').attr('id','uploadImgType3_'+titleID+'-'+i);
				$('#container01 .imgType1_box .img-box').attr('rel',xh_main[titleID][i].img);
				$('#container01 .imgType1_preview img').attr('src','https://'+xh_main[titleID][i].img);
				if(xh_main[titleID][i].isChecked){
					$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" checked="checked" value="'+xh_main[titleID][i].val+'">'+xh_main[titleID][i].val+'<div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div>'+$('#container01').html()+'</li>');
				}else{
					$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" value="'+xh_main[titleID][i].val+'">'+xh_main[titleID][i].val+'<div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div>'+$('#container01').html()+'</li>');
				}
				$('#container01').html('');
			}else{
				$('#container01').html($('#seed_01').html());
				$('#container01 .imgType1_box').attr('id','uploadImgType3_'+titleID+'-'+i);
				$('#container01 .imgType1_box .img-box').attr('rel','0');
				if(xh_main[titleID][i].isChecked){
					$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" checked="checked" value="'+xh_main[titleID][i].val+'">'+xh_main[titleID][i].val+'<div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div>'+$('#container01').html()+'</li>');
				}else{
					$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" value="'+xh_main[titleID][i].val+'">'+xh_main[titleID][i].val+'<div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div>'+$('#container01').html()+'</li>');
				}
				$('#container01').html('');
			}
		}else{
			if(xh_main[titleID][i].isChecked){
				$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" checked="checked" value="'+xh_main[titleID][i].val+'">'+xh_main[titleID][i].val+'<div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div></li>');
			}else{
				$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" value="'+xh_main[titleID][i].val+'">'+xh_main[titleID][i].val+'<div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div></li>');
			}
		}
	}
	
}

function xh_addXH(){//点击弹出框中的添加
	var txt = $('#xh_list_key1').val();
	if(txt.indexOf(' ') == -1 && txt != ''){
		var titleID = parseInt(bigID.substr(bigID.indexOf('-')+1));
		if(!isHaveImg_flag[titleID]){//判断是否有图片功能
			$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" value="'+txt+'"><span class="xh_title2">'+txt+'</span><div class="closeDIV" onclick="xh_closeXH(this)"><i class="icon-cancel fw"></i></div></li>');
		}else{
			$('#container01').html($('#seed_01').html());
			$('#container01 .imgType1_box').attr('id','uploadImgType3_'+ liliNum +'-plus');
			$('#container01 .imgType1_box .img-box').attr('rel','0');
			$('.xh_main_list').append('<li id="lili-'+(liliNum++)+'"><input type="checkbox" value="'+txt+'"><span class="xh_title2">'+txt+'</span><div class="closeDIV" onclick="xh_closeXH1(this)"><i class="icon-cancel fw"></i></div>'+$('#container01').html()+'</li>');
			$('#container01').html('');
		}
		$('#xh_list_key1').val('');
	}else{
		alert_warning('','添加的参数不要含有空格或为空');
	}
}


function xh_closeXH(target){//删除按钮
	var bid = '#' + $(target).parent().parent().parent().attr('id');
	var titleId = parseInt(bid.substr(bid.indexOf('-')+1));
	var txt = $(target).parent().find('.xh_box-03').html();
	for (var i = 0; i < xh_main[titleId].length; i++) {
		if(xh_main[titleId][i].val == txt){
			xh_main[titleId][i].isChecked = false;
			break;
		}
	}
	$(target).parent().remove();
	setTable_main();
}

function xh_closeXH1(target){//弹出框中的删除按钮，层级不同
	var bid = '#' + $(target).parent().attr('id');
	var titleId = parseInt(bid.substr(bid.indexOf('-')+1));
	var txt = $(target).parent().find('.xh_title2').html();
	for (var i = 0; i < xh_main[titleId].length; i++) {
		if(xh_main[titleId][i].val == txt){
			xh_main[titleId][i].isChecked = false;
			break;
		}
	}
	$(target).parent().remove();
	setTable_main();
}

var xh_num = 0;
function xh_add_XH(){//点击 “添加型号弹出窗” 确定按钮时触发
	var titleID = parseInt(bigID.substr(bigID.indexOf('-')+1));
	xh_main[titleID] = [];
	$('.xh_main_list input[type="checkbox"]').each(function(){
		xh_main[titleID].push({
			'val':$(this).val(),
			'isChecked':isChecked(this)
		});
	});
	
	//以下代码用于解决于如下场景：“弹出框每次被打开时都是重新绘制的，那么如何将已经上传图片的input-file还原”。
	var jj = 0;
	$('.xh_main_list input[type="file"]').each(function(){
		xh_main[titleID][jj].img = img_change(this,3);
		var rel = $(this).parent().find('.img-box').attr('rel');
		if(rel != 0 && rel != 1 && (xh_main[titleID][jj].img == undefined || xh_main[titleID][jj].img == null || xh_main[titleID][jj].img == '')){
			xh_main[titleID][jj].img = rel;
		}
		jj++;
	});
	jj = 0;
	put_param();
	$('#cancel3').trigger('click');
	setTable_main();
}
function setTable_title(){//设置表格表头
	var numm = 0;
	for(var i=0;i<titles.length;i++){
		if(titles[i].text != undefined && titles[i].text != null && titles[i].text != ''){
			titles[i].width = '1';
			numm++;
		}else{
			titles[i].width = '0';
		}
	}
	for(var i=0;i<titles.length;i++){
		if(titles[i].width == '1' && numm != 0){
			$('.xh_table_title-' + i).css('width',100/numm+'%');
			$('.xh_table_title-' + i).html(titles[i].text);
			$('.xh_table_title-' + i).css('display','block');
		}
	}
}

function isHaveTrue(data){//判断当前数组中，长度不为零并且其中 isChecked 属性不能全为false
	if(data.length == 0){
		return false;
	}
	for(var i=0;i<data.length;i++){
		if(data[i].isChecked){
			return true;
		}
	}
	return false;
}

function setTable_main(){//根据型号信息，设置table的内容
	var num0 = 1,num1 = 0,num2 = 0;
	var str = '';
	//下面这个三重for是根据型号信息层级排放具体的div
	for(var i=0;i<xh_main[0].length;i++){
		if(xh_main[0][i].isChecked){
			str += '<div class="xhMainTr">';
			str += '<div class="xhMainTdType0-'+i+'">'+xh_main[0][i].val+'</div>';
			if(!isHaveTrue(xh_main[1])){
				str += '<div class="xhMainValDiv_jiaGe"><input type="text" class="form-control" id="xhMainValjiaGe-'+i+'" /></div>';
				str += '<div class="xhMainValDiv_kuCun"><input type="text" class="form-control" onblur="ChangeKuCun(this)" id="xhMainValkuCun-'+i+'" /></div>';
				str += '<div class="xhMainValDiv_bianHao"><input type="text" class="form-control" id="xhMainValbianHao-'+i+'" /></div>';
				str += '<div class="xhMainValDiv_eWai"><input type="text" class="form-control" id="xhMainValeWai-'+i+'" /></div>';
			}else{
				for(var j=0;j<xh_main[1].length;j++){
					if(xh_main[1][j].isChecked){
						str += '<div class="xhMainTdType1-'+j+'">'+xh_main[1][j].val+'</div>';
						if(!isHaveTrue(xh_main[2])){
							str += '<div class="xhMainValDiv_jiaGe"><input type="text" class="form-control" id="xhMainValjiaGe-'+i+'_'+j+'" /></div>';
							str += '<div class="xhMainValDiv_kuCun"><input type="text" class="form-control" onblur="ChangeKuCun(this)" id="xhMainValkuCun-'+i+'_'+j+'" /></div>';
							str += '<div class="xhMainValDiv_bianHao"><input type="text" class="form-control" id="xhMainValbianHao-'+i+'_'+j+'" /></div>';
							str += '<div class="xhMainValDiv_eWai"><input type="text" class="form-control" id="xhMainValeWai-'+i+'_'+j+'" /></div>';
						}else{
							for(var k=0;k<xh_main[2].length;k++){
								if(xh_main[2][k].isChecked){
									str += '<div class="xhMainTdType2-'+j+'_'+k+'">'+xh_main[2][k].val+'</div>';
									str += '<div class="xhMainValDiv_jiaGe"><input type="text" class="form-control" id="xhMainValjiaGe-'+i+'_'+j+'_'+k+'" /></div>';
									str += '<div class="xhMainValDiv_kuCun"><input type="text" class="form-control" onblur="ChangeKuCun(this)" id="xhMainValkuCun-'+i+'_'+j+'_'+k+'" /></div>';
									str += '<div class="xhMainValDiv_bianHao"><input type="text" class="form-control" id="xhMainValbianHao-'+i+'_'+j+'_'+k+'" /></div>';
									str += '<div class="xhMainValDiv_eWai"><input type="text" class="form-control" id="xhMainValeWai-'+i+'_'+j+'_'+k+'" /></div>';
								}
							}
						}
					}
				}
			}
			str += '</div>';
		}
	}
	$('.xh_table_main').html(str);
	//计数   例如：共几级分类，每个分类下几个分支
	if(xh_main[2].length != 0){
		for(var i=0;i<xh_main[2].length;i++){
			if(xh_main[2][i].isChecked){
				num2++;
			}
		}
		if(num2 != 0){
			num0++;
		}else{
			num2 = 1;
		}
	}
	if(xh_main[1].length != 0){
		for(var i=0;i<xh_main[1].length;i++){
			if(xh_main[1][i].isChecked){
				num1++;
			}
		}
		if(num1 != 0){
			num0++;
		}else{
			num1 = 1;
		}
	}
	if(num1 == 0){num1 = 1;}//这几个计数需要相乘更改对应div的高度，但计数时可能为零，为了计算强制!=0
	if(num2 == 0){num2 = 1;}
	var heightVAR = 30;//最终节点的div的高度
	var widthVAR = 70;//根据分级有多少级，确定每个DIV的宽度，当只有两级分类时：70% / 2 = 35%
	$('.xh_table_main [class^=xhMainValDiv_]').css({
		'height':heightVAR + 'px'
	});
	$('.xh_table_main [class^=xhMainTdType2-]').css({
		'height':heightVAR + 'px',
		'line-height':heightVAR + 'px'
	});
	$('.xh_table_main [class^=xhMainTdType1-]').css({
		'height':num2 * heightVAR + 'px',
		'line-height':num2 * heightVAR + 'px'
	});
	$('.xh_table_main [class^=xhMainTdType0-]').css({
		'height':num1 * num2 * heightVAR + 'px',
		'line-height':num1 * num2 * heightVAR + 'px'
	});
	$('.xh_table_main [class^=xhMainTdType]').css('width',widthVAR/num0+'%');
}

function isNumber(num){
	var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
	return reg.test(num);
}

function getParameter_data(){//获取 各个型号的价格、库存，商品编号
	parameter_data = {};
	var t1 = [],t2 = [],t3 = [],t4 = [],t0 = [],boo = true;
	$('[id^="xhMainValjiaGe-"]').each(function(){
		if(isNumber($(this).val())){
			t1.push($(this).val());
			t0.push($(this).attr('id').substr(($(this).attr('id').indexOf('-')+1)));
		}else{
			boo = false;
			return boo;
		}
	});
	if(!boo){
		return false;
	}
	$('[id^="xhMainValkuCun-"]').each(function(){
		if(isNumber($(this).val())){
			t2.push($(this).val());
		}else{
			boo = false;
			return boo;
		}
	});
	if(!boo){
		return false;
	}
	$('[id^="xhMainValbianHao-"]').each(function(){
		t3.push($(this).val());
	});
	$('[id^="xhMainValeWai-"]').each(function(){
		if(isNumber($(this).val())){
			t4.push($(this).val());
		}else{
			boo = false;
			return boo;
		}
	});
	if(!boo){
		return false;
	}
	for(var i=0;i<t0.length;i++){
		parameter_data[t0[i]]={'pice':t1[i],'stock':t2[i],'code':t3[i],'cost':t4[i]}
	}
	console.log(parameter_data);
	return boo;
}

function put_param(){//将弹出框中填写好的信息放到网页中（判断是否含有图片信息）
	for (var i = 0; i < xh_main.length; i++) {
		$('#xh_topDiv-' + i +' .xh_main').html($('#xh_topDiv-' + i + ' .xh_main .xh_addmain').clone());
		for (var j = 0; j < xh_main[i].length; j++) {
			if(xh_main[i][j].isChecked){
				if(i != 0){
					$('#xh_topDiv-' + i + ' .xh_main .xh_addmain').before('<div class="xh_box-02"><div class="closeDIV" onclick="xh_closeXH(this)"><i class="icon-cancel fw"></i></div>'+xh_main[i][j].val+'</div>');
				}else{
					if(xh_main[i][j].img){
						$('#xh_topDiv-' + i + ' .xh_main .xh_addmain').before('<div class="xh_box-02"><div class="closeDIV" onclick="xh_closeXH(this)"><i class="icon-cancel fw"></i></div>'+xh_main[i][j].val+'<img src="https://'+xh_main[i][j].img+'" /></div>');
					}else{
						$('#xh_topDiv-' + i + ' .xh_main .xh_addmain').before('<div class="xh_box-02"><div class="closeDIV" onclick="xh_closeXH(this)"><i class="icon-cancel fw"></i></div>'+xh_main[i][j].val+'<br /><img src="img/nullImg.jpg"/></div>');
					}
				}
			}
		}
		if(isHaveImg_flag[0]){
			$('.xh_box-02 img').css('display','block');
			$('.xh_box-04').css('display','block');
		}else{
			$('.xh_box-02 img').css('display','none');
			$('.xh_box-04').css('display','none');
		}
	}
}
//更新属性库存的时候 更新主库存
function ChangeKuCun(item){
	var cu = item.value;
	if(isNaN(cu)){
		if(!(cu%1 === 0 && cu >= 0)){
			item.value = 0;
			alert_warning('库存需输入整数');
			return;
		}		
	}
	productinfo.productinfo.stock = productinfo.productinfo.stock*1 + cu*1;
}
