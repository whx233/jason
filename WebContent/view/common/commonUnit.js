/**
 * 基础的公共对象
 * 
 * @author whx
 * @since 2018-02-26
 */

Ext.namespace("Ext.commonUnit");

Ext.commonUnit.typeStore = function(p) {
	var v_url = 'getParams?param_type='+p;
	var jStore = new Ext.data.JsonStore({
		autoLoad : true,
		autoDestroy : true,
		queryMode : 'local',
		//storeId : 'myStore',
		proxy : {
			type : 'ajax',
			url : v_url,
			reader : {
				type : 'json',
				root: 'paramType',
				idProperty : 'type_name'
			}
		},
		// 另外，可以配Ext.data.Model的名称(如 Ext.data.Store 中的例子)
		fields : [ 'type_name', 'type_value' ]
	});
	return jStore;
}