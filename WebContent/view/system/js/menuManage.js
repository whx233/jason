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
	
	
	var menuStore = Ext.create('Ext.data.Store', {
	    //storeId:'simpsonsStore',
		autoLoad : true,
		pageSize:9999,
	    fields:['id', 'cascade_id', 'menu_name','parents_id','is_leaf','auto_expand','url','icon_name','sort_num'],
	    proxy : {
			type : 'ajax',
			url : 'system/getMenuList',
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
	//菜单管理（增删改）
	var addGrid = Ext.create('Ext.grid.GridPanel', {
    	//header:false,
//    	id:'test_grid',
    	title: '管理菜单',
    	loadMask : true,
    	columnLines : true,
    	forceFit : true,
    	split: true,//可折叠
    	columnWidth: .75,
    	//autoLoad: true,
//    	selType: 'cellmodel',
    	stripeRows:true, //斑马线效果
    	height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
        store: addMenuStore,//Ext.data.StoreManager.lookup('simpsonsStore'),
        columns: [/*{
    			xtype : 'rownumberer',
    			text : '序号',
    			width : 40
    		},*/
        	{ header: 'ID', dataIndex: 'id', width: 150,hidden:true},
        	{ header: '菜单编号', dataIndex: 'cascade_id', width: 150,hidden:true},
            { header: '菜单名称', dataIndex: 'menu_name', width: 180, editor:{allowBlank:false} },
            { header: '父节点', dataIndex: 'parents_id', width: 150},
            { header: '是否叶子', dataIndex: 'is_leaf', width: 80, editor:{allowBlank:false} },
            { header: '是否展开', dataIndex: 'auto_expand', width: 80, editor:{allowBlank:false} },
            { header: 'URL', dataIndex: 'url', width: 180, editor:{allowBlank:false} },
            { header: '图标', dataIndex: 'icon_name', width: 180, editor:{allowBlank:false} },
            { header: '排序', dataIndex: 'sort_num', width: 80, editor:{allowBlank:false} }
        ],
        dockedItems : [ {
			xtype : 'pagingtoolbar',
			store : addMenuStore, // GridPanel使用相同的数据源
			dock : 'bottom',
			displayMsg : '显示条目 {0} - {1}条   共{2}条',
			displayInfo : true
		} ],
		tbar : new Ext.Toolbar({
			items : [{
				xtype:'textfield',
				id:'show_parent_id',
				fieldLabel : '菜单',
				name : 'show_parent_id',
				labelAlign : 'right',
//				blankText : '用户名 不能为空!',
//				allowBlank : false,
				labelWidth : 30,
				width:160,
				readOnly:true
			},{
				xtype:'textfield',
				id:'show_parent_name',
//				fieldLabel : '节点ID',
				name : 'show_parent_name',
				labelAlign : 'right',
				labelWidth : 45,
				width:150,
				readOnly:true
			},{
				text : '删除菜单',
				icon : 'view/common/icons/cancel.png',
				handler : function() {
					var v_parentId = Ext.getCmp('show_parent_id').getValue();
					var v_parentName = Ext.getCmp('show_parent_name').getValue();
					if(v_parentId==''){
						Ext.Msg.alert('提示','请选择一个菜单');
						return;
					}
					
					Ext.Msg.confirm('系统提示','确定要删除 '+v_parentName+' ?',function(btn){
						if(btn=='yes'){
							var obj = new Object();
							obj.cascadeID = v_parentId;
							Ext.Ajax.request({
		            			url : 'system/deleteMenu',
		            			params : obj,
		            			method : 'POST',
		            			success : function(response, action) {
		            				var respText = Ext.decode(response.responseText);
		            				Ext.Msg.alert('提示', respText.msg);
		            				
		            			},
		            			failure : function(response, action) {
		            				Ext.Msg.alert('提示', action.result.msg);
		            			}
		            		})
						}
					});
				}
			},{
				text : '修改',
				icon : 'view/common/icons/information.png',
				handler : function() {
					var v_parentId = Ext.getCmp('show_parent_id').getValue();
					if(v_parentId=='0' || v_parentId==''){
						Ext.Msg.alert('提示', '不能为空或选根目录');
						return;
					}
					var rec = menuStore.findRecord('cascade_id',v_parentId)
					addMenuStore.insert(0,rec);  
					console.log(rec);
				}
			},'-',{
				text : '添加菜单',
				icon : 'view/common/icons/add.png',
				handler : function() {
					var v_parentId = Ext.getCmp('show_parent_id').getValue();
					if(v_parentId==''){
						Ext.Msg.alert('提示','请选择一个菜单作为父节点');
						return;
					}
					var p ={id:'',
							cascade_id:'',
							menu_name:'菜单名称',
							is_leaf  :true,
							auto_expand:false,
							parents_id:v_parentId};
					addMenuStore.insert(0,p);  
				}
			},'-',{
				text : '删除一行',
				icon : 'view/common/icons/delete.gif',
				handler : function() {
					var sm = addGrid.getSelectionModel();
					var record = sm.getSelection()[0];
					if(record==null){
						Ext.Msg.alert('提示','请选择一行');
						return;
					}
					addMenuStore.remove(record);
				}
			},'-',{
				text: '保存',
	            icon : 'view/common/icons/accept.gif',
	            handler: function(){
	            	//console.log(addMenuStore.getCount());
	            	if(addMenuStore.getCount()<1){
	            		Ext.Msg.alert('提示', '至少添加一条菜单');
	            		return;
	            	}
	            	var menuArray=new Array();
	            	for(var i=0;i<addMenuStore.getCount();i++){
	            		menuArray[i] = JSON.stringify(addMenuStore.getAt(i).data);
	            	}
	            	var obj = new Object();
	            	obj.menuList = menuArray;
	            	Ext.Ajax.request({
            			url : 'system/saveMenu',
            			params : obj,
            			method : 'POST',
            			success : function(response, action) {
            				var respText = Ext.decode(response.responseText);
            				Ext.Msg.alert('提示', respText.msg);
            				addMenuStore.removeAll();
            				menuStore.loadPage(1);
            				
            			},
            			failure : function(response, action) {
            				Ext.Msg.alert('提示', action.result.msg);
            			}
            		})
	            }
			} ]
		}),
		plugins:[
			Ext.create('Ext.grid.plugin.CellEditing',{
				clicksToEdit:1 //设置单击单元格编辑
			})
		]
    });
	
    Ext.create('Ext.panel.Panel', {
        renderTo: 'menuManage',
        title: '菜单管理',
        header:false,
        split: true,
        layout:'column',
        height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
        items:[{
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
				text : '刷新',
				icon : 'view/common/icons/arrow_refresh.png',
				handler : function() {
					tree_store.getRootNode().removeAll();
    				tree_store.load({
    					type : "ajax",
    					url : "/jason/loadTree",
    					actionMethods: {
    			            read: 'POST'
    			        }
    				}); 
				}
			}]
            }),
            listeners: {
            	itemclick: function (view, record, item, index, e, eOpts) {
            		//var h = Ext.getCmp('west-region').getHeader().getHeight();
            		//console.log(h);
            		Ext.getCmp('show_parent_id').setValue(record.get('id'));
            		Ext.getCmp('show_parent_name').setValue(record.get('text'));
            		var obj = new Object();
					obj.cascade_id = record.get('id');
					menuStore.reload({
						params : obj,
						callback : function(r, options, success) {
							if (!success) {
								menuStore.removeAll();
							}
						}
					});
					
            		if (record.get('leaf')) { //叶子节点，添加子菜单时，当前leaf改成false
            			
            		}else{//父节点，可添加子节点
            			
            		}
            	}
            }
        },{
        	xtype:'gridpanel',
        	//header:false,
        	title: '系统菜单缓存',
        	loadMask : true,
        	columnLines : true,
        	forceFit : true,
        	columnWidth: .34,
        	split: true,
        	hidden:true,
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
    		} ],
    		tbar : new Ext.Toolbar({
    			items : []
    		})
        },addGrid]
    });
});
