package com.zyz.common;

import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TaskCache {
    public  static  List<JSONObject> undoTasksPool = Collections.synchronizedList(new ArrayList<>());;
    public  static  List<JSONObject> runningTasksPool = Collections.synchronizedList(new ArrayList<>());;
    public  static  List<JSONObject> completeTasksPool = Collections.synchronizedList(new ArrayList<>());;

}
