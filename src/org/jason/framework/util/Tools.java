package org.jason.framework.util;

import com.google.gson.Gson;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * 工具类
 * @author whx233
 *
 */
public class Tools {
	
	/**
	 * 生成菜单编号
	 * @param parentNum 父节点序号
	 * @return 0.002.002
	 */
	public static String createMenuNum(String parentNum) {
		//根据父节点获取最大的子节点，如果父节点等于最大的子节点，则生成一个从“001”开始的子节点
		String sql = "select max(cascade_id) cascade_id from system_menu where cascade_id like '"
		+parentNum+"%' and LENGTH(cascade_id)<=(4+"+parentNum.length()+")";
		Record record = Db.findFirst(sql);
		String maxNum = record.getStr("cascade_id");
		if(parentNum.equals(maxNum)) {
			return parentNum+".001";
		}
		//拼接子节点
		maxNum = maxNum.substring(maxNum.lastIndexOf(".")+1);
		int i = Integer.parseInt(maxNum);
		i = i + 1;
		String tmp = "000"+i;
		tmp = tmp.substring(tmp.length()-3, tmp.length());
		return parentNum+"."+tmp;
	}
	
	/**
	 * 对象转成json
	 * @param obj
	 * @return
	 */
	public static String toJson(Object obj) {
		Gson gson = new Gson();
		return gson.toJson(obj);
	}

}
