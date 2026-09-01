$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('ring'));

    var option = {
        title : {
            text: '大布局环形图',
            textStyle: {
                fontFamily: 'microsoft yahei',
                fontWeight: '300',
                color: '#333'          // 主标题文字颜色
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['#d2e5f1', '#8e94c6'],
        legend: {
            orient : 'vertical',
            x : 'left',
            y:'260',
            data:['总容量','已使用比例'],
        },
        calculable : false,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : ['50%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '18',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },

                data:[
                    {value:395, name:'总容量'},
                    {value:203, name:'已使用比例'},
                ]
            }
        ]
    };



    // 为echarts对象加载数据
    myChart.setOption(option);

})