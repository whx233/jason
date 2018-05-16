package org.jason.framework.model;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * 用户对象
 * @author whx233
 *
 */
public class UserModel {
	
	public final static UserModel me = new UserModel();
	/**
	 * 获取用户《分页》
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 */
	public Page<Record> getUser(int pageNumber, int pageSize) {
		String select = "select a.user_id,a.user_name,a.nick_name,a.password,"
				+ "case when a.sex='1' then '男' else '女' end sex,a.email,"
				+ "case when a.valid_flag='1' then '有效' else '<span style=\"color:red;\">无效</span>' end valid_flag,a.role_id,b.type_name role_name,a.create_date";
		String from = "from system_user a,system_param b where a.role_id=b.type_value and "
				+ "b.type_key='ROLE_ID'";
		return Db.paginate(pageNumber, pageSize, select, from);
	}
	/**
	 * 根据用户名获取用户
	 * @param userName
	 * @return
	 */
	public Record getUser(String userName) {
		String sql = "select a.user_id,a.user_name,a.nick_name,a.password,"
				+ "case when a.sex='1' then '男' else '女' end sex,a.email,"
				+ "case when a.valid_flag='1' then '有效' else '无效' end valid_flag,a.role_id,b.type_name role_name,a.create_date from "
				+ "system_user a,system_param b where a.role_id=b.type_value and "
				+ "b.type_key='ROLE_ID' and a.user_name = ?";
		return Db.findFirst(sql, userName);
	}
	
	/**
	 * 根据用户ID获取用户
	 * @param userID
	 * @return
	 */
	public Record getUserById(String userID) {
		String sql = "select a.user_id,a.user_name,a.nick_name,a.password,"
				+ "case when a.sex='1' then '男' else '女' end sex,a.email,"
				+ "case when a.valid_flag='1' then '有效' else '无效' end valid_flag,"
				+ "a.role_id,b.type_name role_name,a.create_date from "
				+ "system_user a,system_param b where a.role_id=b.type_value and "
				+ "b.type_key='ROLE_ID' and a.user_id = ?";
		return Db.findFirst(sql, userID);
	}
	
	/**
	 * 根据用户名获取用户信息
	 * @param userName
	 * @return
	 */
	public Record getUserByName(String userName) {
		String sql = "select a.user_id,a.user_name,a.nick_name,a.password,"
				+ "case when a.sex='1' then '男' else '女' end sex,a.email,"
				+ "case when a.valid_flag='1' then '有效' else '无效' end valid_flag,"
				+ "a.role_id,b.type_name role_name,a.create_date from "
				+ "system_user a,system_param b where a.role_id=b.type_value and "
				+ "b.type_key='ROLE_ID' and a.user_name = ?";
		return Db.findFirst(sql, userName);
	}
	/**
	 * 根据用户ID删除用户
	 * @param userID
	 * @return
	 */
	public int deleteUserById(String userID) {
		String sql = "delete from system_user where user_id = ?";
		return Db.delete(sql, userID);
	}
	
	/**
	 * 保存用户
	 * @param record
	 * @return
	 */
	public boolean saveUser(Record record) {
		return Db.save("system_user", record);
	}
	
	/**
	 * 更新用户状态
	 * @param userID 用户ID
	 * @param validFlag 状态
	 * @return
	 */
	public int updateUserValid(String userID,String validFlag) {
		String sql = "update system_user set valid_flag= ? where user_id = ?";
		return Db.update(sql,validFlag, userID);
	}
	
}
