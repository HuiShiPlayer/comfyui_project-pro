$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('line-column'));

    var option = {

        title : {
            text: '某地区蒸发量和降水量',
            textStyle: {
                fontFamily: 'microsoft yahei',
                fontWeight: '300',
                color: '#333'          // 主标题文字颜色
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        legend: {
            data:['蒸发量','降水量','平均温度'],
            y:'20px'
        },
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '水量',
                axisLabel : {
                    formatter: '{value} ml'
                }
            },
            {
                type : 'value',
                name : '温度',
                axisLabel : {
                    formatter: '{value} °C'
                }
            }
        ],
        series : [

            {
                name:'蒸发量',
                type:'bar',
                barWidth : 20,//柱图宽度
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                itemStyle: {
                    normal: {
                        color:'#13b9dd'
                    }
                }

            },
            {
                name:'降水量',
                type:'bar',
                barWidth : 20,//柱图宽度
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                itemStyle: {
                    normal: {
                        color: '#7077b7'
                    }
                }
            },
            {
                name:'平均温度',
                type:'line',
                yAxisIndex: 1,
                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                itemStyle : {
                    normal : {
                        color:'#fb9678',
                        label : {
                            show : true,
                            formatter : '{b}：{c}',
                            position : 'top',
                            textStyle : {
                                fontWeight : '700',
                                fontSize : '12',
                                color:'#fb9678'
                            }
                        },
                        lineStyle:{
                            color:'#fb9678'
                        }
                    }
                }
            }
        ]
    };




    // 为echarts对象加载数据
    myChart.setOption(option);

})