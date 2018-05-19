package org.jason.framework.controller;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.jason.framework.model.SystemModel;
import org.jason.framework.util.MenuDao;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

/**
 * 支撑系统基本请求路径
 * @author whx233
 *
 */
public class IndexController extends Controller {
	
	public void index() {
		
		UUID U = UUID.randomUUID();
		System.out.println(U);
		render("view/system/html/index.html");
	}
	
	//登录成功界面
	public void welcome() {
		renderJson("{appcode:1,msg:'恭喜登录成功'}");
	}
	
	public void login() {
		System.out.println("登录了");
	}
	
	public void loadTree() {
		String roleID = getPara("role_id");
		String treeStr ="";
		if(roleID==null) {
			treeStr = new MenuDao().extBuild();
		}else {
			treeStr = new MenuDao().extBuild(Integer.parseInt(roleID));
		}
		treeStr = "{ text: \"根节点\",children: " + treeStr + "}";
		renderJson(treeStr);
	}
	/**
	 * 菜单管理
	 */
	public void menuManage(){
		render("view/system/html/menuManage.html");
	}
	
	/**
	 * 角色管理
	 */
	public void roleManage(){
		render("view/system/html/roleManage.html");
	}
	
	/**
	 * 用户管理
	 */
	public void userManage(){
		render("view/system/html/userManage.html");
	}
	
	public void demo1(){
		render("view/system/html/demo1.html");
	}
	
	/**
	 * 根据传入参数，获取参数列表
	 */
	public void getParams() {
		String paramType = getPara("param_type");
		List<Record> list = SystemModel.me.getParam(paramType);
		System.out.println(list);
		HashMap<String,List<Record>> hash = new HashMap<String,List<Record>>();
		hash.put("paramType",list);
		renderJson(hash);
	}

}
