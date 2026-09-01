$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('macarons'));

    var option = {
        color : [
            'rgba(236, 101, 56, 0.9)',
            'rgba(105, 173, 25, 0.9)',
            'rgba(209, 169, 69, 0.9)',
            'rgba(122, 156, 46, 0.9)',
            'rgba(48, 156, 82, 0.9)',


        ],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show : true,
        },
        legend: {
            x:'right',
            itemWidth: 10,
            itemHeight: 10,
            data : ['超算机房','云机房','数据中心','智能控制器','其他'],
            textStyle: {
                color: '#fff',        // 图例文字颜色
                fontFamily:'微软雅黑',
            }

        },
        series : [
            {
                name:'业务指标',
                type:'gauge',
                center: ['25%','55%'],
                splitNumber: 5,       // 分割段数，默认为5
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']],
                        width: 3
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 15,   // 每份split细分多少段
                    length :5,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    show: true,        // 默认显示，属性show控制显示与否
                    length :10,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer : {
                    width : 3
                },
                title : {
                    show : true,
                    offsetCenter: [0, '-30%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color:'#fff',
                        fontSize:'12',
                        fontFamily:'微软雅黑'
                    }
                },
                detail : {
                    formatter:'{value}%',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontWeight: 'bolder',
                        fontSize:'18',
                        fontFamily:'微软雅黑'
                    }
                },
                data:[{value: 80, name: '完成率'}]
            },
            {
                name:'预期',
                type:'funnel',
                x: '45%',
                width: '45%',
                itemStyle: {
                    normal: {
                        label: {
                            formatter: '{b}预期',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color:'#fff',
                                fontSize:'12',
                                fontFamily:'微软雅黑'
                            }
                        },
                        labelLine: {
                            show : false
                        }
                    },
                    emphasis: {
                        label: {
                            position:'inside',
                            formatter: '{b}预期 : {c}%',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color:'#fff',
                                fontSize:'12',
                                fontFamily:'微软雅黑'
                            }
                        }
                    }
                },
                data:[
                    {value:100, name:'超算机房'},
                    {value:80, name:'云机房'},
                    {value:60, name:'数据中心'},
                    {value:40, name:'智能控制器'},
                    {value:20, name:'其他'}
                ]
            },
            {
                name:'实际',
                type:'funnel',
                x: '45%',
                width: '45%',
                maxSize: '80%',
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 2,
                        label: {
                            position: 'inside',
                            formatter: '{c}%',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color:'#fff',
                                fontSize:'12',
                                fontFamily:'微软雅黑'
                            }
                        }
                    },
                    emphasis: {
                        label: {
                            position:'inside',
                            formatter: '{b}实际 : {c}%'
                        }
                    }
                },
                data:[
                    {value:80, name:'超算机房'},
                    {value:50, name:'云机房'},
                    {value:30, name:'数据中心'},
                    {value:20, name:'智能控制器'},
                    {value:5, name:'其他'}
                ]
            }
        ]
    };



    // 为echarts对象加载数据
    myChart.setOption(option);

})

