package com.zyz.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
public class RouterController {

    @RequestMapping("/")
    public String index() throws Exception {
        return "redirect:/web_comfyui_batch_operate/page/admin/index.html";
    }
}
