$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('lineyancao'));

    var option = {
        backgroundColor: '#1b1b1b',
        tooltip : {
            trigger: 'axis'
        },

        calculable : true,
        legend: {
            itemWidth: 10,
            itemHeight: 10,
            x : 'right',
            data:['去年销售量','今年销售量','平均销售量'],
            textStyle: {
                color: '#fff' ,       // 图例文字颜色
                fontFamily:'微软雅黑',
            }
        },
        grid: {//其中(x,y)针对左上角图的位置调整，(x2,y2)针对左下角。
            y: 70,
            x:75,

            borderWidth:0//此处去掉那个白色边框
        },
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                axisLabel : {
                    textStyle: {
                        color: '#fff',
                        fontFamily:'微软雅黑',
                    }
                },
                splitLine:{show: false},
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '销售额',
                axisLine:{ lineStyle:{ color:'#266b73' } },
                axisLabel : {
                    formatter: '{value} 万元',
                    textStyle: {
                        color: '#fff',
                        fontFamily:'微软雅黑',
                    }
                },
                splitLine:{
                    lineStyle:{
                        width:1,
                        color:'#6a6a6a',
                        type:'dotted'  //'dotted'虚线 'solid'实线
                    }
                },
            },
            {
                type : 'value',
                name : '销售量',
                axisLabel : {
                    formatter: '{value} 笔',
                    textStyle: {
                        color: '#fff',
                        fontFamily:'微软雅黑',
                    }
                },
                axisLine:{ lineStyle:{ color:'transparent' } },
                splitLine:{show: false},
            }
        ],
        series : [

            {
                name:'去年销售量',
                type:'bar',
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                itemStyle: {normal: {color:'#ff906b'}},
            },
            {
                name:'今年销售量',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                itemStyle: {normal: {color:'#b0e76f'}},
            },
            {
                name:'平均销售量',
                type:'line',
                yAxisIndex: 1,
                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                itemStyle: {normal: {color:'#fad860'}},
            }
        ]
    };




    // 为echarts对象加载数据
    myChart.setOption(option);

})