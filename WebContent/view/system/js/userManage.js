Ext.require([
    'Ext.panel.Panel',
    'Ext.layout.container.Anchor'
]);

Ext.onReady(function() {
	
	var sexStore = Ext.commonUnit.typeStore('SEX');
	var roleStore = Ext.commonUnit.typeStore('ROLE_ID');
	
	var userStore = Ext.create('Ext.data.Store', {
	    //storeId:'simpsonsStore',
		autoLoad : true,
		pageSize:25,
	    fields:['user_id','user_name','nick_name','password','sex','email','valid_flag','role_id','role_name','create_date'],
	    proxy : {
			type : 'ajax',
			url : 'system/getUsers',
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
	
	
	//userStore.loadPage(1);
	//菜单管理（增删改）
	var userGrid = Ext.create('Ext.grid.GridPanel', {
    	//header:false,
//    	id:'test_grid',
    	title: '管理菜单',
    	loadMask : true,
    	columnLines : true,
    	forceFit : true,
    	split: true,//可折叠
    	//columnWidth: .75,
    	//autoLoad: true,
    	//selType: 'cellmodel',
    	stripeRows:true, //斑马线效果
    	height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-75,
        store: userStore,//Ext.data.StoreManager.lookup('simpsonsStore'),
        columns: [{
    			xtype : 'rownumberer',
    			text : '序号',
    			width : 40
    		},
            { header: '用户编码', dataIndex: 'user_id', width: 50,hidden:true},
            { header: '用户名', dataIndex: 'user_name', width: 70},
            { header: '姓名', dataIndex: 'nick_name', width: 80,editor: {
            	xtype: 'textfield',
            	listeners:{
            		"blur":function(){
            			alert('abc');
            		}
            	}
            }},
            { header: '密码', dataIndex: 'password', width: 120,hidden:true},
            { header: '性别', dataIndex: 'sex', width: 50},
            { header: '电子邮件', dataIndex: 'email', width: 120},
            { header: '有效标志', dataIndex: 'valid_flag', width: 50},
            { header: '角色编码', dataIndex: 'role_id', width: 150,hidden:true},
            { header: '角色名称', dataIndex: 'role_name'},
            { header: '创建时间', dataIndex: 'create_date'},
            {
				menuDisabled : true,
				sortable : false,
				xtype : 'actioncolumn',
				width : 30,
				align : 'center',
				header:'修改',
				items : [{
					icon : 'view/common/icons/page_white_edit.png',
					tooltip : '查看人员信息',
					handler : function(grid,rowIndex, colIndex) {
						var rec = userStore.getAt(rowIndex);
						var vflag = rec.get('valid_flag');
						Ext.Msg.alert("提示",vflag);
					}
				}]
			},
            {
				menuDisabled : true,
				sortable : false,
				xtype : 'actioncolumn',
				width : 50,
				align : 'center',
				header:'作废/启用',
				items : [{
					icon : 'view/common/icons/user_delete.png',
					tooltip : '作废操作',
					handler : function(grid,rowIndex, colIndex) {
						var rec = userStore.getAt(rowIndex);
						var vflag = rec.get('valid_flag');
						if (vflag == '有效') {
							Ext.Msg.confirm('系统提示','确定要作废 ?',function(btn){
								if(btn=='yes'){
									//Ext.getBody().mask();//这个地方可以获取panel1或则是panel2的id来实现遮罩，然后在用window.on来处理解除遮罩
									var v_userid = rec.get('user_id');
									var obj = new Object();
									obj.user_id = v_userid;
									obj.valid_flag = "0";
									Ext.Ajax.request({
				            			url : 'system/updateUserValid',
				            			params : obj,
				            			method : 'POST',
				            			success : function(response, action) {
				            				var respText = Ext.decode(response.responseText);
				            				Ext.Msg.alert('提示', respText.msg);
				            				userStore.reload();
				            			},
				            			failure : function(response, action) {
				            				Ext.Msg.alert('提示', action.result.msg);
				            				userStore.reload();
				            			}
				            		})
								}
							})
						} else {
							Ext.Msg.confirm('系统提示','确定要启用 ?',function(btn){
								if(btn=='yes'){
									//Ext.getBody().mask();//这个地方可以获取panel1或则是panel2的id来实现遮罩，然后在用window.on来处理解除遮罩
									var v_userid = rec.get('user_id');
									var obj = new Object();
									obj.user_id = v_userid;
									obj.valid_flag = "1";
									Ext.Ajax.request({
				            			url : 'system/updateUserValid',
				            			params : obj,
				            			method : 'POST',
				            			success : function(response, action) {
				            				var respText = Ext.decode(response.responseText);
				            				Ext.Msg.alert('提示', respText.msg);
				            				userStore.reload();
				            			},
				            			failure : function(response, action) {
				            				Ext.Msg.alert('提示', action.result.msg);
				            				userStore.reload();
				            			}
				            		})
								}
							})
						}
					}
				}]
			}
        ],
        dockedItems : [ {
			xtype : 'pagingtoolbar',
			store : userStore, // GridPanel使用相同的数据源
			dock : 'bottom',
			displayMsg : '显示条目 {0} - {1}条   共{2}条',
			displayInfo : true
		} ],
		plugins:[
			Ext.create('Ext.grid.plugin.CellEditing',{
				clicksToEdit:1 //设置单击单元格编辑
			})
		]
    });
	
    Ext.create('Ext.form.Panel', {
        renderTo: 'userManage',
        title: '菜单管理',
        header:false,
        split: true,
        name:'user_manage',
        url:'system/saveUser',
        height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2,
        items:[{
        	xtype:'panel',
        	layout:'column',
        	items:[{
    			xtype : 'textfield',
    			fieldLabel : '用户名',
    			name : 'user_name',
    			id:'user_name_blur',
    			labelAlign : 'right',
    			blankText : '用户名  不能为空!',
    			labelWidth : 50,
    			columnWidth:.2,
    			margin : '5 5 5 5',
    			allowBlank : false,
    			listeners: {"blur":function (){
    				//添加监听，校验用户名是否存在
    				var v_text = this.lastValue;
    				if(v_text==''){
    					return;
    				}
    				//请求后台
    				var obj = new Object();
    				obj.user_name = v_text;
    				Ext.Ajax.request({
            			url : 'system/checkUser',
            			params : obj,
            			method : 'POST',
            			success : function(response, action) {
            				var respText = Ext.decode(response.responseText);
            				//console.log(respText);
            				if(respText.appcode=='1'){
            					Ext.Msg.alert('提示一下', respText.msg);
            					Ext.getCmp("user_name_blur").focus(true,200);
            				}
            			},
            			failure : function(response, action) {
            				Ext.Msg.alert('提示', action.result.msg);
            			}
            		})
    				}
    			}
    		},{
    			xtype : 'textfield',
    			fieldLabel : '姓名',
    			name : 'nick_name',
    			labelAlign : 'right',
    			blankText : '昵称  不能为空!',
    			labelWidth : 50,
    			columnWidth:.2,
    			margin : '5 5 5 5',
    			allowBlank : false
    		},{
    			xtype : 'combo',
    			fieldLabel : '角色',
    			emptyText : '请选择角色...',
    			margin : '5 5 5 5',
    			labelAlign : 'right',
    			labelWidth : 50,
    			name : 'role_id',
    			triggerAction : 'all',
    			store : roleStore,
    			displayField : 'type_name',
    			valueField : 'type_value',
    			mode : 'local',
    			allowBlank : false,
    			blankText : '请选择角色!',
    			forceSelection : false, // 选中内容必须为下拉列表的子项
    			editable : false,
    			columnWidth:.2,
    			typeAhead : true
    		},{
    			xtype : 'textfield',
    			fieldLabel : '电子邮件',
    			name : 'email',
    			labelAlign : 'right',
    			blankText : '邮件  不能为空!',
    			labelWidth : 60,
    			columnWidth:.2,
    			margin : '5 5 5 5',
    			allowBlank : false
    		},{
    			xtype : 'combo',
    			fieldLabel : '性别',
    			emptyText : '请选择性别...',
    			margin : '5 5 5 5',
    			labelAlign : 'right',
    			labelWidth : 50,
    			name : 'sex',
    			triggerAction : 'all',
    			store : sexStore,
    			displayField : 'type_name',
    			valueField : 'type_value',
    			mode : 'local',
    			allowBlank : false,
    			blankText : '请选择性别!',
    			forceSelection : false, // 选中内容必须为下拉列表的子项
    			editable : false,
    			columnWidth:.2,
    			typeAhead : true
    		}],
    		buttons: [{
                text: '增加',
                handler: function() {
                	var v_form = this.up('form').getForm();
                    if (v_form.isValid()) {
                        v_form.submit({
                            success: function(form, action) {
                            	console.log(action);
                            	Ext.Msg.alert('保存成功', action.result.msg);
                            	userStore.reload();
                            	this.up('form').getForm().reset();
                            },
                            failure: function(form, action) {
                            	console.log(action);
                                Ext.Msg.alert('操作失败', action.result.msg);
                            }
                        });
                    }
                }
            },{
                text: '重置',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }]
        },userGrid]
    });
});
