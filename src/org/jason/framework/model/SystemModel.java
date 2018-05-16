package org.jason.framework.model;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.jason.framework.util.Sequence;
import org.jason.framework.util.Tools;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统级别的操作
 * @author whx233
 *
 */

public class SystemModel {

	public static final SystemModel me = new SystemModel();

	/**
	 * 获取所以的，不分页
	 * 
	 * @return
	 */
	public List<Record> getMenu() {
		return this.getMenu("all", true);
	}

	/**
	 * 根据传入的菜单编号和是否模糊匹配查询，不分页
	 * 
	 * @param cascadeID
	 * @param like
	 *            是否模糊匹配
	 * @return
	 */
	public List<Record> getMenu(String cascadeID, boolean like) {
		String sql = "select a.id,a.cascade_id,a.menu_name,a.parents_id,"
				+ "b.menu_name up_menu_name,a.is_leaf,a.auto_expand,a.url,a.icon_name,a.is_enable,"
				+ "a.sort_num from system_menu a,system_menu b where a.parents_id=b.cascade_id ";
		if (cascadeID.equalsIgnoreCase("all")) {
			return Db.find(sql);
		} else {
			if (like) {
				sql = sql + " and a.cascade_id like '" + cascadeID + "%'";
			} else {
				sql = sql + " and a.cascade_id='" + cascadeID + "'";
			}
			return Db.find(sql);
		}
	}

	/**
	 * 根据传入的菜单编号模糊查询进行分页
	 * 
	 * @param pageNumber
	 * @param pageSize
	 * @param cascadeID
	 * @return
	 */
	public Page<Record> getMenu(int pageNumber, int pageSize, String cascadeID) {
		String select = "select a.id,a.cascade_id,a.menu_name,a.parents_id,b.menu_name up_menu_name,a.is_leaf,a.auto_expand,a.url,a.icon_name,a.is_enable,a.sort_num";
		String from = "from system_menu a,system_menu b where a.parents_id=b.cascade_id and a.cascade_id like ?";
		return Db.paginate(pageNumber, pageSize, select, from, cascadeID + "%");
	}

	/**
	 * 保存菜单
	 * 
	 * @param menuList
	 * @return
	 */
	public boolean saveMenu(List<HashMap<String, String>> menuList) {
		boolean succeed = Db.tx(new IAtom() {
			@Override
			public boolean run() throws SQLException {
				// TODO Auto-generated method stub
				boolean b = false;
				for (int i = 0; i < menuList.size(); i++) {
					Record m = new Record();
					String parentID = menuList.get(i).get("parents_id");
					updateLeaf(parentID);// 更新叶节点

					m.set("menu_name", menuList.get(i).get("menu_name"));
					m.set("parents_id", parentID);
					m.set("is_leaf", menuList.get(i).get("is_leaf"));
					m.set("auto_expand", menuList.get(i).get("auto_expand"));
					m.set("url", menuList.get(i).get("url"));
					m.set("icon_name", menuList.get(i).get("icon_name"));
					m.set("is_enable", 1);
					if (menuList.get(i).get("sort_num") != null && !menuList.get(i).get("sort_num").equals("")) {
						m.set("sort_num", Integer.parseInt(menuList.get(i).get("sort_num")));
					}

					String cascadeID = menuList.get(i).get("cascade_id");
					// 判断是否存在此菜单，如果有，则更新，否则新增
					if (cascadeID != null && !cascadeID.equals("")) {
						boolean start = cascadeID.startsWith("0.001");
						if (start) {
							continue;
						}
						String sqlCount = "select count(1) v_count from system_menu where cascade_id = ?";
						Record r = Db.findFirst(sqlCount, cascadeID);
						int c = r.getInt("v_count");
						if (c > 0) {
							m.set("id", Integer.parseInt(menuList.get(i).get("id")));
							m.set("cascade_id", menuList.get(i).get("cascade_id"));
							b = Db.update("system_menu", m);
							continue;
						}
					}
					m.set("id", Sequence.me.nextval());// 序号
					m.set("cascade_id", Tools.createMenuNum(parentID));
					b = Db.save("system_menu", m);
					if (!b) {
						break;
					}
				}
				return b;
			}
		});
		return succeed;
	}

	/**
	 * 更新叶子节点
	 * 
	 * @param parentID
	 *            父节点
	 * @return
	 */
	public int updateLeaf(String parentID) {
		String sql = "update system_menu set is_leaf = '0' where cascade_id = ?";
		return Db.update(sql, parentID);
	}

	/**
	 * 根据菜单编号删除菜单
	 * 
	 * @param cascadeID
	 * @return
	 */
	public int deleteMenu(String cascadeID) {
		// 先判断是否还有子菜单，如果存在子菜单，先删除子菜单
		String sqlCount = "select count(1) v_count from system_menu where parents_id = ?";
		Record r = Db.findFirst(sqlCount, cascadeID);
		int i = r.getInt("v_count");
		if (i > 0) {
			return -i;
		}
		// 根目录不允许删除
		if (cascadeID.equals("0")) {
			return 0;
		}
		String sql = "delete from system_menu where cascade_id = ?";
		return Db.delete(sql, cascadeID);
	}

	/**
	 * 根据权限获取菜单列表
	 * 
	 * @param roleID
	 * @return
	 */
	public Page<Record> getRoleMenu(int pageNumber, int pageSize, int roleID) {
		String select = "select a.id,a.cascade_id,c.menu_name up_menu_name,a.menu_name,"
				+ "a.parents_id,a.is_leaf,a.auto_expand,a.url,a.icon_name,a.is_enable," + "a.sort_num ";
		String from = "from system_menu a,system_role_menu b,system_menu c where "
				+ "a.cascade_id=b.cascade_id and b.role_id=? and a.parents_id=" + "c.cascade_id and a.is_leaf=1";
		return Db.paginate(pageNumber, pageSize, select, from, roleID);
	}

	/**
	 * 删除角色 删除角色时，对应的权限菜单也需删除
	 * 
	 * @param roleID
	 * @return
	 */
	public boolean deleteRole(int roleID) {
		boolean succeed = Db.tx(new IAtom() {
			@Override
			public boolean run() throws SQLException {
				// TODO Auto-generated method stub
				boolean b = false;
				String sql = "delete from system_param where type_key = 'ROLE_ID' and type_value = ?";
				int i = Db.delete(sql, roleID);
				if (i <= 0) {
					return b;
				}
				sql = "delete from system_role_menu where role_id = ?";
				i = Db.delete(sql, roleID);
				if (i > 0) {
					b = true;
				}
				return b;
			}

		});
		return succeed;
	}

	/**
	 * 保存权限菜单
	 * 
	 * @param roleID
	 *            角色ID
	 * @param menuList
	 *            菜单列表
	 * @return
	 */
	public boolean saveRoleMenu(int roleID, List<String> menuList) {
		// 1.先根据角色ID删除表中的数据
		// 2.保存前台传入的菜单
		boolean succeed = Db.tx(new IAtom() {
			@Override
			public boolean run() throws SQLException {
				// TODO Auto-generated method stub
				String sql = "delete from system_role_menu where role_id = ?";
				int i = Db.delete(sql, roleID);
				if (i < 0) {
					return false;
				}
				boolean foo = false;
				for (i = 0; i < menuList.size(); i++) {
					Record record = new Record();
					record.set("role_id", roleID);
					record.set("cascade_id", menuList.get(i));
					record.set("id", Sequence.me.nextval("ROLE_MENU"));
					foo = Db.save("system_role_menu", record);
					if (!foo) {
						break;
					}
				}
				return foo;
			}

		});
		return succeed;
	}

	/**
	 * 获取数据字典
	 * 
	 * @param paramType
	 * @return
	 */
	public List<Record> getParam(String paramType) {
		String sql = "select a.type_key,a.type_value,a.type_name,case when a.valid_flag='1' then '有效' else '无效' end status_name,a.valid_flag,a.create_date from system_param a where a.type_key = ?";
		return Db.find(sql, paramType);
	}

	/**
	 * 对数据字典表进行操作 没有数据进行新增，有数据进行更新
	 * 
	 * @param type
	 * @param param
	 * @return
	 */
	public boolean updateParam(String type, List<Record> param) {
		boolean succeed = Db.tx(new IAtom() {
			@Override
			public boolean run() throws SQLException {
				// TODO Auto-generated method stub
				String count = "select count(1) count_ from system_param where type_key = '" + type.toUpperCase()
						+ "' and type_value = ?";
				for (int i = 0; i < param.size(); i++) {
					boolean b = false;
					Record record = param.get(i);
					record.set("type_key", type.toUpperCase());
					Record r = Db.findFirst(count, record.getStr("type_value"));
					
					int c = r.getInt("count_");
					if (c > 0) {
						b = Db.update("system_param", record);
					} else {
						record.set("create_date", new Date());
						b = Db.save("system_param", record);
					}
					if (!b) {
						return b;
					}
				}
				return true;
			}

		});
		return succeed;
	}

}
