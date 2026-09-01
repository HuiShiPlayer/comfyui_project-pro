$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('main'));

    var option = {
        title : {
            text: '大布局面积图',
            textStyle: {
                fontFamily: 'microsoft yahei',
                fontWeight: '300',
                color: '#333'          // 主标题文字颜色
            }

        },


        tooltip : {

            trigger: 'axis',

        },
        calculable : true,
        splitLine:{show: false},

        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日'],
                splitLine:{show: false}
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'成交',
                type:'line',
                smooth:true,
                color:'red',
                itemStyle : {
                    normal : {
                        areaStyle: {color: 'rgba(131,184,236,0.6)'},
                        color:'#4488bb',
                        label : {
                            show : true,
                            position : 'top',
                            textStyle : {
                                color:'#000'
                            }
                        },
                        lineStyle:{
                            width:'2',
                            color:'#4488bb'
                        }
                    }
                },
                data:[10, 12, 21, 54, 260, 830, 710]
            }
        ]
    };


    // 为echarts对象加载数据
    myChart.setOption(option);

})