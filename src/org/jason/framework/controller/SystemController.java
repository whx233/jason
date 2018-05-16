package org.jason.framework.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.jason.framework.model.SystemModel;
import org.jason.framework.model.UserModel;
import org.jason.framework.util.Sequence;
import org.jason.framework.util.Tools;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统级别的请求处理
 * 
 * @author whx233
 *
 */
public class SystemController extends Controller {

	final static String SUCCESS = "{appcode:0,msg:'操作成功'}";
	final static String FAILURE = "{appcode:-1,msg:'操作失败'}";

	// 登录
	public void login() {
		String userName = getPara("username");
		String password = getPara("password");
		UUID uuid = UUID.randomUUID();
		System.out.println(uuid);

		renderJson(userName + password);
	}

	public void getMenuList() {
		String cascadeID = getPara("cascade_id");
		if (cascadeID == null) {
			renderJson(SystemModel.me.getMenu());
		} else {
			renderJson(SystemModel.me.getMenu(cascadeID, true));
		}
	}

	/**
	 * 保存菜单
	 */
	public void saveMenu() {
		String[] str = getParaValues("menuList");
		List<HashMap<String, String>> menuList = new ArrayList<HashMap<String, String>>();
		for (int i = 0; i < str.length; i++) {
			String s = str[i];
			Gson gson = new Gson();
			HashMap<String, String> hash = gson.fromJson(s, new TypeToken<HashMap<String, String>>() {
			}.getType());

			String leaf = hash.get("is_leaf");
			hash.put("is_leaf", "0");
			if (leaf == null || leaf.equals("") || leaf.equals("true") || leaf.equals("1")) {
				hash.put("is_leaf", "1");
			}
			String expand = hash.get("auto_expand");
			hash.put("auto_expand", "1");
			if (expand == null || expand.equals("") || expand.equals("false") || expand.equals("0")) {
				hash.put("auto_expand", "0");
			}
			menuList.add(hash);
		}
		boolean b = SystemModel.me.saveMenu(menuList);
		if (b) {
			renderJson(SUCCESS);
		} else {
			renderJson(FAILURE);
		}
	}

	/**
	 * 删除菜单
	 */
	public void deleteMenu() {
		String cascadeID = getPara("cascadeID");
		if (cascadeID.startsWith("0.001")) {
			renderJson("{appcode:0,msg:'系统菜单不能删除'}");
		} else {
			int i = SystemModel.me.deleteMenu(cascadeID);
			if (i > 0) {
				renderJson(SUCCESS);
			} else if (i == 0) {
				renderJson("{appcode:0,msg:'未删除菜单'}");
			} else {
				renderJson("{appcode:" + i + ",msg:'存在多个子菜单，请先删除子菜单'}");
			}
		}
	}

	/**
	 * 获取角色列表
	 */
	public void getRoles() {
		List<Record> list = SystemModel.me.getParam("ROLE_ID");// 获取角色列表
		System.out.println(list);
		for (int i = 0; i < list.size(); i++) {
			System.out.println(list.get(i));
		}
		System.out.println(Tools.toJson(list));
		renderJson(list);
	}

	/**
	 * 获取权限菜单
	 */
	public void getRoleMenu() {
		String roleID = getPara("role_id");
		if (roleID != null && !roleID.equals("")) {
			Page<Record> list = SystemModel.me.getRoleMenu(1, 999, Integer.parseInt(roleID));
			renderJson(list.getList());
		} else {
			renderJson("{msg:'无数据'}");
		}
	}

	/**
	 * 保存角色
	 */
	public void saveRole() {
		String roleID = getPara("role_id");
		String roelName = getPara("role_name");
		Record record = new Record();
		record.set("type_value", roleID);
		record.set("type_name", roelName);
		List<Record> list = new ArrayList<>();
		list.add(record);
		boolean b = SystemModel.me.updateParam("ROLE_ID", list);
		if (b) {
			renderJson(SUCCESS);
		} else {
			renderJson(FAILURE);
		}
	}

	/**
	 * 删除角色
	 */
	public void deleteRole() {
		String[] str = getParaValues("roleList");
		System.out.println(str.length);
		if (str.length > 0) {
			boolean b = false;
			for (String roleID : str) {
				b = SystemModel.me.deleteRole(Integer.parseInt(roleID));
			}
			if (b) {
				renderJson(SUCCESS);
			} else {
				renderJson(FAILURE);
			}
		} else {
			renderJson("{appcode:-1,msg:'操作失败，角色编码不能为空'}");
		}
	}

	/**
	 * 保存权限菜单
	 */
	public void saveRoleMenu() {
		String[] str = getParaValues("menuList");
		String roleID = getPara("role_id");
		List<String> list = new ArrayList<>();
		list.add("0");
		for (int i = 0; i < str.length; i++) {
			for (int j = 0; j <= (str[i].length() - 1) / 4; j++) {
				String menuStr = str[i].substring(0, (j * 4) + 1);
				if (!list.contains(menuStr)) {
					list.add(menuStr);
				}
			}
		}
		System.out.println(list);

		boolean b = SystemModel.me.saveRoleMenu(Integer.parseInt(roleID), list);
		if (b) {
			renderJson(SUCCESS);
		} else {
			renderJson(FAILURE);
		}
	}

	/**
	 * 获取用户列表
	 */
	public void getUsers() {
		int pageNumber = getParaToInt("page");
		int pageSize = getParaToInt("limit");
		Page<Record> user = UserModel.me.getUser(pageNumber, pageSize);

		HashMap<String, Object> params = new HashMap<String, Object>();
		params.put("totalCount", user.getTotalRow());
		params.put("items", user.getList());
		System.out.println(params);
		renderJson(params);
	}
	
	/**
	 * 检查用户是否存在
	 */
	public void checkUser() {
		String userName = getPara("user_name");
		userName = userName.trim();
		Record record = UserModel.me.getUserByName(userName);
		if(record == null || record.get("user_name")==null) {
			renderJson("{appcode:-1,msg:'此用户名不存在'}");
		}else {
			renderJson("{appcode:1,msg:'该用户名已存在'}");
		}
	}
	
	/**
	 * 保存用户
	 */
	public void saveUser() {
		String userName = getPara("user_name");
		userName = userName.trim();
		String nickName = getPara("nick_name");
		String email = getPara("email");
		String sex = getPara("sex");
		String role = getPara("role_id");
		
		Record record = new Record();
		record.set("user_id", Sequence.me.nextval("USERID"));
		record.set("nick_name", nickName).set("user_name", userName)
		.set("email", email).set("sex", sex).set("role_id", role)
		.set("valid_flag", "1").set("password", "888888").set("create_date", new Date());
		boolean b = UserModel.me.saveUser(record);
		if (b) {
			renderJson(SUCCESS);
		} else {
			renderJson(FAILURE);
		}
	}
	
	/**
	 * 更新用户状态
	 */
	public void updateUserValid() {
		String userID = getPara("user_id");
		String validFlag = getPara("valid_flag");
		int i = UserModel.me.updateUserValid(userID, validFlag);
		if (i==1) {
			renderJson(SUCCESS);
		} else {
			renderJson(FAILURE);
		}
	}

}
