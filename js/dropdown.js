(function($){
	'use strict';

	function Dropdown($elem,options){
			this.$elem=$elem;
 			this.activeClass=options.active+'-active';
 			this.$layer=this.$elem.find('.dropdown-layer');
 			this.options=options;
 			this._init();
	}
	Dropdown.DEFAULTS={
		event:'hover',
		css3:false,
		js:true,
		animation:'fade',
		active:'dropdown',
		delay:0
	};
	Dropdown.prototype._init=function(){
		this.$layer.showHide(this.options);
		var self=this;
		//var self=this//保存this

		this.$layer.on('show shown hide hidden',function(e){
			self.$elem.trigger('dropdown-'+e.type,function(){
				self.$layer.height('auto');
			});
		});
		
		if(this.options.event==='click'){
			this.$elem.on('click',function(e){
				self.show();
				e.stopPropagation();//阻止冒泡
			});
			$(document).on('click',$.proxy(this.hide,this));
		}else{
			this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));
		}
	}
	Dropdown.prototype.show=function(){
		var self=this;
		if(this.options.delay){
			this.timer=setTimeout(function(){
				_show();
			},this.options.delay);
		}else{
			_show();
		}
		function _show(){
			self.$elem.addClass(self.activeClass);
			self.$layer.showHide('show');
		} 
	}
	Dropdown.prototype.hide=function(){
		if(this.options.delay){
			clearTimeout(this.timer);
		}
		this.$elem.removeClass(this.activeClass);
	 	this.$layer.showHide('hide');
	}
	 $.fn.extend({
	 	dropdown:function(option){
	 		return this.each(function(){
	 			var $this=$(this);
	 			var dropdown=$this.data('dropdown');
	 			var options=$.extend({},Dropdown.DEFAULTS,$this.data(),typeof option==='object'&&option);
	 			if(!dropdown){$this.data('dropdown',dropdown=new Dropdown($this,options));}
	 			
	 			if(typeof dropdown[option]==='function'){
	 				dropdown[option]();
	 			}
	 		});
	 	}
	 });
})(jQuery);