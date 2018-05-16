/*-----------------------------------------------------------------------------------*/
/*	Testimonial
/*-----------------------------------------------------------------------------------*/
var Testimonial = function() {
	
	return {
		initialize : function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('/admin/testimoni-content-panel', function() {
					$('.sub-menu-testimonial').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-envelope-o');
					$('.pageheader-h2-text').html(' Testimonial');
					$('.pageheader-module').html('Testimonial');
					$('#age').spinner({ min: 1, max: 150 });
					$('#content').wysihtml5({
						'stylesheets': []
					});
					$('#formvalidate').validate({
						submitHandler: function(form) {
							_this.saveOrUpdate(form);
						}
					});
					$('#btn-cancel').on('click', function(evt) {
						evt.preventDefault();
						$('#testimonialModalForm').modal('hide');
					});
					_this.loadTestimonial();
				});
			});
		},
		loadTestimonial : function() {
			if($('#datatable1').length) {
				var _this = this;
				$('#datatable1').dataTable().fnDestroy();
				$('#datatable1').show();
				$('#datatable1').dataTable({
					'sAjaxSource' : '/api/testimonials',
					'sAjaxDataProp' : '_embedded.testimonials',
					'aoColumns' : [ 
						{ 'mData': null },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var img = '<div align="center"><img src="/public/images?path='+ row.avatarPath +'" style="width:90px;height:90px;padding:3px;border:thin solid #dddddd;border-radius:5px;"></div>';
								return img;
							}
						},
						{ 'mData': null, 'mRender': function (data, type, row) {
								var name = row.name + ' ('+ row.occupation +')';
								return name;
							}
						},
						{ 'mData': 'age' },
						{ 'mData': 'website' },
						{ 'mData': 'content' },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a onclick="Testimonial.detailTestimonial('+ id +')">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {Testimonial.deleteTestimonial('+ id +');}">Delete</a>';
								return action;
							}, "bSortable" : false
						}
					],
					'bServerSide' : true,
					'fnServerData' : _this.serverDataProcessor,
					'fnRowCallback': function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
						var size = aData.pageSize;
						var page = aData.pageNum;
						var index = (page * size + (iDisplayIndex +1));
						$('td:eq(0)', nRow).html(index);
						if (aData.prime){
							$(nRow).css({'background-color':'#001122'});
						}
						
						return nRow;
					}
				});
			}
		},
		serverDataProcessor : function(sSource, aoData, fnCallback) {	
			//extract name/value pairs into a simpler map for use later
			var paramMap = {};
			for ( var i = 0; i < aoData.length; i++) {
				paramMap[aoData[i].name] = aoData[i].value;
			}

			//page calculations
			var pageSize = paramMap.iDisplayLength;
			var start = paramMap.iDisplayStart;
			var pageNum = (start == 0) ? 0 : (start / pageSize); // pageNum is 0 based
			
			// extract sort information
			var sortCol = paramMap.iSortCol_0;
			var sortDir = paramMap.sSortDir_0;
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'idTestimonial';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = '/api/testimonials/search/all';
				restParams.push({ "name" : "q", "value" :  paramMap.sSearch});
			}
			
			//finally, make the request
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			$.ajax({
				'dataType' : 'json',
				'type' : 'GET',
				'url' : url,
				'data' : restParams,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
				},
				'success' : function(data) {
					data.iTotalRecords = data.page.size;
					data.iTotalDisplayRecords = data.page.totalElements;
					$.map(data._embedded.testimonials, function(val, i) {
						val.pageNum = pageNum;
						val.pageSize = pageSize;
					});

					fnCallback(data);
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load testimonial');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			
			var id = data.idTestimonial;
			var avatar = $('#avatar')[0], imageBackground = $('#imageBackground')[0];
			var types = new Array('image/jpg', 'image/jpeg', 'image/png');
			if(avatar.files.length && $.inArray(avatar.files[0].type, types) === -1) {
				$('label[for="avatar"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="avatar"]').css('display', 'block');
			} else if(imageBackground.files.length && $.inArray(imageBackground.files[0].type, types) === -1) {
				$('label[for="avatar"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="avatar"]').css('display', 'block');
			} else {
				var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
				this.readImage(imageBackground.files, function(result) {
					if(typeof result !== 'undefined') {
						data.imageBackgroundPath = result.replace(/^data:image\/[a-z]+;base64,/, "");
						data.imageBackgroundPathChanged = true;
					}
					_this.readImage(avatar.files, function(result) {
						if(typeof result !== 'undefined') {
							data.avatarPath = result.replace(/^data:image\/[a-z]+;base64,/, "");
							data.avatarPathChanged = true;
						}
						data = JSON.stringify(data);
						$.ajax({
							'dataType' : 'json',
							'contentType' : 'application/json',
							'type' : 'PUT',
							'url' : '/api/testimonialscustom/'+ id,
							'data' : data,
							'beforeSend' : function (xhr){ 
								xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
							},
							'success' : function(data) {
								$('#testimonialModalForm').modal('hide');
								Notification.show('success', 'Testimonial saved successfully', function(){
									_this.loadTestimonial();
									_this.loadNotification();
								});
							},
							'error' : function(data) {				
								if(data.status == 401) {
									Notification.show('danger', 'Session timed out, please re-login...', function(){
										Login.logout();
									});
								} else {
									Notification.show('danger', 'Failed to save testimonial');
								}
							}
						});
					});
				});
			}
		},
		detailTestimonial : function(id) {
			var url = '/api/testimonials/'+ id;
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			$.ajax({
				'dataType' : 'json',
				'type' : 'GET',
				'url' : url,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
				},
				'success' : function(data) {
					var hrefs = data._links.self.href.split('/');
					var id = hrefs[hrefs.length - 1];
					if($.isNumeric(id)) {
						$('#idTestimonial').val(id);
					}
					$('#name').val(data.name);
					$('#age').val(data.age);
					$('#occupation').val(data.occupation);
					$('#website').val(data.website);
					$('#content').data('wysihtml5').editor.setValue(data.content);
					$('#content').autogrow();
					if(data.avatarPath != null && data.avatarPath !== '') {
						$('#avatar-image').attr('src', '/public/images?path='+ data.avatarPath);
						$('.avatar-preview').css('display', 'block');
						$('#avatar-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview').html('');
					} else {
						$('.avatar-preview').css('display', 'none');
						$('#avatar-image').attr('src', '');
					}
					if(data.imageBackgroundPath != null && data.imageBackgroundPath !== '') {
						$('#background-image').attr('src', '/public/images?path='+ data.imageBackgroundPath);
						$('#background-image').css('display', 'block');
						$('#background-image-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview background-image-preview').html('');
					} else {
						$('#background-image').css('display', 'none');
						$('#background-image').attr('src', '');
					}
					$('#prime').attr('checked', data.prime);
					$('#approval').attr('checked', data.approval);
					$('#testimonialModalForm').modal('show');
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load testimonial');
					}
				}
			});
		},
		deleteTestimonial : function(id) {
			var _this = this;
			var url = '/api/testimonialscustom/'+ id;
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			$.ajax({
				'dataType' : 'json',
				'contentType' : 'application/json',
				'type' : 'DELETE',
				'url' : url,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
				},
				'success' : function(data) {
					Notification.show('success', 'Testimonial deleted successfully');
					_this.loadTestimonial();
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete testimonial');
					}
				}
			});
		},
		loadNotification : function() {
			var _this = this;
			var restParams = new Array();
			restParams.push({ 'name' : 'q', 'value' : false});
			var url = '/api/testimonials/search/approval';
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			$.ajax({
				'dataType' : 'json',
				'type' : 'GET',
				'url' : url,
				'data' : restParams,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
				},
				'success' : function(data) {
					var total = data.page.totalElements, contents = '';
					$('.header-notification-title').html('You Have '+ total +' New Testimonials');
					if(total > 0) {
						$('.header-notification-badge').html(total);
						$.map(data._embedded.testimonials, function(val, i) {
							contents += '<li class="new"><a onclick="Login.loadModule(\'testimonial\');"><span class="thumb"><img src="/public/images?path='+ val.avatarPath +'" alt="" /></span><span class="desc"><span class="name">'+ val.name +' ('+ val.age +')<span class="badge badge-success">new</span></span><span class="msg">'+ val.occupation +'</span></span></a></li>';
						});
						contents += '<li class="new"><a onclick="Login.loadModule(\'testimonial\');">See All New Testimonials</a></li>';
						$('.header-notification-list').html(contents);
					} else {
						$('.header-notification').hide();
					}
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load notification');
					}
				}
			});
		},
		getUrlParameter : function(name) {
			name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
			var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
			var results = regex.exec(location.search);
			return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
		}
	}
}();
