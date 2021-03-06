/*-----------------------------------------------------------------------------------*/
/*	Dashboard.js
/*-----------------------------------------------------------------------------------*/
var Dashboard = function () {
	return {
		initialize: function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('admin/dashboard-content-panel', function() {
					$('.sub-menu-dashboard').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-home');
					$('.pageheader-h2-text').html(' Home Page');
					$('.pageheader-module').html('Home Page');
					var fullname = Login.checkLS() ? localStorage.getItem('f') : $.cookie('f');
					$('p.lead').html('Welcome '+ fullname +',');
				});
			});
		}
	}
}();