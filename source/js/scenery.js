/*
 * scenery.js v0.1
 *
 * Assembled by BNOTIONS - Zach Forrester and Mark Reale
 * Copyright 2013, MIT License
 *
 */

// Creating Complete Movie
var Scenery = (function($,_){
	var Scenery = function(options){
		var defaults = {
				scenes: 7,
				scene_length: 'window',
				timeline_ele: 'html',
				stage_ele: '#stage',
				stage_height: 'window',
				scene_mgr: 'body',
				main_ele: null
			},
			options = $.extend({}, defaults, options),
			environment,
			timeline,
			scene_switch;

		if(options.main_ele){
			environment = this.environment();
			main_height = $(options.main_ele).outerHeight();
			if(main_height > this.Window.height){
				var woffset = main_height - this.Window.height;
				var mainThread = new Thread({
					element: options.main_ele,
					property: 'top',
					prop_start: 0,
					prop_end: -woffset,
					unit: 'px',
					timeline_start: 0,
					timeline_end: 100
				});
			}
		}

		$(options.stage_ele).css ({
			// position: 'fixed',
			width: '100%',
			top: 0,
			left: 0
		});

		timeline = this.timeline(options.scenes, options.scene_length, options.timeline_ele, options.stage_ele, options.stage_height, options.scene_mgr);

		scene_switch = _.bind(this.sceneSwitches, this, options.scenes, options.scene_length, options.scene_mgr);
		$(window).on('scroll',scene_switch);

		movie_resize = _.bind(this.movieResize, this, options.scene_length, options.stage_ele, options.stage_height);
		$(window).on('resize',movie_resize);

	}

	Scenery.prototype = {

		environment : function(){
			this.Window = {};
			this.Doc = {};
			this.Window.height = $(window).height();
			this.Window.width = $(window).width();
			this.Doc.height = $(document).height();
			this.Doc.width = $(document).width();

		},

		timeline : function(scenes, scene_length, timeline_ele, stage_ele, stage_height, scene_mgr){
			environment = this.environment();
			if(scene_length == 'window'){
				scene_length = this.Window.height;
			}

			$(timeline_ele).css({
				height: scene_length * scenes + 'px'
			});

			$(scene_mgr).addClass('scene-1');

			if(stage_height == 'window'){
				$(stage_ele).css({
					height: this.Window.height + 'px'
				});
			}

		},

		sceneSwitches : function(scenes, scene_length, scene_mgr){
			if(scene_length == 'window'){
				scene_length = this.Window.height;
			}
			scrollProps = {};
			scrollProps.Y = $(window).scrollTop();

			for(i = 1; i <= scenes; i++){
				if((scrollProps.Y + 20) >= scene_length * i){
					$(scene_mgr).addClass('scene-' + (i + 1));
				}
				if((scrollProps.Y + 20) < scene_length * i){
					$(scene_mgr).removeClass('scene-' + (i + 1));

				}
			}
		},

		movieResize : function(scene_length, stage_ele, stage_height){
			var self = this;
			environment = this.environment();
			if(scene_length == 'window'){
				scene_length = this.Window.height;
			}

			if(stage_height == 'window'){
				$(stage_ele).css({
					height: scene_length + 'px'
				});
			}
		}
	}
	return Scenery;
})($,_);

// Create a Thread
var Thread = (function($,_){

	var Thread = function(options){
		var defaults = {
				element : 'body',
				property : 'opacity',
				prop_start : 0,
				prop_end : 1,
				unit : '',
				timeline_start : 0,
				timeline_end : 10
			},
			options = $.extend({}, defaults, options),
			self = this,
			self_env;

		$(window).on('scroll',function(){
			scrollProps = {};
			scrollProps.Y = $(window).scrollTop();

			self_env = self.environment();
			pct_complete = ((scrollProps.Y/(self.Doc.height - self.Window.height)*100));
			// console.log('pct ' + pct_complete);
			// console.log('px ' + scrollProps.Y);
			px_start = ((options.timeline_start/100) * (self.Doc.height - self.Window.height));
			// px_end = ((options.timeline_end/100) * (self.Doc.height - self.Window.height));
                                    px_end = options.timeline_end;
			lengthOfAnimation = px_end - px_start;

			if(scrollProps.Y == 0){
				$(options.element).css(options.property,(options.prop_start + options.unit));
			}

			if(options.timeline_start < pct_complete && options.timeline_end > pct_complete){

				pctAnimationComplete = ((scrollProps.Y - px_start) / lengthOfAnimation);

				if(options.property === 'transform'){
					// console.log('translateY(' + ((parseFloat(options.prop_start)+ parseFloat((options.prop_end - options.prop_start) * (pctAnimationComplete))) + options.unit) + ')');
					$(options.element).css('-webkit-transform', 'translate3d(0, ' + ((parseFloat(options.prop_start)+ parseFloat((options.prop_end - options.prop_start) * (pctAnimationComplete))) + options.unit) + ', 0)');
				}
				else{
					$(options.element).css(options.property, (parseFloat(options.prop_start) + parseFloat((options.prop_end - options.prop_start) * (pctAnimationComplete))) + options.unit);
				}

			}
			if(pct_complete < options.timeline_start){
				$(options.element).css(options.property,(options.prop_start + options.unit));
			}

			if(pct_complete > options.timeline_end){
				$(options.element).css(options.property,(options.prop_end + options.unit));
			}
		});

	}

	Thread.prototype = {

		environment : function(){
			this.Window = {};
			this.Doc = {};
			this.Window.height = $(window).height();
			this.Window.width = $(window).width();
			this.Doc.height = $(document).height();
			this.Doc.width = $(document).width();

		}
	}

	return Thread;
})($,_);

