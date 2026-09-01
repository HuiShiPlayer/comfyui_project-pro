package com.zyz.common;


import com.zyz.bo.NodeInfo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ComfyUIToRunningHub {


    private static final Pattern PLACEHOLDER_PATTERN = Pattern.compile("###\\{\\{\\[\\[(.*?)\\]\\]\\}\\}###");

    public static List<NodeInfo> convert(String comfyuiJson) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(comfyuiJson);
        List<NodeInfo> result = new ArrayList<>();
        // 遍历根节点的所有字段（节点ID）
        root.fields().forEachRemaining(entry -> {
            String nodeId = entry.getKey();
            JsonNode node = entry.getValue();
            JsonNode inputs = node.get("inputs");
            if (inputs != null && inputs.isObject()) {
                inputs.fields().forEachRemaining(inputEntry -> {
                    String fieldName = inputEntry.getKey();
                    JsonNode valueNode = inputEntry.getValue();
                    if (valueNode.isTextual()) {
                        String value = valueNode.asText();
                        Matcher matcher = PLACEHOLDER_PATTERN.matcher(value);
                        if (matcher.matches()) {
                            String variableName = value;
                            NodeInfo info = new NodeInfo();
                            info.setNodeId(nodeId);
                            info.setFieldName(fieldName);
                            info.setFieldValue(variableName); // 或者空字符串
                            result.add(info);
                        }
                    }
                });
            }
        });
        return result;
    }


}
