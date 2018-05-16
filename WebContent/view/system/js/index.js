Ext.require([
    'Ext.container.Viewport',
    'Ext.grid.Panel',
    'Ext.grid.plugin.RowEditing',
    'Ext.layout.container.Border'
]);

Ext.onReady(function() {
	//导航菜单
	var tree_store = Ext.create('Ext.data.TreeStore', {
		root : {
			expanded : true,
			id : 0,
			text : "根节点"
		},
		defaultProxyType : 'memory',
		proxy : {
			type : "ajax",
			url : "/jason/loadTree?role_id=1"
		}
	});
	

    Ext.ComponentManager.onAvailable('options-toolbar', function(toolbar){
        toolbar.down('button').hide();
    });

    
    
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        rtl: true,
        items: [{
            region: 'north',
            title: '某某系统',
            height: 100,
            header :false,
            html: '',
            //设置背景图片
            bodyStyle: {
                //background: '#ffc'
                background: 'url(view/system/images/5.jpg) repeat #BEE7E9'
                //padding: '10px'
            },
            autoScroll: true,
            collapsible: true,//可折叠
            split: true,
            layout: {
                type: 'vbox',
                align: 'right'
            },
            items:[{
            	xtype:'button',
    			text : '选&nbsp;&nbsp;项',
            	margin : '10 10 10',
    			//icon : 'js/common/shared/icons/wrench_orange.png',
    			menu : [{
    				text:'变更主题',
    				//icon : 'js/common/shared/icons/user_red.png',
    				handler : function() {
    					//alert('修改主题');
    					Ext.getBody().mask();//这个地方可以获取panel1或则是panel2的id来实现遮罩，然后在用window.on来处理解除遮罩
    					showTheme();
    				}
    			},{
    				text:'退出',
    				//icon : 'js/common/shared/icons/connect.gif',
    				handler : function() {
    					Ext.Ajax.request({
    						url : 'user/logout',
    						method : 'GET',
    						success : function(response, action) {
    							var respText = Ext.decode(response.responseText);
    							if(respText.success){
    								var web_root = respText.webroot;
    								window.location.href = web_root + '/index';
    							}else{
    								Ext.Msg.alert('提示', respText.msg);
    							}
    						},
    						failure : function(response, action) {
    							Ext.Msg.alert('提示', action.result.msg);
    						}
    					})
    				}
    			}]
    		}]
        },{
        	region: 'west',
            id: 'west-region',
            title: '导航菜单',
            xtype:'treepanel',
            width: 260,
            collapsible: true,
            split: true,
		    rootVisible: false,
            store:tree_store,
            listeners: {
                itemclick: function (view, record, item, index, e, eOpts) {
                    if (record.get('leaf')) { //叶子节点
                        var id = record.get('id');
                        if (Ext.getCmp(id)){
                            Ext.getCmp('center-region').setActiveTab(id);
                        }else{
                        	var v_url = record.raw.url;
                        	Ext.getCmp('center-region').add({
                        		title: record.get('text'),
                        		closable: true,
                                autoScroll: true,
                        		id:id,
                        		loader: {
                            		url: v_url,
                            		loadMask: 'loading...',
                            		autoLoad: true,
                            		scripts: true
                        		}
                        		}).show();
                        }
                    }else{
                        //Ext.getCmp('center-region').add({ title: record.get('text'), html: 'tab内容--' + record.get('text'), closable: true });
                    }
                }
            }        
        }, {
        	region: 'center',
            id: 'center-region',
            autoScroll: true,
            header :false,
            xtype: 'tabpanel',
            items: [{
            	title: '欢迎登陆',
            	//html:'哇咔咔！好神奇，登陆进来了！',
            	loader: {
            		url: 'welcome',
            		loadMask: 'loading...',
            		autoLoad: true
        		}
            }]
            
        }, {
            region: 'south',
            title: 'south',
            //split: true,
            height: 20,
			header :false,
			html:'<div id="system_info"></div>'
        }/**,{
        	region: 'east',
            title: 'East',
            width: 200,
            split: true,//分裂
            autoScroll:true,
		    collapsible: true //可折叠
        }*/]
    });
    
    
    
    
});



/**
 * 显示系统时钟
 */

function showInfo(){
	var v_text = document.getElementById('nick_name_w').value;
	
	var date = new Date();
	var year = date.getFullYear();
	var mons = date.getMonth()+1;
	var day  = date.getDate();
	var h = date.getHours();
	h = h < 10 ? '0' + h : h;
	var m = date.getMinutes();
	m = m < 10 ? '0' + m : m;
	var s = date.getSeconds();
	s = s < 10 ? '0' + s : s;
	
	document.getElementById('system_info').innerHTML = v_text+'&nbsp;&nbsp;现在是：'+year+"年"+mons+"月"+day+"日 "+h + ":" + m + ":" + s;
}

window.onload = function() {
	setInterval("showInfo()", 500);

}



function showTheme(){
	var theme_Window = Ext.create('Ext.Window', {
		title : '修改主题', // 窗口标题
		width : 360, // 窗口宽度
		height : 150, // 窗口高度
		resizable : false, //禁止拉伸
        layout : 'column',
        items: [
            {xtype: 'radiofield',boxLabel: 'Neptune', name: 'theme',margin : '10 10 5 5', checked: true,id:'theme1'},
            {xtype: 'radiofield',boxLabel: '经典', name: 'theme',margin : '10 10 5 5',id:'theme2'},
            {xtype: 'radiofield',boxLabel: 'Accessiblity', name: 'theme',margin : '10 10 5 5',id:'theme3'},
            {xtype: 'radiofield',boxLabel: '灰色', name: 'theme',margin : '10 10 5 5',id:'theme4'}
        ],
        buttons : [{
			text : '修&nbsp;&nbsp;改',
			icon : 'js/common/shared/icons/add.png',
			handler : function() {
				var themeURL = '/ext-theme-neptune/ext-theme-neptune-all.css';
				var radio1 = Ext.getCmp('theme1');
				var radio2 = Ext.getCmp('theme2');
				var radio3 = Ext.getCmp('theme3');
				var radio4 = Ext.getCmp('theme4');
				if(radio1.getValue()){
					themeURL = '/ext-theme-neptune/ext-theme-neptune-all.css';
				}
				if(radio2.getValue()){
					themeURL = '/ext-theme-classic/ext-theme-classic-all.css';
				}
				if(radio3.getValue()){
					themeURL = '/ext-theme-access/ext-theme-access-all.css';
				}
				if(radio4.getValue()){
					themeURL = '/ext-theme-gray/ext-theme-gray-all.css';
				}
				
				var p = new Object();
				p.theme = themeURL;
				
				Ext.Ajax.request({
					url : 'user/updateTheme',
					params : p,
					method : 'POST',
					success : function(response, action) {
						var respText = Ext.decode(response.responseText);
						if(respText.success){
							Ext.Msg.alert('提示', respText.msg);
						}else{
							Ext.Msg.alert('提示', respText.msg);
						}
					},
					failure : function(response, action) {
						Ext.Msg.alert('提示', action.result.msg);
					}
				})
			}
		},{
			text : '关&nbsp;&nbsp;闭',
			icon : 'js/common/shared/icons/cancel.png',
			handler : function() {
				theme_Window.hide();
				Ext.getBody().unmask();
			}
		}]
	});
	theme_Window.show();
}
