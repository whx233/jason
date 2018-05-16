package org.jason.framework.util;

import java.util.Date;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
/**
 * 生成序列号，保存到system_sequence表中
 * @author whx233
 *
 */
public class Sequence {
	
	public final static Sequence me = new Sequence();
	/**
	 * 通过参数获取序列号
	 * @param seqType
	 * @return
	 */
	public int nextval(String seqType) {
		seqType = seqType.toUpperCase();
		
		String sql = "select count(1) v_count from system_sequence where seq_type= ? ";
		Record r = Db.findFirst(sql, seqType);
		if(r.getInt("v_count")==0) {
			Record record = new Record();
			record.set("seq_type", seqType).set("current_num", 1).set("create_time", new Date());
			Db.save("system_sequence", record);
			return 1;
		}else {
			sql = "update system_sequence set current_num = current_num + 1 where seq_type = ?";
			Db.update(sql, seqType);
			String s = "select current_num from system_sequence where seq_type = ?";
			Record g = Db.findFirst(s, seqType);
			return g.getInt("current_num");
		}
	}
	/**
	 * 默认系统的序列号
	 * @return
	 */
	public int nextval() {
		return nextval("SYSTEM");
	}
}
