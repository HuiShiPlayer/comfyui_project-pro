package com.zyz.util;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Pattern;
public class UrlFileExtensionUtil {
    // 匹配URL中查询参数（?开头）和锚点（#开头）的正则
    private static final Pattern QUERY_OR_ANCHOR_PATTERN = Pattern.compile("[?#].*");

    /**
     * 获取URL对应的文件后缀名（小写，不含小数点）
     * @param urlStr URL字符串（例如：https://example.com/file.tar.gz?param=1）
     * @return 文件后缀名（如gz）；无后缀返回空字符串
     * @throws MalformedURLException URL格式错误时抛出
     */
    public static String getUrlFileExtension(String urlStr) throws MalformedURLException {
        // 1. 解析URL，获取路径部分
        URL url = new URL(urlStr);
        String path = url.getPath(); // 例如：/file.tar.gz

        // 2. 去除路径中的查询参数和锚点（防止路径带?/#干扰）
        path = QUERY_OR_ANCHOR_PATTERN.matcher(path).replaceAll("");

        // 3. 处理空路径/目录路径（无文件名）
        if (path.isEmpty() || path.endsWith("/")) {
            return "";
        }

        // 4. 提取文件名（路径最后一个/后的部分）
        String fileName = path.substring(path.lastIndexOf("/") + 1); // 例如：file.tar.gz

        // 5. 提取后缀名（最后一个.后的部分，且.不能是第一个字符）
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex <= 0 || lastDotIndex == fileName.length() - 1) {
            // 无. / .在开头（如.file） / .在结尾（如file.） → 无有效后缀
            return "";
        }

        // 6. 返回小写后缀（统一格式）
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }


}
