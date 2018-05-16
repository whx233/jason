Ext.require([
    'Ext.panel.Panel',
    'Ext.layout.container.Anchor'
]);

Ext.onReady(function() {
	//导航菜单
	var tree_store = Ext.create('Ext.data.TreeStore', {
		root : {
			expanded : false,
			id : 0,
			text : "根目录"
		},
//		defaultProxyType : 'memory',
//		clearOnLoad : true,
		autoLoad : false,
		proxy : {
			type : "ajax",
			url : "/jason/loadTree",
			actionMethods: {
	            read: 'POST'
	        }
		}
	});
	
	//角色列表
	var roleStore = Ext.create('Ext.data.Store', {
	    //storeId:'simpsonsStore',
	  autoLoad : true,
	  pageSize:9999,
	    fields:['type_key','type_value','type_name','valid_flag','create_date','status_name'],
	    proxy : {
	    type : 'ajax',
	    url : 'system/getRoles',
	    actionMethods: {
	            read: 'POST'
	        },
	    reader : {
	      type : 'json',
	      root : 'items',
	      totalProperty : 'totalCount'
	    }
	  }
	});
	
	
	var menuStore = Ext.create('Ext.data.Store', {
	    //storeId:'simpsonsStore',
		autoLoad : true,
		pageSize:9999,
	    fields:['id', 'cascade_id', 'up_menu_name','menu_name','parents_id','is_leaf','auto_expand','url','icon_name','sort_num'],
	    proxy : {
			type : 'ajax',
			url : 'system/getRoleMenu',
			actionMethods: {
	            read: 'POST'
	        },
			reader : {
				type : 'json',
				root : 'items',
				totalProperty : 'totalCount'
			}
		}
	});
	
	var addMenuStore = Ext.create('Ext.data.Store', {
	    //storeId:'simpsonsStore',
		autoLoad : true,
	    fields:['id','cascade_id','menu_name','parents_id','is_leaf','auto_expand','url','icon_name','sort_num']
	});
	
	
	//menuStore.loadPage(1);
	
	var roleListGrid = Ext.create('Ext.grid.GridPanel', {
    	//header:false,
//    	id:'test_grid',
    	title: '角色管理',
    	loadMask : true,
    	columnLines : true,
    	forceFit : true,
    	split: true,//可折叠
    	columnWidth: .4,
    	//autoLoad: true,
//    	selType: 'cellmodel',
    	stripeRows:true, //斑马线效果
    	height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
        store: roleStore,//Ext.data.StoreManager.lookup('simpsonsStore'),
        selType: 'checkboxmodel',
        columns: [
        	{ xtype : 'rownumberer', text : '序号', width : 40},
        	{ header: '角色编码', dataIndex: 'type_value', width: 60},
        	{ header: '角色名称', dataIndex: 'type_name', width: 140},
            { header: '有效标志', dataIndex: 'valid_flag', width: 180, hidden:true },
            { header: 'KEY', dataIndex: 'type_key', width: 180, hidden:true },
            { header: '创建时间', dataIndex: 'create_date', width: 150},
            { header: '是否有效', dataIndex: 'status_name', width: 80 }//, editor:{allowBlank:false}
        ],
        dockedItems : [ {
			xtype : 'pagingtoolbar',
			store : roleStore, // GridPanel使用相同的数据源
			dock : 'bottom',
			displayMsg : '显示条目 {0} - {1}条   共{2}条',
			displayInfo : true
		} ],
		tbar : new Ext.Toolbar({
			items : [{
				xtype:'textfield',
				id:'show_role_id',
				fieldLabel : '角色ID',
				name : 'show_role_id',
				labelAlign : 'right',
				blankText : '角色编码 不能为空!',
				allowBlank : false,
				labelWidth : 50,
				width:110
//				readOnly:true
			},{
				xtype:'textfield',
				id:'show_role_name',
				fieldLabel : '角色名称',
				name : 'show_parent_name',
				labelAlign : 'right',
				labelWidth : 65,
				width:180
//				readOnly:true
			},{
				text : '添加',
				icon : 'view/common/icons/add.png',
				handler : function() {
					var v_roleId = Ext.getCmp('show_role_id').getValue();
					if(v_roleId==null || v_roleId==''){
						Ext.Msg.alert('提示', '角色编码不能为空');
						return;
					}
					var v_roleName = Ext.getCmp('show_role_name').getValue();
					if(v_roleName==null || v_roleName==''){
						Ext.Msg.alert('提示', '角色名称不能为空');
						return;
					}
					var obj = new Object();
					obj.role_id = v_roleId;
					obj.role_name = v_roleName;
					Ext.Ajax.request({
            			url : 'system/saveRole',
            			params : obj,
            			method : 'POST',
            			success : function(response, action) {
            				var respText = Ext.decode(response.responseText);
            				Ext.Msg.alert('提示', respText.msg);
            				roleStore.reload();
            				Ext.getCmp('show_role_id').setValue(null);
            				Ext.getCmp('show_role_name').setValue("");
            				
            			},
            			failure : function(response, action) {
            				Ext.Msg.alert('提示', action.result.msg);
            				roleStore.reload();
            				Ext.getCmp('show_role_id').setValue("");
            				Ext.getCmp('show_role_name').setValue("");
            			}
            		})
				}
			},'-',{
				text : '删除',
				icon : 'view/common/icons/delete.gif',
				handler : function() {
					var sm = roleListGrid.getSelectionModel();
					var record = sm.getSelection();
					
					Ext.Msg.confirm('系统提示','确定要删除 ?',function(btn){
						if(btn=='yes'){
							var v_arr = new Array();
							for(var i = 0;i<record.length;i++){
								v_arr[i]=record[i].get("type_value");
							}
					        var v_obj = new Object();
					        v_obj.roleList = v_arr;
							Ext.Ajax.request({
								url : 'system/deleteRole',
		            			params : v_obj,
		            			method : 'POST',
		            			success : function(response, action) {
		            				var respText = Ext.decode(response.responseText);
		            				Ext.Msg.alert('提示', respText.msg);
		            				roleStore.reload();
		            			},
		            			failure : function(response, action) {
		            				Ext.Msg.alert('提示', action.result.msg);
		            				roleStore.reload();
		            			}
							})
						}
					});
					
				}
			} ]
		}),
		plugins:[
			Ext.create('Ext.grid.plugin.CellEditing',{
				clicksToEdit:1 //设置单击单元格编辑
			})
		],
		listeners: {
			itemclick: function (view, record, item, index, e, eOpts) {
				menuStore.removeAll();
				var roleID = record.get('type_value');
				if(roleID==null || roleID==''){
					return;
				}
				var obj = new Object();
				obj.role_id = roleID;
				menuStore.reload({
					params : obj,
					callback : function(r, options, success) {
						if (!success) {
							menuStore.removeAll();
						}
					}
				});
				
			}
		}
    });
	
    Ext.create('Ext.panel.Panel', {
        renderTo: 'roleManage',
        title: '菜单管理',
        header:false,
        split: true,
        layout:'column',
        height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
        items:[roleListGrid,{
        	title: '导航',
        	//header:false,
            xtype:'treepanel',
            //width: 200,
            collapsible: true,
            split: true,
		    rootVisible: true,//显示根节点
            store:tree_store,
            height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
            columnWidth: .25,
            tbar : new Ext.Toolbar({
            	items:[{
				text : '保存',
				icon : 'view/common/icons/add.png',
				handler : function() {
					if(menuStore.getCount()<1){
	            		Ext.Msg.alert('提示', '至少添加一条菜单');
	            		return;
	            	}
					var sm = roleListGrid.getSelectionModel();
					var v_record = sm.getSelection();
					
					var menuArray=new Array();
					for(var i=0;i<menuStore.getCount();i++){
	            		menuArray[i] = menuStore.getAt(i).get("cascade_id");
	            	}
					
	            	var obj = new Object();
	            	obj.menuList = menuArray;
	            	obj.role_id = v_record[0].get("type_value");
	            	Ext.Ajax.request({
            			url : 'system/saveRoleMenu',
            			params : obj,
            			method : 'POST',
            			success : function(response, action) {
            				var respText = Ext.decode(response.responseText);
            				Ext.Msg.alert('提示', respText.msg);
            				menuStore.removeAll();
            				
            			},
            			failure : function(response, action) {
            				Ext.Msg.alert('提示', action.result.msg);
            			}
            		})
				}
			},'-',{
				text : '删除一行',
				icon : 'view/common/icons/delete.gif',
				handler : function() {
					var sm = Ext.getCmp('add_system_menu').getSelectionModel();
					var record = sm.getSelection()[0];
					if(record==null){
						Ext.Msg.alert('提示','请选择一行');
						return;
					}
					menuStore.remove(record);
				}
			}]
            }),
            listeners: {
            	//双击添加菜单
            	itemdblclick: function (view, record, item, index, e, eOpts) {
            		//var h = Ext.getCmp('west-region').getHeader().getHeight();
            		if (record.get('leaf')) { //叶子节点，添加子菜单时，当前leaf改成false
            			var sm = roleListGrid.getSelectionModel();
    					var v_record = sm.getSelection();
    					if(v_record.length==1){
    						var menu_id = record.get('id');
    						
    						for(var i =0;i<menuStore.getCount();i++){
    							if(menuStore.getAt(i).get("cascade_id")==menu_id){
    								Ext.Msg.alert('提示', '该菜单已经存在!');
    								return;
    							}
    						}
    						var p ={id:'',
    								cascade_id:menu_id,
    								up_menu_name:'',
    								menu_name  :record.get('text'),
    								url:record.raw.url};
    						
    						menuStore.insert(0,p);  
    					}else{
    						Ext.Msg.alert('提示', '只能选择一个角色进行操作');
    					}
            		}else{//父节点，可添加子节点
            			console.log("false");
            		}
            	}
            }
        },{
        	xtype:'gridpanel',
        	//header:false,
        	id:'add_system_menu',
        	title: '系统菜单',
        	loadMask : true,
        	columnLines : true,
        	forceFit : true,
        	columnWidth: .35,
        	split: true,
        	//hidden:true,
        	//autoLoad: true,
        	viewConfig : {enableTextSelection:true},//表格中文本可选中复制
        	height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
            store: menuStore,//Ext.data.StoreManager.lookup('simpsonsStore'),
            columns: [{
	    			xtype : 'rownumberer',
	    			text : '序号',
	    			width : 40
	    		},
                { header: 'id',  dataIndex: 'id', width : 120, hidden:true },
                { header: '菜单编号', dataIndex: 'cascade_id', width: 150, hidden:true },
                { header: '上级菜单名称', dataIndex: 'up_menu_name', width: 180 },
                { header: '菜单名称', dataIndex: 'menu_name', width: 180 },
                { header: '父节点', dataIndex: 'parents_id', width: 150, hidden:true},
                { header: '是否叶子', dataIndex: 'is_leaf', width: 180 , hidden:true},
                { header: '字段展开', dataIndex: 'auto_expand', width: 180, hidden:true},
                { header: 'URL', dataIndex: 'url', width: 180 },
                { header: '图标', dataIndex: 'icon_name', width: 180, hidden:true},
                { header: '排序', dataIndex: 'sort_num', width: 180, hidden:true}
                
            ],
            dockedItems : [ {
    			xtype : 'pagingtoolbar',
    			store : menuStore, // GridPanel使用相同的数据源
    			dock : 'bottom',
    			displayMsg : '显示条目 {0} - {1}条   共{2}条',
    			displayInfo : true
    		} ]
        }]
    });
});
