/*-----------------------------------------------------------------------------------*/
/*	Login.js
/*-----------------------------------------------------------------------------------*/
var Login = function () {
	return {
		initialize: function(isLogin) {
			var _this = this;
			if(isLogin) {
				$('#login-warning').hide();
				$('#loginform').validate({
					submitHandler: function(form) {
						_this.login();
					}
				});
			} else {
				var username, fullname, role, avatarPath;
				if(_this.checkLS()) {
					username = localStorage.getItem('u');
					fullname = localStorage.getItem('f');
					role = localStorage.getItem('ro');
					avatarPath = localStorage.getItem('ava');
				} else {
					username = $.cookie('u');
					fullname = $.cookie('f');
					role = $.cookie('ro');
					avatarPath = $.cookie('ava');
				}
				$('.my-role').html(role);
				$('.my-fullname').html(fullname);
				$('.my-avatar-path').attr('src', '/public/images?path='+ avatarPath);
				$('.sign-out-button').on('click', function(evt){
					evt.preventDefault();
					_this.logout();
				});
				Testimonial.loadNotification();
				this.loadModule();
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
		},
		logout: function() {
			if(this.checkLS()) {
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
			window.location = '/login';
		},
		auth: function(callback) {
			if(this.checkLS()) {
				if(localStorage.getItem('t') && localStorage.getItem('r')) {
					callback();
					return;
				}
			} else {
				if($.cookie('t') && $.cookie('r')) {
					callback();
					return;
				} 
			}
			window.location = '/login';
		},
		login: function() {
			var _this = this;
			$('#login-warning').hide();
			$('#login-button').attr('disabled', true);
			var home = '/admin';
			var username = $('#username').val();
			var password = $('#password').val();
			var url = 'oauth/token?grant_type=password&username='+ username +'&password='+ password;
			$.ajax({
				'dataType' : 'json',
				'type' : 'GET',
				'url' : url,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Basic dGFsZW50czpzZWNyZXQ='); 
				},
				'success' : function(data) {
					if(data.access_token != null) {
						if(_this.checkLS()) {
							localStorage.setItem('t', data.access_token);
							localStorage.setItem('r', data.refresh_token);
						} else {
							$.cookie("t", data.access_token);
							$.cookie("r", data.refresh_token);
						}
						$.ajax({
							'dataType' : 'json',
							'type' : 'GET',
							'url' : 'api/usercustom/view',
							'beforeSend' : function (xhr){ 
								xhr.setRequestHeader('Authorization', 'Bearer '+ data.access_token); 
							},
							'success' : function(data) {
								if(data.ERROR_CODE == '00') {
									if(_this.checkLS()) {
										localStorage.setItem('u', data.RESULTS.username);
										localStorage.setItem('f', data.RESULTS.fullname);
										localStorage.setItem('ro', data.RESULTS.role);
										localStorage.setItem('ava', data.RESULTS.avatarPath);
									} else {
										$.cookie('u', data.RESULTS.username);
										$.cookie('f', data.RESULTS.fullname);
										$.cookie('ro', data.RESULTS.role);
										$.cookie('ava', data.RESULTS.avatarPath);
									}
									window.location = home;
								} else {
									$('#login-warning').show();
									$('#login-button').attr('disabled', false);
								}
							},
							'error' : function(data) {
								$('#login-warning').show();
								$('#login-button').attr('disabled', false);
							}
						});
					}
				},
				'error' : function(data) {
					$('#login-warning').show();
					$('#login-button').attr('disabled', false);
				}
			});
		},
		loadModule: function(module) {
			$('ul.main-menu li').each(function(i){
				$(this).removeClass('active');
			});
			switch(module) {
				case 'pages' : 
					Pages.initialize(false);
					break;
				case 'addpage' : 
					Pages.initialize(true);
					break;	
				case 'testimonial' : 
					Testimonial.initialize();
					break;
				case 'menu' :
					Menu.initialize();
					break;
				case 'profile' :
					Profile.initialize();
					break;
				case 'myprofile' :
					Profile.initialize();
					break;	
				case 'user' :
					User.initialize();
					break;
				default :
					$('.sub-menu-dashboard').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-home');
					$('.pageheader-h2-text').html(' Dashboard');
					$('.pageheader-module').html('Dashboard');
					$('.contentpanel').html('');
					break;
			}
		}
	}
}();