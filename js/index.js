(function($){
	"use strict";
// menu
var dropdown={};
	$('.menu')
	.on('dropdown-show',function(e,funt){
		dropdown.loadOnce($(this),dropdown.buildMenuItem);
		funt();
	})
	.dropdown({
		event:'sad',
		css3:true,
		js:true,
		animation:'fadeSlideUpDown',
		active:'menu',
		delay:200
	});
	dropdown.buildMenuItem=function($elem,data){
		var html='';
		if(data.length===0)return;
		for(var i=0;i<data.length;i++){
			html+='<li><a href="'+data[i].url+'"target="_blank" class="menu-item">'+data[i].name+'</a></li>';
		}
		$elem.find('.dropdown-layer').html(html);
	};

	//header search
	var search={}
	search.$headerSearch=$('#header-search');
	search.$headerSearch.html='';
	search.$headerSearch.maxNum=10;
	search.$headerSearch.on('search-getData',function(e,data){
		search.$headerSearch.html=search.$headerSearch.createHeaderSearchLayer(data,search.$headerSearch.maxNum);
		$(this).search('appendLayer',search.$headerSearch.html);
		if(search.$headerSearch.html){
			$(this).search('showLayer');
		}else{
			$(this).search('hideLayer');
		}
	}).on('search-noData',function(e){
		$(this).search('hideLayer').search('appentLayer','');
	}).on('click','.search-layer-item',function(){
		console.log($(this));
		search.$headerSearch.search('setInputVal',$(this).html());
		search.$headerSearch.search('submit');
	});
	search.$headerSearch.search({
		autocomplete:true,
		css3:false,
		js:false,
		animation:'fade'
	});
	search.$headerSearch.createHeaderSearchLayer=function (data,maxNum){
		var html='',
			dataLen=data['result'].length;
			if(dataLen==0){
				return '';
			}
		for(var i=0;i<dataLen;i++){
			if(i>=maxNum) break;
			html+='<li class="search-layer-item text-elipsis">'+data['result'][i][0]+'</li>'
		}
		return html;
	}
	
//cart
	$('#cart').on('dropdown-show',function(){
		dropdown.loadOnce($(this),function($elem,data){
			buildCartItem($elem, data);
            updateCart($elem, data);
		});
	}).dropdown({
		css3:true,
		js:false
	});
	function buildCartItem($elem,data){
		var html="";
		if(data.length===0){
			html+='<div class="cart-nogoods"><i class="icon cart-nogoods-icon fl">&#xe600;</i><div class="cart-nogoods-text fl">购物车里还没有商品<br>赶紧选购吧！</div></div>'
			$elem.find('.dropdown-layer').html(html);
			return;
		}
		html+='<h4 class="cart-title">最新加入的商品</h4><ul class="cart-list">';
		for(var i=0;i<data.length;i++){
			html+='<li class="cart-item"><a href="###" target="_blank" class="cart-item-pic fl"><img src="' + data[i].pic + '" alt="" /></a><div class="fl"><p class="cart-item-name text-ellipsis"><a href="###" target="_blank" class="link">' + data[i].name + '</a></p><p class="cart-item-price"><strong>￥' + data[i].price + ' x ' + data[i].num + '</strong></p></div><a href="javascript:;" title="删除" class="cart-item-delete link fr">X</a></li>';
		}
		html+='</ul><div class="cart-info"><span class="fl">共 <strong class="cart-total-num">0</strong> 件商品　共计<strong class="cart-total-price">￥ 0.00</strong></span><a href="###" target="_blank" class="cart-info-btn btn fr">去购物车</a></div>';
		$elem.find('.dropdown-layer').html(html);
	}


	function updateCart($elem,data){
		var $cartNum = $elem.find('.cart-num'),
            $cartTotalNum = $elem.find('.cart-total-num'),
            $cartTotalPrice = $elem.find('.cart-total-price'),
            dataNum = data.length,
            totalNum = 0,
            totalPrice = 0;
            if(dataNum===0) return;
            for(var i=0;i<dataNum;i++){
            	totalNum+= +data[i].num;
            	totalPrice+= +data[i].num* +data[i].price;
            }
             $cartNum.html(totalNum);
             $cartTotalNum.html(totalNum);
             $cartTotalPrice.html('￥'+totalPrice);

	};
// category

	$('#focus-category').find('.dropdown')
	.on("dropdown-show",function(e){
		dropdown.loadOnce($(this),dropdown.createCategoryDetails);
	})
	.dropdown({
		css3:true,
		js:false,
		animation:'fadeSlideLeftRight'
	});
	dropdown.createCategoryDetails=function ($elem,data){
		var html='',
			htmla='';
		if(data.length===0)return;
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].items.length;j++){
				htmla+='<a href="###" target="_blank" class="link">'+data[i].items[j]+'</a>';
			}
			html+='<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">'+data[i].title+'</a></dt><dd class="category-details-item fl">'+htmla+'</dd></dl>';
			
		}
		$elem.find('.dropdown-layer').html(html);
	}
	
	dropdown.loadOnce=function($elem,success){
	 	var dataLoad=$elem.data('load')
	 	
	 	if(!dataLoad) return;
	 	// $layer.html('<li class="dropdown-loading"></li>');
	 	if(!$elem.data('loaded')){
	 		$elem.data('loaded',true);
	 		$.getJSON(dataLoad).done(function(data){
	 			if(typeof success==='function') success($elem,data);
	 		}).fail(function(){
	 			$elem.data('loaded',false);
	 		});
	 	}
	}
	//imgloder
	var imgLoader={};
		imgLoader.loadimg=function(url,imgLoaded,imgFailed){
			var image=new Image();
			image.onerror=function(){
				if(typeof imgFailed==='function')imgFailed(url);
			}
			image.onload=function(){
				if(typeof imgLoaded==='function')imgLoaded(url);
			}
			// image.src=url;
			setTimeout(function(){
				image.src=url;
			},1000);
			
		};
		imgLoader.loadImgs=function ($imgs,success,fail){
			//按需加载

			$imgs.each(function(_,el){
				var $img=$(el);
				imgLoader.loadimg($img.data('src'),function(url){
					$img.attr('src',url);
					success();

				},function(url){
					console.log('从'+url+'这个地址加载失败');
					//备用图片
					// $img.attr('src','img/floor/placeholder.png');
					fail($img,url);
				});
			})
		};

	//lazyLoad
	var lazyLoad={};
	    lazyLoad.lazyUntil=function (options){
			var items={},
				loadedItemNum=0,
				loadItemFn=null,
				$elem=options.$container,
				id=options.id;
			$elem.on(options.triggerEvent,loadItemFn=function(e,index,elem){
				console.log(1);
				if(items[index]!=='loaded'){
					$elem.trigger(id+'-loadItems',[index,elem,function(){
						items[index]='loaded';
						loadedItemNum++;
						console.log(index+':loaded');
						if(loadedItemNum===options.totalItemNum){
							//全部加载完毕
							$elem.trigger(id+'-itemsLoaded');
							
						}
					}]);
				}
				
				
			});
			
			$elem.on(id+'-itemsLoaded',function(e){
				console.log(id+'-itemsLoaded');
				//清除事件
				$elem.off(options.triggerEvent,loadItemFn);
				// $win.off('scroll resize',timeToShow);
			});
		};
//focus-carousel
		
		var slider={};
		slider.$focusSlider=$('#focus-slider');
		slider.$todaySlider=$('#today-slider');
		lazyLoad.lazyUntil({
			$container: slider.$focusSlider,
	        totalItemNum: slider.$focusSlider.find('.slider-img').length,
	        triggerEvent: 'slider-show',
	        id: 'focus'
		});
		slider.$focusSlider.on('focus-loadItems',function(e,index,elem,success){
			imgLoader.loadImgs($(elem).find('.slider-img'),success,function($img,url){
				$img.attr('src','img/focus-slider/placeholder.png');
			});
		});
		// slider.lazyLoad=function($elem){
		// 	$elem.items={};
		// 	$elem.loadedItemNum=0;
		// 	$elem.totalItemNum=$elem.find('.slider-img').length;
		// 	$elem.on('slider-show',$elem.loadItem=function(e,i,elem){
		// 		console.log(1);
		// 		if($elem.items[i]!=='loaded'){
		// 			$elem.trigger('slider-loadItem',[i,elem]);
		// 		}
				
				
		// 	});
		// 	$elem.on('slider-loadItem',function(e,index,elem){
		// 		//按需加载
		// 			var $imgs=$(elem).find('.slider-img');

		// 			$imgs.each(function(_,el){
		// 				var $img=$(el);
		// 				imgLoader.loadimg($img.data('src'),function(url){
		// 					$img.attr('src',url);
		// 					$elem.items[index]='loaded';
		// 					$elem.loadedItemNum++;
		// 					console.log(index+':loaded');
		// 					if($elem.loadedItemNum===$elem.totalItemNum){
		// 						//全部加载完毕
		// 						$elem.trigger('slider-itemsLoaded');
								
		// 					}

		// 				},function(url){
		// 					console.log('从'+url+'这个地址加载失败');
		// 					//备用图片
		// 					$img.attr('src','../img/focus-slider/placeholder.png');
		// 				});
		// 			})
					
		// 	});
		// 	$elem.on('slider-itemsLoaded',function(e){
		// 		console.log('itemsLoaded');
		// 		//清除事件
		// 		$elem.off('slider-show',$elem.loadItem);
		// 	});
		// };
		slider.$focusSlider.slider({
			css3:true,
			js:false,
			animation:'fade',
			activeIndex:2,
			interval:4000
		});


		//today
		lazyLoad.lazyUntil({
			$container: slider.$todaySlider,
	        totalItemNum: slider.$todaySlider.find('.slider-img').length,
	        triggerEvent: 'slider-show',
	        id: 'todays'
		});
		slider.$todaySlider.on('todays-loadItems',function(e,index,elem,success){
			imgLoader.loadImgs($(elem).find('.slider-img'),success,function($img,url){
				$img.attr('src','img/todays-slider/placeholder.png');
			});
		});
		// slider.lazyLoad(slider.$todaySlider);
		slider.$todaySlider.slider({
			css3:true,
			js:false,
			animation:'slide',
			activeIndex:2,
			interval:4000
		});


		//floor
		var floor={};
		floor.$floor=$('.floor');


		// function lazyLoadFloorImgs($elem){
		// 	var items={},
		// 		loadedItemNum=0,
		// 		totalItemNum=$elem.find('.floor-img').length,
		// 		loadItemFn=null;
		// 	$elem.on('tab-show',loadItemFn=function(e,i,elem){
		// 		console.log(1);
		// 		if(items[i]!=='loaded'){
		// 			$elem.trigger('tab-loadItem',[i,elem]);
		// 		}
				
				
		// 	});
		// 	$elem.on('tab-loadItem',function(e,index,elem){
		// 		//按需加载
		// 			var $imgs=$(elem).find('.floor-img');

		// 			$imgs.each(function(_,el){
		// 				var $img=$(el);
		// 				slider.loadimg($img.data('src'),function(url){
		// 					$img.attr('src',url);
		// 					items[index]='loaded';
		// 					loadedItemNum++;
		// 					console.log(index+':loaded');
		// 					if(loadedItemNum===totalItemNum){
		// 						//全部加载完毕
		// 						$elem.trigger('tab-itemsLoaded');
								
		// 					}

		// 				},function(url){
		// 					console.log('从'+url+'这个地址加载失败');
		// 					//备用图片
		// 					$img.attr('src','img/floor/placeholder.png');
		// 				});
		// 			})
					
		// 	});
		// 	$elem.on('tab-itemsLoaded',function(e){
		// 		console.log('tab-itemsLoaded');
		// 		//清除事件
		// 		$elem.off('tab-show',loadItemFn);
		// 	});
		// };


		/*$floor.each(function(_,elem){
			lazyLoadFloorImgs($(elem));
		})*/

		

		/*$floor.tab({
			event:'mouseenter',
			css3:false,
			js:false,
			animation:'fade',
			activeIndex:0,
			interval:0,
			delay:500
		});*/
		floor.$win=$(window),
		floor.$doc=$(document);
		floor.floorData = [{
	        num: '1',
	        text: '服装鞋包',
	        tabs: ['大牌', '男装', '女装'],
	        offserTop:floor.$floor.eq(0).offset().top,
	        height:floor.$floor.eq(0).height(),
	        items: [
	            [{
	                name: '匡威男棒球开衫外套2015',
	                price: 479
	            }, {
	                name: 'adidas 阿迪达斯 训练 男子',
	                price: 335
	            }, {
	                name: '必迈BMAI一体织跑步短袖T恤',
	                price: 159
	            }, {
	                name: 'NBA袜子半毛圈运动高邦棉袜',
	                price: 65
	            }, {
	                name: '特步官方运动帽男女帽子2016',
	                price: 69
	            }, {
	                name: 'KELME足球训练防寒防风手套',
	                price: 4999
	            }, {
	                name: '战地吉普三合一冲锋衣',
	                price: 289
	            }, {
	                name: '探路者户外男士徒步鞋',
	                price: 369
	            }, {
	                name: '羽绒服2015秋冬新款轻薄男士',
	                price: 399
	            }, {
	                name: '溯溪鞋涉水鞋户外鞋',
	                price: 689
	            }, {
	                name: '旅行背包多功能双肩背包',
	                price: 269
	            }, {
	                name: '户外旅行双肩背包OS0099',
	                price: 99
	            }],
	            [{
	                name: '匡威男棒球开衫外套2015',
	                price: 479
	            }, {
	                name: 'adidas 阿迪达斯 训练 男子',
	                price: 335
	            }, {
	                name: '必迈BMAI一体织跑步短袖T恤',
	                price: 159
	            }, {
	                name: 'NBA袜子半毛圈运动高邦棉袜',
	                price: 65
	            }, {
	                name: '特步官方运动帽男女帽子2016',
	                price: 69
	            }, {
	                name: 'KELME足球训练防寒防风手套',
	                price: 4999
	            }, {
	                name: '战地吉普三合一冲锋衣',
	                price: 289
	            }, {
	                name: '探路者户外男士徒步鞋',
	                price: 369
	            }, {
	                name: '羽绒服2015秋冬新款轻薄男士',
	                price: 399
	            }, {
	                name: '溯溪鞋涉水鞋户外鞋',
	                price: 689
	            }, {
	                name: '旅行背包多功能双肩背包',
	                price: 269
	            }, {
	                name: '户外旅行双肩背包OS0099',
	                price: 99
	            }],
	            [{
	                name: '匡威男棒球开衫外套2015',
	                price: 479
	            }, {
	                name: 'adidas 阿迪达斯 训练 男子',
	                price: 335
	            }, {
	                name: '必迈BMAI一体织跑步短袖T恤',
	                price: 159
	            }, {
	                name: 'NBA袜子半毛圈运动高邦棉袜',
	                price: 65
	            }, {
	                name: '特步官方运动帽男女帽子2016',
	                price: 69
	            }, {
	                name: 'KELME足球训练防寒防风手套',
	                price: 4999
	            }, {
	                name: '战地吉普三合一冲锋衣',
	                price: 289
	            }, {
	                name: '探路者户外男士徒步鞋',
	                price: 369
	            }, {
	                name: '羽绒服2015秋冬新款轻薄男士',
	                price: 399
	            }, {
	                name: '溯溪鞋涉水鞋户外鞋',
	                price: 689
	            }, {
	                name: '旅行背包多功能双肩背包',
	                price: 269
	            }, {
	                name: '户外旅行双肩背包OS0099',
	                price: 99
	            }]
	        ]
	    }, {
	        num: '2',
	        text: '个护美妆',
	        tabs: ['热门', '国际大牌', '国际名品'],
	        offserTop:floor.$floor.eq(1).offset().top,
	        height:floor.$floor.eq(1).height(),
	        items: [
	            [{
	                name: '韩束红石榴鲜活水盈七件套装',
	                price: 169
	            }, {
	                name: '温碧泉八杯水亲亲水润五件套装',
	                price: 198
	            }, {
	                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
	                price: 79.9
	            }, {
	                name: '吉列手动剃须刀锋隐致护',
	                price: 228
	            }, {
	                name: 'Mediheal水润保湿面膜',
	                price: 119
	            }, {
	                name: '纳益其尔芦荟舒缓保湿凝胶',
	                price: 39
	            }, {
	                name: '宝拉珍选基础护肤旅行四件套',
	                price: 299
	            }, {
	                name: '温碧泉透芯润五件套装',
	                price: 257
	            }, {
	                name: '玉兰油多效修护三部曲套装',
	                price: 199
	            }, {
	                name: 'LOREAL火山岩控油清痘洁面膏',
	                price: 36
	            }, {
	                name: '百雀羚水嫩倍现盈透精华水',
	                price: 139
	            }, {
	                name: '珀莱雅新柔皙莹润三件套',
	                price: 99
	            }],
	            [{
	                name: '韩束红石榴鲜活水盈七件套装',
	                price: 169
	            }, {
	                name: '温碧泉八杯水亲亲水润五件套装',
	                price: 198
	            }, {
	                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
	                price: 79.9
	            }, {
	                name: '吉列手动剃须刀锋隐致护',
	                price: 228
	            }, {
	                name: 'Mediheal水润保湿面膜',
	                price: 119
	            }, {
	                name: '纳益其尔芦荟舒缓保湿凝胶',
	                price: 39
	            }, {
	                name: '宝拉珍选基础护肤旅行四件套',
	                price: 299
	            }, {
	                name: '温碧泉透芯润五件套装',
	                price: 257
	            }, {
	                name: '玉兰油多效修护三部曲套装',
	                price: 199
	            }, {
	                name: 'LOREAL火山岩控油清痘洁面膏',
	                price: 36
	            }, {
	                name: '百雀羚水嫩倍现盈透精华水',
	                price: 139
	            }, {
	                name: '珀莱雅新柔皙莹润三件套',
	                price: 99
	            }],
	            [{
	                name: '韩束红石榴鲜活水盈七件套装',
	                price: 169
	            }, {
	                name: '温碧泉八杯水亲亲水润五件套装',
	                price: 198
	            }, {
	                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
	                price: 79.9
	            }, {
	                name: '吉列手动剃须刀锋隐致护',
	                price: 228
	            }, {
	                name: 'Mediheal水润保湿面膜',
	                price: 119
	            }, {
	                name: '纳益其尔芦荟舒缓保湿凝胶',
	                price: 39
	            }, {
	                name: '宝拉珍选基础护肤旅行四件套',
	                price: 299
	            }, {
	                name: '温碧泉透芯润五件套装',
	                price: 257
	            }, {
	                name: '玉兰油多效修护三部曲套装',
	                price: 199
	            }, {
	                name: 'LOREAL火山岩控油清痘洁面膏',
	                price: 36
	            }, {
	                name: '百雀羚水嫩倍现盈透精华水',
	                price: 139
	            }, {
	                name: '珀莱雅新柔皙莹润三件套',
	                price: 99
	            }]
	        ]
	    }, {
	        num: '3',
	        text: '手机通讯',
	        tabs: ['热门', '品质优选', '新机尝鲜'],
	        offserTop:floor.$floor.eq(2).offset().top,
	        height:floor.$floor.eq(2).height(),
	        items: [
	            [{
	                name: '摩托罗拉 Moto Z Play',
	                price: 3999
	            }, {
	                name: 'Apple iPhone 7 (A1660)',
	                price: 6188
	            }, {
	                name: '小米 Note 全网通 白色',
	                price: 999
	            }, {
	                name: '小米5 全网通 标准版 3GB内存',
	                price: 1999
	            }, {
	                name: '荣耀7i 海岛蓝 移动联通4G手机',
	                price: 1099
	            }, {
	                name: '乐视（Le）乐2（X620）32GB',
	                price: 1099
	            }, {
	                name: 'OPPO R9 4GB+64GB内存版',
	                price: 2499
	            }, {
	                name: '魅蓝note3 全网通公开版',
	                price: 899
	            }, {
	                name: '飞利浦 X818 香槟金 全网通4G',
	                price: 1998
	            }, {
	                name: '三星 Galaxy S7（G9300）',
	                price: 4088
	            }, {
	                name: '华为 荣耀7 双卡双待双通',
	                price: 1128
	            }, {
	                name: '努比亚(nubia)Z7Max(NX505J)',
	                price: 728
	            }],
	            [{
	                name: '摩托罗拉 Moto Z Play',
	                price: 3999
	            }, {
	                name: 'Apple iPhone 7 (A1660)',
	                price: 6188
	            }, {
	                name: '小米 Note 全网通 白色',
	                price: 999
	            }, {
	                name: '小米5 全网通 标准版 3GB内存',
	                price: 1999
	            }, {
	                name: '荣耀7i 海岛蓝 移动联通4G手机',
	                price: 1099
	            }, {
	                name: '乐视（Le）乐2（X620）32GB',
	                price: 1099
	            }, {
	                name: 'OPPO R9 4GB+64GB内存版',
	                price: 2499
	            }, {
	                name: '魅蓝note3 全网通公开版',
	                price: 899
	            }, {
	                name: '飞利浦 X818 香槟金 全网通4G',
	                price: 1998
	            }, {
	                name: '三星 Galaxy S7（G9300）',
	                price: 4088
	            }, {
	                name: '华为 荣耀7 双卡双待双通',
	                price: 1128
	            }, {
	                name: '努比亚(nubia)Z7Max(NX505J)',
	                price: 728
	            }],
	            [{
	                name: '摩托罗拉 Moto Z Play',
	                price: 3999
	            }, {
	                name: 'Apple iPhone 7 (A1660)',
	                price: 6188
	            }, {
	                name: '小米 Note 全网通 白色',
	                price: 999
	            }, {
	                name: '小米5 全网通 标准版 3GB内存',
	                price: 1999
	            }, {
	                name: '荣耀7i 海岛蓝 移动联通4G手机',
	                price: 1099
	            }, {
	                name: '乐视（Le）乐2（X620）32GB',
	                price: 1099
	            }, {
	                name: 'OPPO R9 4GB+64GB内存版',
	                price: 2499
	            }, {
	                name: '魅蓝note3 全网通公开版',
	                price: 899
	            }, {
	                name: '飞利浦 X818 香槟金 全网通4G',
	                price: 1998
	            }, {
	                name: '三星 Galaxy S7（G9300）',
	                price: 4088
	            }, {
	                name: '华为 荣耀7 双卡双待双通',
	                price: 1128
	            }, {
	                name: '努比亚(nubia)Z7Max(NX505J)',
	                price: 728
	            }]
	        ]
	    }, {
	        num: '4',
	        text: '家用电器',
	        tabs: ['热门', '大家电', '生活电器'],
	        offserTop:floor.$floor.eq(3).offset().top,
	        height:floor.$floor.eq(3).height(),
	        items: [
	            [{
	                name: '暴风TV 超体电视 40X 40英寸',
	                price: 1299
	            }, {
	                name: '小米（MI）L55M5-AA 55英寸',
	                price: 3699
	            }, {
	                name: '飞利浦HTD5580/93 音响',
	                price: 2999
	            }, {
	                name: '金门子H108 5.1套装音响组合',
	                price: 1198
	            }, {
	                name: '方太ENJOY云魔方抽油烟机',
	                price: 4390
	            }, {
	                name: '美的60升预约洗浴电热水器',
	                price: 1099
	            }, {
	                name: '九阳电饭煲多功能智能电饭锅',
	                price: 159
	            }, {
	                name: '美的电烤箱家用大容量',
	                price: 329
	            }, {
	                name: '奥克斯(AUX)936破壁料理机',
	                price: 1599
	            }, {
	                name: '飞利浦面条机 HR2356/31',
	                price: 665
	            }, {
	                name: '松下NU-JA100W 家用蒸烤箱',
	                price: 1799
	            }, {
	                name: '飞利浦咖啡机 HD7751/00',
	                price: 1299
	            }],
	            [{
	                name: '暴风TV 超体电视 40X 40英寸',
	                price: 1299
	            }, {
	                name: '小米（MI）L55M5-AA 55英寸',
	                price: 3699
	            }, {
	                name: '飞利浦HTD5580/93 音响',
	                price: 2999
	            }, {
	                name: '金门子H108 5.1套装音响组合',
	                price: 1198
	            }, {
	                name: '方太ENJOY云魔方抽油烟机',
	                price: 4390
	            }, {
	                name: '美的60升预约洗浴电热水器',
	                price: 1099
	            }, {
	                name: '九阳电饭煲多功能智能电饭锅',
	                price: 159
	            }, {
	                name: '美的电烤箱家用大容量',
	                price: 329
	            }, {
	                name: '奥克斯(AUX)936破壁料理机',
	                price: 1599
	            }, {
	                name: '飞利浦面条机 HR2356/31',
	                price: 665
	            }, {
	                name: '松下NU-JA100W 家用蒸烤箱',
	                price: 1799
	            }, {
	                name: '飞利浦咖啡机 HD7751/00',
	                price: 1299
	            }],
	            [{
	                name: '暴风TV 超体电视 40X 40英寸',
	                price: 1299
	            }, {
	                name: '小米（MI）L55M5-AA 55英寸',
	                price: 3699
	            }, {
	                name: '飞利浦HTD5580/93 音响',
	                price: 2999
	            }, {
	                name: '金门子H108 5.1套装音响组合',
	                price: 1198
	            }, {
	                name: '方太ENJOY云魔方抽油烟机',
	                price: 4390
	            }, {
	                name: '美的60升预约洗浴电热水器',
	                price: 1099
	            }, {
	                name: '九阳电饭煲多功能智能电饭锅',
	                price: 159
	            }, {
	                name: '美的电烤箱家用大容量',
	                price: 329
	            }, {
	                name: '奥克斯(AUX)936破壁料理机',
	                price: 1599
	            }, {
	                name: '飞利浦面条机 HR2356/31',
	                price: 665
	            }, {
	                name: '松下NU-JA100W 家用蒸烤箱',
	                price: 1799
	            }, {
	                name: '飞利浦咖啡机 HD7751/00',
	                price: 1299
	            }]
	        ]
	    }, {
	        num: '5',
	        text: '电脑数码',
	        tabs: ['热门', '电脑/平板', '潮流影音'],
	        offserTop:floor.$floor.eq(4).offset().top,
	        height:floor.$floor.eq(4).height(),
	        items: [
	            [{
	                name: '戴尔成就Vostro 3800-R6308',
	                price: 2999
	            }, {
	                name: '联想IdeaCentre C560',
	                price: 5399
	            }, {
	                name: '惠普260-p039cn台式电脑',
	                price: 3099
	            }, {
	                name: '华硕飞行堡垒旗舰版FX-PRO',
	                price: 6599
	            }, {
	                name: '惠普(HP)暗影精灵II代PLUS',
	                price: 12999
	            }, {
	                name: '联想(Lenovo)小新700电竞版',
	                price: 5999
	            }, {
	                name: '游戏背光牧马人机械手感键盘',
	                price: 499
	            }, {
	                name: '罗技iK1200背光键盘保护套',
	                price: 799
	            }, {
	                name: '西部数据2.5英寸移动硬盘1TB',
	                price: 419
	            }, {
	                name: '新睿翼3TB 2.5英寸 移动硬盘',
	                price: 849
	            }, {
	                name: 'Rii mini i28无线迷你键盘鼠标',
	                price: 349
	            }, {
	                name: '罗技G29 力反馈游戏方向盘',
	                price: 2999
	            }],
	            [{
	                name: '戴尔成就Vostro 3800-R6308',
	                price: 2999
	            }, {
	                name: '联想IdeaCentre C560',
	                price: 5399
	            }, {
	                name: '惠普260-p039cn台式电脑',
	                price: 3099
	            }, {
	                name: '华硕飞行堡垒旗舰版FX-PRO',
	                price: 6599
	            }, {
	                name: '惠普(HP)暗影精灵II代PLUS',
	                price: 12999
	            }, {
	                name: '联想(Lenovo)小新700电竞版',
	                price: 5999
	            }, {
	                name: '游戏背光牧马人机械手感键盘',
	                price: 499
	            }, {
	                name: '罗技iK1200背光键盘保护套',
	                price: 799
	            }, {
	                name: '西部数据2.5英寸移动硬盘1TB',
	                price: 419
	            }, {
	                name: '新睿翼3TB 2.5英寸 移动硬盘',
	                price: 849
	            }, {
	                name: 'Rii mini i28无线迷你键盘鼠标',
	                price: 349
	            }, {
	                name: '罗技G29 力反馈游戏方向盘',
	                price: 2999
	            }],
	            [{
	                name: '戴尔成就Vostro 3800-R6308',
	                price: 2999
	            }, {
	                name: '联想IdeaCentre C560',
	                price: 5399
	            }, {
	                name: '惠普260-p039cn台式电脑',
	                price: 3099
	            }, {
	                name: '华硕飞行堡垒旗舰版FX-PRO',
	                price: 6599
	            }, {
	                name: '惠普(HP)暗影精灵II代PLUS',
	                price: 12999
	            }, {
	                name: '联想(Lenovo)小新700电竞版',
	                price: 5999
	            }, {
	                name: '游戏背光牧马人机械手感键盘',
	                price: 499
	            }, {
	                name: '罗技iK1200背光键盘保护套',
	                price: 799
	            }, {
	                name: '西部数据2.5英寸移动硬盘1TB',
	                price: 419
	            }, {
	                name: '新睿翼3TB 2.5英寸 移动硬盘',
	                price: 849
	            }, {
	                name: 'Rii mini i28无线迷你键盘鼠标',
	                price: 349
	            }, {
	                name: '罗技G29 力反馈游戏方向盘',
	                price: 2999
	            }]
	        ]
	    }];

	    
	   

	    /*function lazyLoadFloor(){
			var items={},
				loadedItemNum=0,
				totalItemNum=$floor.length,
				loadItemFn=null;
			$doc.on('floor-show',loadItemFn=function(e,i,elem){
				console.log(1);
				if(items[i]!=='loaded'){
					$doc.trigger('floors-loadItem',[i,elem]);
				}
				
				
			});
			$doc.on('floors-loadItem',function(e,index,elem){

				var html=buildFloor(floorData[index]),
					$elem=$(elem);
		
				items[index]='loaded';
				loadedItemNum++;
				console.log(index+':loaded');
				if(loadedItemNum===totalItemNum){
					//全部加载完毕
					$doc.trigger('floors-itemsLoaded');
					
				}
				setTimeout(function(){
					$elem.html(html);
					lazyLoadFloorImgs($elem);
					$elem.tab({
						event:'mouseenter',
						css3:false,
						js:false,
						animation:'fade',
						activeIndex:0,
						interval:0,
						delay:500
					});
				},1000);
					
			});
			$doc.on('floors-itemsLoaded',function(e){
				console.log('floors-itemsLoaded');
				//清除事件
				$doc.off('floor-show',loadItemFn);
				$win.off('scroll resize',timeToShow);
			});
		};*/
		floor.buildFloor=function (floorData){
	    	var html="";

	    	html+='<div class="container">';
	    	html+=floor.buildFloorHead(floorData);
	    	html+=floor.buildFloorBody(floorData);
	    	html+='</div>';

	    	return html;
	    };
	    floor.buildFloorHead=function (floorData){
	    	var html='';

	    	html+='<div class="floor-head">';
            html+='<h2 class="floor-title fl"><span class="floor-title-num">'+floorData.num+'F</span><span class="floor-title-text">'+floorData.text+'</span></h2>';
            html+='<ul class="tab-item-wrap fr">';

            for(var i=0;i<floorData.tabs.length;i++){
            	html+='<li class="fl"><a href="javascript:;" class="tab-item">'+floorData.tabs[i]+'</a></li>';
            	if(i!==floorData.tabs-1){
            		html+='<li class="floor-divider fl text-hidden">分隔线</li>';
            	}
            }       
            html+='</ul>';
            html+='</div>';

            return html;
	    };
	    floor.buildFloorBody=function (floorData){
	    
	    	var html='';

	    	html+='<div class="floor-body">';

	    	for(var i=0;i<floorData.items.length;i++){
	    		html+='<ul class="tab-panel">';

	    		for(var j=0;j<floorData.items[i].length;j++){
	    			html+='<li class="floor-item fl">';

	    			html+='<p class="floor-item-pic"><a href="###" target="_blank"><img src="img/floor/loading.gif" data-src="img/floor/'+floorData.num+'/'+(i+1)+'/'+(j+1)+'.png"  class="floor-img"alt="" /></a></p>';
                	html+='<p class="floor-item-name"><a href="###" target="_blank" class="link">'+floorData.items[i][j].name+'</a></p>';
                	html+='<p class="floor-item-price">￥'+floorData.items[i][j].price+'</p>';


	    			html+='</li>';
	    		}

	    		html+='</ul>';
	    	}
            html+='</div>';

            return html;
	    };

		


	    lazyLoad.isVisble=function (floorData){
			var $win=floor.$win;
			return ($win.height()+$win.scrollTop()>floorData.offserTop) && ($win.scrollTop()<floorData.offserTop+floorData.height);
		}
		floor.timeToShow=function ($elem,id){
			$elem.each(function(index,elem){
				if(lazyLoad.isVisble(floor.floorData[index])){
					floor.$doc.trigger(id+'-show',[index,elem]);
				}
			});
		}

		floor.$win.on('scroll resize',floor.showFloor=function(){
			clearTimeout(floor.floorTimer);
			floor.floorTimer=setTimeout(function(){
				floor.timeToShow(floor.$floor,'floor')
			},250);
		});

		floor.$floor.on('tab-loadItems',function(e,index,elem,success){
			imgLoader.loadImgs($(elem).find('.floor-img'),success,function($elem,url){
				$img.attr('src','img/floor/placeholder.png');
			});
		})
		floor.$doc.on('floors-loadItems',function(e,index,elem,success){
			var html=floor.buildFloor(floor.floorData[index]),
					$elem=$(elem);
				success();
				setTimeout(function(){
					$elem.html(html);
					// lazyLoadFloorImgs($elem);
					lazyLoad.lazyUntil({
						$container: $elem,
				        totalItemNum: $elem.find('.floor-img').length,
				        triggerEvent: 'tab-show',
				        id: 'tab'
					});
					$elem.tab({
						event:'mouseenter',
						css3:false,
						js:false,
						animation:'fade',
						activeIndex:0,
						interval:0,
						delay:500
					});
				},1000);
		});
		floor.$doc.on('floors-itemsLoaded',function(){
			floor.$win.off('scroll resize',floor.showFloor);
		})
		lazyLoad.lazyUntil({
			$container: floor.$doc,
	        totalItemNum: floor.$floor.length,
	        triggerEvent: 'floor-show',
	        id: 'floors'
		});
		floor.timeToShow(floor.$floor,'floor');



		// eleavtor
		floor.$elevator=$('#elevator');
		floor.$elevator.$items=floor.$elevator.find('.elevator-item');
		floor.whichFloor=function(){
			var num=-1;
			floor.$floor.each(function(index,elem){
				var floorData=floor.floorData[index];
				num=index;
				if(floor.$win.scrollTop()+floor.$win.height()/2<floorData.offserTop){
					num=index-1;
					return false;
				}
			});
			return num;
		}
		floor.setElevator=function(){
			var num=floor.whichFloor();
			if(num===-1){
				floor.$elevator.fadeOut();
			}else{
				floor.$elevator.fadeIn();
				floor.$elevator.$items.removeClass('elevator-active');
				floor.$elevator.$items.eq(num).addClass('elevator-active');
			}
		}
		floor.setElevator();
		floor.$win.on('scroll resize',function(){
			clearTimeout(floor.elevatorTimer);
			floor.elevatorTimer=setTimeout(floor.setElevator,250);
		});

		floor.$elevator.on('click','.elevator-item',function(){
			$('html,body').animate({
				scrollTop:floor.floorData[$(this).index()].offserTop
			});
		})

	// foot

		var foot={};
		foot.$foot=$('.foot');
		foot.footData=[
			{
				title:'消费者保障',
				items:[
					{text:'保障范围'},
					{text:'退货退款流程'},
					{text:'服务中心'},
					{text:'更多特色服务'},
				]
			},{
				title:'新手上路',
				items:[
					{text:'新手专区'},
					{text:'消费警示'},
					{text:'交易安全'},
					{text:'24小时在校辅助'},
					{text:'免费开店'}
				]
			},{
				title:'付款方式',
				items:[
					{text:'快捷支付'},
					{text:'信用卡'},
					{text:'余额包'},
					{text:'蜂蜜花啊'},
					{text:'货到付款'}
				]
			},{
				title:'慕淘特色',
				items:[
					{text:'手机慕淘'},
					{text:'慕淘信'},
					{text:'大众评审'},
					{text:'B格指南'},
				]
			}
		];

		foot.buildFloor=function (footData){
	    	var html="";

	    	html+='<div class="container">';
	    	html+=foot.buildFloorBody(footData);
	    	html+='</div>';

	    	return html;
	    };
	    foot.buildFloorBody=function (footData){
	    
	    	var html='';

	    	for(var i=0;i<footData.length;i++){
	    		html+='<div class="foot-item fl">';
	    		html+='<h2 class="foot-item-title">'+footData[i].title+'</h2>';
	    		for(var j=0;j<footData[i].items.length;j++){
	    			html+='<a href="###" target="_blank" class="foot-item-link">'+footData[i].items[j].text+'</a>';
	    		}
	    		html+='</div>';
	    	}
            

            return html;
	    };
	    foot.isVisble=function ($elem){
			var $win=floor.$win;
			return ($win.height()+$win.scrollTop()>$elem.offset().top) && ($win.scrollTop()<$elem.offset().top+$elem.height());
		}
	    foot.timeToShow=function (id){
	    	if(foot.isVisble(foot.$foot)){
					floor.$doc.trigger(id+'-show');
			}
		}
		foot.timeToShow=function (id){
			foot.$foot.each(function(index,elem){
				if(foot.isVisble(foot.$foot)){
					floor.$doc.trigger(id+'-show',[index,elem]);
				}
			});
		}
		floor.$win.on('scroll resize',foot.showFloor=function(){
			console.log(11111);
			clearTimeout(foot.footTimer);
			foot.footTimer=setTimeout(function(){
				foot.timeToShow('foot')
			},250);
		});
		floor.$doc.on('foot-loadItems',function(e,index,elem,success){
			var html=foot.buildFloor(foot.footData),
					$elem=$(elem);
				success();
				setTimeout(function(){
					$elem.html(html);
				},1000);
		});
		floor.$doc.on('foot-itemsLoaded',function(){
			floor.$win.off('scroll resize',foot.showFloor);
		})
		lazyLoad.lazyUntil({
			$container: floor.$doc,
	        totalItemNum: 1,
	        triggerEvent: 'foot-show',
	        id: 'foot'
		});
		foot.timeToShow('foot');
		/*floor.$doc.on('foot-show',function(e){
			foot.$foot.html(foot.buildFloor(foot.footData));
		});
		floor.$win.on('scroll resize',function(){
			clearTimeout(foot.Timer);
			foot.Timer=setTimeout(function(){
				foot.timeToShow('foot')
			},250);
		});
		// foot.timeToShow('foot');
		setTimeout(function(){
			foot.timeToShow('foot')
		},1000)*/

	// overfoot


		var overfoot={};
		overfoot.overfootData=[
			{text:'关于慕淘'},
			{text:'合作伙伴'},
			{text:'营销中心'},
			{text:'廉正举报'},
			{text:'联系客户'},
			{text:'开放平台'},
			{text:'诚征英才'},
			{text:'联系我们'},
			{text:'网站地图'},
			{text:'法律声明'},
			{text:'知识产权'},
		];
		overfoot.$overfoot=$('.overfoot');
		overfoot.buildFloor=function (overfootData){
	    	var html="";

	    	html+='<div class="overfoot-content">';
	    	html+=overfoot.buildFloorBody(overfootData);
	    	html+='</div>';
	    	html+='&copy; 2017 imooc.com All Rights Reserved';
	    	return html;
	    };
	    overfoot.buildFloorBody=function(overfootData){
	    	var html="";

	    	for(var i=0;i<overfootData.length;i++){
	    		html+='<a href="###" target="_blank" class="overfoot-content-items">'+overfootData[i].text+'</a>';
	    	}
	    	return html;
	    }
	    overfoot.timeToShow=function (id){
			overfoot.$overfoot.each(function(index,elem){
				if(foot.isVisble(overfoot.$overfoot)){
					floor.$doc.trigger(id+'-show',[index,elem]);
				}
			});
		}
	    floor.$win.on('scroll resize',overfoot.showFloor=function(){
			clearTimeout(overfoot.footTimer);
			overfoot.footTimer=setTimeout(function(){
				 overfoot.timeToShow('overfoot')
			},250);
		});
		floor.$doc.on('overfoot-loadItems',function(e,index,elem,success){
			var html=overfoot.buildFloor(overfoot.overfootData),
					$elem=$(elem);
				success();
				setTimeout(function(){
					$elem.html(html);
				},1000);
		});
		floor.$doc.on('overfoot-itemsLoaded',function(){
			floor.$win.off('scroll resize',overfoot.showFloor);
		})
		lazyLoad.lazyUntil({
			$container: floor.$doc,
	        totalItemNum: 1,
	        triggerEvent: 'overfoot-show',
	        id: 'overfoot'
		});
		 overfoot.timeToShow('overfoot');
	    /*floor.$doc.on('overfoot-show',function(e){
			overfoot.$overfoot.html(overfoot.buildFloor(overfoot.overfootData));
		});
		floor.$win.on('scroll resize',function(){
			clearTimeout(overfoot.Timer);
			overfoot.Timer=setTimeout(function(){
				foot.timeToShow('overfoot')
			},250);
		});
		// foot.timeToShow('foot');
		setTimeout(function(){
			foot.timeToShow('overfoot')
		},1000)*/

	//toolbar
	var toolbarTop=$('#backToTop');
	toolbarTop.on('click',function(){
			$('html,body').animate({
				scrollTop:0
			});
		})
})(jQuery)