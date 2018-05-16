Ext.onReady(function(){  
    //定义列  
    var columns = [  
        {header:'编号',dataIndex:'id',width:50,  
            editor:{  
                allowBlank:false  
            }}, //sortable:true 可设置是否为该列进行排序  
        {header:'名称',dataIndex:'name'},  
        {header:'描述',dataIndex:'descn'}  
      ];  
    //定义数据  
    var data =[  
        ['1','小王','描述01'],  
        ['2','李四','描述02'],  
        ['3','张三','描述03'],  
        ['4','束洋洋','思考者日记网'],  
        ['5','高飞','描述05']  
    ];  
    //转换原始数据为EXT可以显示的数据  
    var store = new Ext.data.ArrayStore({  
        data:data,  
        fields:[  
           {name:'id'}, //mapping:0 这样的可以指定列显示的位置，0代表第1列，可以随意设置列显示的位置  
           {name:'name'},  
           {name:'descn'}  
        ]  
    });  
    //加载数据  
    store.load();  

    //创建表格  
    var grid = new Ext.grid.GridPanel({  
        renderTo:'demo1', //渲染位置  
        width:750,  
        height:Ext.getCmp('west-region').getHeight()-Ext.getCmp('west-region').getHeader().getHeight()-2, 
        store:store,  
        forceFit : true,
        columns:columns, //显示列  
        stripeRows:true, //斑马线效果  
        selType: 'cellmodel',  
        bbar:new Ext.PagingToolbar({  
            pageSize:2, //每页显示几条数据  
            store:store,   
            displayInfo:true, //是否显示数据信息  
            displayMsg:'显示第 {0} 条到 {1} 条记录，一共  {2} 条', //只要当displayInfo为true时才有效，用来显示有数据时的提示信息，{0},{1},{2}会自动被替换成对应的数据  
            emptyMsg: "没有记录" //没有数据时显示信息  
        }) ,
        plugins:[
                 Ext.create('Ext.grid.plugin.CellEditing',{  
                     clicksToEdit:1 //设置单击单元格编辑  
                 })  
        ],  
        tbar:['-',{  
            text:'添加一行',  
            handler:function(){  
                var p ={  
                        id:'',  
                        name:'',  
                        descn:''  
                        };  
                    store.insert(0,p);  
                }  
            },'-',{  
                text:'删除一行',  
                handler:function(){  
                    Ext.Msg.confirm('系统提示','确定要删除？',function(btn){  
                        if(btn=='yes'){  
                            var sm = grid.getSelectionModel();  
                            var record = sm.getSelection()[0];  
                            store.remove(record);  
                        }  
                    });  
                }  
        },'-',{  
            text:'保存',  
            handler:function(){  
                var m = store.getModifiedRecords().slice(0);  
                var jsonArray = [];  
                Ext.each(m,function(item){  
                    jsonArray.push(item.data);  
                });  
                Ext.Ajax.request({  
                    method:'POST',  
                    url:'/ExtJs4.2Pro/EditGridServlet',  
                    success:function(response){  
                        Ext.Msg.alert('系统提示',response.responseText,function(){  
                            store.load();  
                        });  
                    },  
                    failure:function(){  
                        Ext.Msg.alert("错误","与后台联系的时候出了问题。");  
                    },  
                    params:'data='+encodeURIComponent(Ext.encode(jsonArray))  
                });  
            }  
        }]  
    });  
});  