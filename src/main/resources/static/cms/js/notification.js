/*-----------------------------------------------------------------------------------*/
/*	Notification
/*-----------------------------------------------------------------------------------*/
var Notification = function () {
	return {
		show: function(type, content, callback) {
			if(($('.modal').data('bs.modal') || {}).isShown) {
				var id = '#embeddedNotification';
				$(id).prop('class', 'alert alert-'+ type);
				$(id).html('<div align="center">'+ content +'</div>');
				$(id).show();
			} else {
				$('#notification').prop('class', 'alert alert-'+ type);
				$('#notification').html('<div align="center">'+ content +'</div>');
				if($('#modalNotification').prop('class') == 'modal fade') {
					$('#modalNotification').modal('show');
				}
			}
			if(callback) {
				$('#modalNotification').on('click', function() {
					callback();
				});
			}
		},
		hide: function() {
			if($('#modalNotification').prop('class') == 'modal fade') {
				$('#modalNotification').modal('hide');
			}
			var id = '#embeddedNotification';
			$(id).hide();
		}
	}
}();

