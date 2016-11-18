$(function(){
	game.init()//游戏开始了
})
var game={
	gamegk:[   //地图
			1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,
			1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,
			1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1
		],
		colnum:20,//行网格数
		webwidth:50,//一个网格的宽度
		//xy=[{x:2,y:2},{x:9,y:2},{x:9,y:5},{x:16,y:5},{x:16,y:7},{x:6,y:8},{x:6,y:9}]//运动目标点坐标
		routeDir:['top','left','top','left','top','left','top'],//运动方向的数组；
		routeSpeed:[5,5,5,5,5,-5,5],//运动速度
		routeTarget:[100,450,250,800,350,300,450],//运动的目标点数组
		gwBlood:100,//怪物的血量
		gwMoney:10,//打死一个怪物获得的金币
		ptmoney:50,//炮台的价格
		hitRange:100,//炮台攻击的范围
		bulletPower:10,//子弹的攻击力
		bulletSpeed:10,//子弹的速度
	jl:{x:2,y:0},
	init:function(){//初始化
		this.elem();
		this.createMap();
		this.bindevents();
	},
	elem:function(){   //收集常用元素，以备待用，元素的集合
		this.box=$("#box");
		this.startBtn=$("#btn1");
		this.startBtn2=$("#btn2");
		this.money=$("#money");
	},
	createMap:function(){ //创建地图
		var This=this;
		$("#box").css("width",this.webwidth*this.colnum);  //设置父级的宽度，不然创建的网格会成为一列
		$.each(this.gamegk,function(){
			var $div=$('<div class="map'+this+'"></div>')   //创建网格div
			This.box.append($div);
		})
	},
	//事件操作的集合
	bindevents:function(){
		var This=this;
		this.startBtn.on("click",function(){//点击按钮
			This.createListGw();   //创建怪物
			This.listens();
		});
		this.box.delegate('.map1','mouseover',function(){
			$(this).addClass("active");
		});
		this.box.delegate('.map1','mouseout',function(){
			$(this).removeClass("active");
		});
		this.box.delegate('.map1','click',function(){
			This.createPlant(this);
		});
	},
	//创建一系列怪物
	createListGw:function(){
		var This=this;
		var num=10;
		var timer=setInterval(function(){
			if(num==0){
				clearInterval(timer);
			}else{
				This.createGw();
				num--;
			}
		},1000)
		
	},
	
	//创建小怪物
	createGw:function(){
		var $gw=$("<div class='gw'></div>");
		$gw.css("left",this.jl.x*50);
		$gw.css("top",this.jl.y*50);
		$gw.get(0).blood=this.gwBlood;
		$gw.get(0).money=this.gwMoney;
		
		this.box.append($gw);
		this.routes($gw);
	},
	//确定运动路线
	routes:function($gw){
		var iNow=0;
		var nowVal=0;
		var This=this;			
		setInterval(function(){
			nowVal= $gw.position()[This.routeDir[iNow]]+This.routeSpeed[iNow];
				 $gw.css(This.routeDir[iNow],nowVal);
				if(nowVal==This.routeTarget[iNow]){
					if(iNow==This.routeTarget.length-1){
						alert("游戏结束了")
					}else{
						iNow++;
					}
				}
			},30)
	},
	//创建炮塔
	createPlant:function(elem){
		if(parseInt(this.money.text())>=this.ptmoney){
		$(elem).attr("class","plant");
		this.changeMoney(-this.ptmoney);
		}
	},
	//控制买炮台的金额
	changeMoney:function(num){
		var val=parseInt(this.money.text())+num;
		this.money.text(val);
	},
	//距离的计算
	disRange:function($obj1,$obj2){
		var a=$obj1.offset().left-$obj2.offset().left;
		var b=$obj1.offset().top-$obj2.offset().top;
		return Math.sqrt(a*a+b*b);
	},
	//监听炮塔
	listens:function(){
		var $aPlant=this.box.find(".plant");//找到所有炮塔
		var This=this;
		$aPlant.each(function(){//遍历所有炮塔
			This.listenGW(this);
		})
		setTimeout(function(){
			
			This.listens();
		},100);
	},
	//监听怪物
	listenGW:function(pt){
		var $aGw=this.box.find(".gw");
		var This=this;
		pt.arr=[];
		$aGw.each(function(){
			if(This.disRange($(this),$(pt))<This.hitRange){
				pt.arr.push(this);
			}
		});
		if(pt.arr.length){
			this.createBullet(pt);
		}
	},
	//创建子弹
	createBullet:function(pt){
		var $bu=$("<div class='bullet'></div>");
		$bu.css({left:$(pt).position().left+$(pt).width()/2,top:$(pt).position().top+$(pt).height()/2})
		$(pt).append($bu);
		this.bulletRun(pt,$bu); 
	},
	//子弹运动
	bulletRun:function(pt,$bu){
		var This=this;
		setInterval(function(){
			var nowGw=pt.arr[pt.arr.length-1];
			var a = ( $(nowGw).offset().left + This.webwidth/2) - $bu.offset().left;
			var b = ( $(nowGw).offset().top + This.webwidth/2) - $bu.offset().top;
			var c=Math.sqrt(a*a+b*b);
			var xS=This.bulletSpeed*a/c;
			var yS=This.bulletSpeed*b/c;
			$bu.css({left:$bu.position().left+xS,top:$bu.position().top+yS});
			if(This.pz($bu,$(nowGw))){
				$bu.remove();
				if(nowGw.blood<0){
					$(nowGw).remove();
					This.changeMoney(nowGw.money)
				}else{
					nowGw.blood=nowGw.blood-This.bulletPower;
				}
			}
		},30)
	},
	//碰撞检测
	pz : function($obj1,$obj2){ 
			var T1 = $obj1.offset().top;
			var B1 = $obj1.offset().top + $obj1.height();
			var L1 = $obj1.offset().left;
			var R1 = $obj1.offset().left + $obj1.width();
			var T2 = $obj2.offset().top;
			var B2 = $obj2.offset().top + $obj2.height();
			var L2 = $obj2.offset().left;
			var R2 = $obj2.offset().left + $obj2.width();
			if(T1>B2 || B1<T2 || L1>R2 || R1<L2){
				return false;
			}
			else{
				return true;
			}
		}
	
	
	
	
	
	
	
	
	
}
