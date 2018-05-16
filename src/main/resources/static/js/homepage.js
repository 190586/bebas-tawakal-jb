/*-----------------------------------------------------------------------------------*/
/*	Homepage
/*-----------------------------------------------------------------------------------*/
var Homepage = function() {
	
	var testimonialData = {};
	
	return {
		initialize : function() {
			this.loadProfile();
			this.loadFirstMenu();
			this.loadSecondaryMenu();
			this.loadMainCarouselBar();
			this.loadMainStaticRight();
			this.loadWhyFwd();
			this.loadTestimonial();
			this.loadCelebrate();
			this.loadBebas();
			this.loadProduct();
			this.loadCustomerPlace();
			this.loadMobileMenu();
			this.loadLeftFooter();
			this.loadRightFooter();
		},
		setScrollTo : function(element, target) {
			$(element).on('click', function(e) {
				e.preventDefault();
				$(window).scrollTo($(target), 1000, { offset : 0-$('#navbar-white').height() });
			});
		},
		loadFirstMenu : function() {
			$.getJSON('/home/list-menus/FIRST-MENU', function(data) {
				$.each(data.RESULTS, function(key, val) {
					var ref = val.dataHref === true ? 'data-href' : 'href';
					var link = $(document.createElement('li')).append($(document.createElement('a')).attr(ref, val.url).html(val.title));
					$('.first-menu').append(link);
				});
			});
		},
		loadSecondaryMenu : function() {
			var _this = this;
			$.getJSON('/home/list-menus/SECONDARY-MENU', function(data) {
				var i = 0;
				$.each(data.RESULTS, function(key, val) {
					var ref = val.dataHref === true ? 'data-href' : 'href';
					var link = $(document.createElement('li')).append($(document.createElement('a')).attr(ref, val.url).addClass('sec-menu-'+ i).html(val.title));
					$('.secondary-menu').append(link);
					if(val.dataHref) {
						_this.setScrollTo('.sec-menu-'+ i, val.url);
					}
					i++;
				});
			});
		},
		loadMobileMenu : function() {
			var _this = this, username, fullname, role, avatarPath;
			$.getJSON('/home/list-menus/MOBILE-MENU', function(data) {
				var i = 0;
				var ul = $(document.createElement('ul'));
				$.each(data.RESULTS, function(key, val) {
					var ref = val.dataHref === true ? 'data-href' : 'href';
					var link = $(document.createElement('li')).append($(document.createElement('a')).attr('id', 'mob-menu-'+i).attr(ref, val.url).append($(document.createElement('i')).addClass(val.imagePath)).append(val.title));
					ul.append(link);
					if(val.dataHref) {
						_this.setScrollTo('#mob-menu-'+ i, val.url);
					}
					i++;
				});
				$('#mobile-menu').append(ul);
			});
			if(this.checkLS()) {
				fullname = localStorage.getItem('f');
				avatarPath = localStorage.getItem('ava');
			} else {
				fullname = $.cookie('f');
				avatarPath = $.cookie('ava');
			}
			if(fullname == null) {
				$('.logged-out').show();
				$('.logged-in').hide();
			} else {
				$('.logged-out').hide();
				$('.logged-in').show();
				$('.profile-name').html(fullname);
				$('.profile-image').attr('src', '/public/images?path='+ avatarPath);
				$('.mobile-menu-btn-logout').on('click', function() {
					if(_this.checkLS()) {
						localStorage.removeItem('t');
						localStorage.removeItem('r');
						localStorage.removeItem('f');
						localStorage.removeItem('ro');
						localStorage.removeItem('u');
						localStorage.removeItem('ava');
					} else {
						$.removeCookie('t');
						$.removeCookie('r');
						$.removeCookie('f');
						$.removeCookie('ro');
						$.removeCookie('u');
						$.removeCookie('ava');
					}
					window.location = '/';
				});
			}
		},
		loadLeftFooter : function() {
			$.getJSON('/home/list-menus/FOOTER-LEFT', function(data) {
				var i = 0;
				$.each(data.RESULTS, function(key, val) {
					if(i > 0) {
						$('.footer-left').append(' | ');
					}
					$('.footer-left').append('<a href="'+ val.url +'">'+ val.title +'</a>');
					i++;
				});
			});
		},
		loadRightFooter : function() {
			$.getJSON('/home/list-menus/FOOTER-RIGHT', function(data) {
				var i = 0;
				$.each(data.RESULTS, function(key, val) {
					if(i > 0) {
						$('.footer-right').append(' | ');
					}
					$('.footer-right').append('<a href="'+ val.url +'">'+ val.title +'</a>');
					i++;
				});
			});
		},
		loadMainCarouselBar : function() {
			$.getJSON('/home/main-carousel-bar', function(data) {
				$.each(data.RESULTS, function(key, val) {
					$('#main-carousel').append('<img src="/public/images?path='+ val.imagePath +'" alt="'+ val.title +'" class="background img-responsive"></img>');
				});
				$('.jumbotron-slider').owlCarousel({
					loop: true,
					nav: false,
					items: 1,
					autoplay: true,
					autoplayTimeout: 5000,
					autoplayHoverPause: false
				});
			});
		},
		loadMainStaticRight : function() {
			$.getJSON('/home/main-static-right', function(data) {
				$.each(data.RESULTS, function(key, val) {
					$('#main-static-right').append('<div class="smalltron"><img src="/public/images?path='+ val.imagePath +'" alt="'+ val.title +'" class="smalltron-background img-responsive"></img></div>');
				});
			});
		},
		loadWhyFwd : function() {
			$.getJSON('/home/list-pages/WHY-INSURANCE', function(data) {
				$.each(data.RESULTS, function(key, val) {
					var titles = val.title.split(' ');
					titles[1] = titles.length > 1 ? titles[1] : '';
					var content = '<div class="col-xs-12 col-sm-6 col-md-3"><div class="pros-holder"><img src="/public/images?path='+ val.iconPath +'" alt="'+ val.title +'" class="img-responsive"></img><h3><span class="thick">'+ titles[0] +'</span> <br /> '+ titles[1] +'</h3><div class="detail">'+ val.content +'</div>';
					content += val.buttonText != '' && val.buttonText != null ? '<a href="'+ '/home/'+ val.code +'" class="btn btn-detail">'+ val.buttonText +'</a></div></div>' : '</div></div>';
					$('#why-fwd').append(content);
				});
				if($(window).width() > 767) {
					/*$('.testimonial-content img').load(function() {
						$('.testimonial-content').css("max-height", $('.testimonial-content').height());
					});

					$('.testimonial-content img').ready(function() {
						$('.testimonial-content').css("max-height", $('.testimonial-content').height());
					});*/

					/*var maxHeight = 0;
					$('.pros-holder').each(function() {
						if(maxHeight < $(this).height()) {
							maxHeight = $(this).height();
						}
						$('.pros-holder').height(maxHeight);
					});*/

					function setMaxHeight(element) {
						var maxHeight = 0;
						for(i = 0; i < $(element).length; i++) {
							if(maxHeight <= $(element).eq(i).height()) {
								maxHeight = $(element).eq(i).height();
							}
						}
						$(element).height(maxHeight + 20);
					}

					setMaxHeight('.homepage .section-2 .pros-holder h3');
					setMaxHeight('.pros-holder');

					//set product image to the same height

					$('.pros-holder').each(function() {
						$(this).height($(this).height() + $(this).find('a.btn-detail').height() + 10);
					});
				}

				if($(window).width() < 767) {
					if($('.homepage .section-2 .testimonial-content img').height() < $('.homepage .section-2 .testimonial-content .content').height()) {
						$('.homepage .section-2 .testimonial-content img').height($('.homepage .section-2 .testimonial-content .content').height() + 50);
					}
				}
			});
		},
		loadTestimonial : function() {
			$.getJSON('/home/testimonial', function(data) {
				$.each(data.RESULTS, function(key, val) {
					var content = '';
					if(val.prime) {
						content = '<div class="col-xs-12 col-md-6 featured-testimonial-col"><div class="bg"><img src="/public/images?path='+ val.imageBackgroundPath +'" alt="Featured Testimonial" class="img-responsive"></img></div><div class="detail"><p class="big">'+ val.name +'</p><p class="small">'+ val.occupation +'</p><p class="small"><a href="'+ val.website +'">'+ val.website +'</a></p></div></div><div class="col-xs-12 col-md-6 featured-testimonial-col"><div class="featured-testimonial-text">'+ val.content +'</div></div>';
						$('#primary-testimonial').append(content);
					} else {
						content = '<div class="testimonial-content"><div class="profile-picture"><img src="/public/images?path='+ val.avatarPath +'" alt="Testimoni Person" class="img-responsive"></img></div>'+ val.content +'<div class="testimonial-user-detail"><p class="name">'+ val.name +'</p><p class="detail">'+ val.age +' Tahun, '+ val.occupation +'</p></div></div>';
						$('#list-testimonial').append(content);
					}
				});
				$('.testimonial-list').addClass('owl-carousel');
				$('.testimonial-list').addClass('owl-theme');
				$('.testimonial-list').owlCarousel({
					loop: true,
					nav: true,
					dots: true,
					margin: 29,
					responsive: {
						0 : {
							items: 1,
							stagePadding: 60,
							dots: false
						},

						768 : {
							items: 3
						},

						992: {
							items: 4
						}

					}
				});

				//set testimonial to the same height
				var testiHeight = 0;
				$('.testimonial-content').each(function() {
					if(testiHeight < $(this).height()) {
						testiHeight = $(this).height() + $(this).find('.testimonial-user-detail').height() + 30;
					}
				});
				$('.testimonial-content').height(testiHeight);

				$('#testi-prev').click(function() {
					$('.testimonial-list .owl-prev').trigger("click");
				});

				$('#testi-next').click(function() {
					$('.testimonial-list .owl-next').trigger("click");
				});	
			});
			$('.btn-write-testimoni').on('click', function() {
				$('.modal-body').html('');
				$('.modal-body').load('testi-regist');
			});
		},
		resetTestimonial : function() {
			testimonialData = {};
		},
		registerTestimonial : function(data) {
			testimonialData = data;
		},
		loadTemporaryTestimonial : function() {
			return testimonialData;
		},
		saveTestimonial : function(data, callback) {
			if(data.avatarPathChanged) {
				data.avatarPath = data.avatarPath.replace(/^data:image\/[a-z]+;base64,/, "");
			}
			data = JSON.stringify(data);
			$.ajax({
				'dataType' : 'json',
				'contentType' : 'application/json',
				'type' : 'POST',
				'url' : '/api/testimonialscustom/',
				'data' : data,
				'success' : function(data) {
					callback('success');
				},
				'error' : function() {
					callback('fail');
				}
			});
		},
		loadCelebrate : function() {
			$.getJSON('/home/celebrate', function(data) {
				var val = data.RESULTS[0];
				var content = '<div class="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"><h2 class="section-title orange">'+ val.title +'</h2>'+ (val.breadcrumb !== null ? val.breadcrumb : val.content) +'</div>';
				$('#celebrate').append(content);
				$('#celebrate-bg').attr('src', '/public/images?path='+ val.headerImagePath);
			});
		},
		loadBebas : function() {
			$.getJSON('/home/list-pages/BEBAS', function(data) {
				var i=0;
				var reversedData = data.RESULTS.reverse();
				$.each(reversedData, function(key, val) {
					var position = i <= 1 ? 'right' : 'left';
					var content = '<div class="col-xs-12 col-sm-6 pl-0 pr-0"><div class="product-holder '+ position +'"><img src="/public/images?path='+ val.headerImagePath +'" alt="'+ val.title +'" class="img-responsive"></img><a href="'+ '/home/'+ val.code +'"><div class="product-desc"><h3>'+ val.title +'</h3>'+ val.breadcrumb +'</div></a></div></div>';
					$('#bebas').prepend(content);
					i++;
				});
			});
		},
		loadProduct : function() {
			$.getJSON('/home/list-pages/PRODUCT', function(data) {
				$.each(data.RESULTS, function(key, val) {
					$('#product-list').append('<li><a href="'+ '/home/'+val.code +'">'+ val.title +'</a></li>');
				});
			});
		},
		loadCustomerPlace : function() {
			$.getJSON('/home/list-pages/CUSTOMER-PLACE', function(data) {
				$.each(data.RESULTS, function(key, val) {
					$('#customer-place-list').append('<li><a href="'+ '/home/'+val.code +'">'+ val.title +'</a></li>');
				});
			});
		},
		loadProfile : function() {
			$.getJSON('/home/profile', function(data) {
				var val = data.RESULTS[0];
				$('.socmed-instagram').attr('href', val.instagramLink);
				$('.socmed-youtube').attr('href', val.youtubeLink);
				$('.socmed-facebook').attr('href', val.facebookLink);
				$('.socmed-twitter').attr('href', val.twitterLink);
				$('.hotline-number').html(val.hotline);
				$('.main-logo').attr('src', '/public/images?path='+ val.logo);
			});
		}, 
		readImage : function(inputFile, callback) {
			if(inputFile.length) {
				var imageToRead = inputFile[0];
				var reader = new FileReader();
				reader.onload = function () {
					data = reader.result;
					callback(data);
				};
				reader.readAsDataURL(imageToRead);
			} else {
				callback();
			}
		},
		checkLS: function() {
			try {
				localStorage.setItem('test', 'test');
				localStorage.removeItem('test');
				return true;
			} catch(e) {
				return false;
			}
		}
	}
}();

$(document).ready(function() {
	Homepage.initialize();
});
