package org.jason.framework.util;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * 菜单处理类
 * @author whx233
 *
 */
public class MenuDao {
	
	/**
	 * 获取菜单列表
	 * @param cascadeID
	 * @return
	 */
	private static List<Record> getMenuList(int roleID,String cascadeID){
		String sql = "select a.* from system_menu a,system_role_menu b where a.cascade_id=b.cascade_id and b.role_id="+roleID+" and b.cascade_id like ?";
		if(roleID==0) {
			sql = "select * from system_menu where cascade_id like ?";
		}
		return Db.find(sql, cascadeID);
	}
	
	/**
	 * 将菜单列表打包到list中，适用 Extjs
	 * @param paras
	 * @return
	 */
	private List<ExtTreeNode> extMenuList(int roleID,String cascadeID){
		List<ExtTreeNode> list = new ArrayList<ExtTreeNode>();
		
		List<Record> menu = getMenuList(roleID,cascadeID);
		
		for(int i=0;i<menu.size();i++){
			ExtTreeNode etn = new ExtTreeNode();
			Record r = menu.get(i);
			
			etn.setId(r.getStr("cascade_id"));
			etn.setText(r.getStr("menu_name"));
			etn.setParentsId(r.getStr("parents_id"));
			etn.setLeaf(r.getBoolean("is_leaf"));
			etn.setExpanded(r.getBoolean("auto_expand"));
			etn.setUrl(r.getStr("url"));
			list.add(etn);
		}
		return list;
	}
	
	
	/**
	 * 根据角色获取菜单，并将菜单树转换成json
	 * @return
	 */
	public String extBuild(int roleID){
		//根据角色获取根目录,获取一级目录
		//如果传入的roleID = 0 ，则获取所有的菜单
		String sql = "select cascade_id from system_role_menu where LENGTH(cascade_id)=5 and role_id ="+ roleID;
		if(roleID==0) {
			sql = "select cascade_id from system_menu where LENGTH(cascade_id)=5";
		}
		
		List<Record> cascadeList = Db.find(sql);
		List<ExtTreeNode> extNodeList = new ArrayList<ExtTreeNode>();
		for(int i=0;i<cascadeList.size();i++){
			List<ExtTreeNode> extTreeList = extMenuList(roleID,cascadeList.get(i).getStr("cascade_id")+"%");
			// 重点：将平面的上下级节点组装为立体的关系。
			for (ExtTreeNode node1 : extTreeList) {
				if (!node1.getLeaf()) {
					//防止垃圾数据造成没有子孙的空树枝节点。
					//空树枝节点也需要一个空chidren子节点，否则页面树会进入死循环。
					node1.appendChild(null);
				}
				boolean mark = false;
				for (ExtTreeNode node2 : extTreeList) {
					if (node1.getParentsId().equals(node2.getId())) {
						mark = true;
						node2.appendChild(node1);
						break;
					}
				}
				if (!mark) {
					extNodeList.add(node1);
				}
			}
		}
		
		//转换成Json
		GsonBuilder builder = new GsonBuilder();
		Gson gson = builder.create();
		String str = gson.toJson(extNodeList);
		return str;
	}
	
	/**
	 * 获取系统中所有菜单并生成json
	 * @return
	 */
	public String extBuild(){
		return extBuild(0);
	}

}
