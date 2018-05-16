/*-----------------------------------------------------------------------------------*/
/*	User
/*-----------------------------------------------------------------------------------*/
var User = function() {
	
	return {
		initialize : function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('/admin/users-content-panel', function() {
					$('.sub-menu-user').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-users');
					$('.pageheader-h2-text').html(' Users');
					$('.pageheader-module').html('Users');
					$('.chosen-select').chosen({ width: '100%' });
					$('#formvalidate').validate({
						submitHandler: function(form) {
							_this.saveOrUpdate(form);
						}
					});
					$('#btn-cancel').on('click', function(evt) {
						evt.preventDefault();
						$('#userModalForm').modal('hide');
					});
					_this.loadUser();
				});
			});
		},
		loadUser : function() {
			var urlGetImage = '/public/images';
			if($('#datatable1').length) {
				var _this = this;
				$('#datatable1').dataTable().fnDestroy();
				$('#datatable1').show();
				$('#datatable1').dataTable({
					'sAjaxSource' : '/api/users',
					'sAjaxDataProp' : '_embedded.users',
					'aoColumns' : [ 
						{ 'mData': null },
						{ 'mData': 'username' },
						{ 'mData': 'fullname' },
						{ 'mData': 'role' },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var img = '<div align="center"><img src="'+ urlGetImage+'?path='+row.avatarPath +'" style="padding:3px;border:thin solid #dddddd;border-radius:5px;"></div>';
								return img;
							}
						},
						{ 'mData': null, 'mRender': function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a onclick="User.detailUser('+ id +')">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {User.deleteUser('+ id +');}">Delete</a>';
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
						if (!aData.active){
							$(nRow).css({'background-color':'#ffaabb'});
						}
						
						return nRow;
					}
				});
				// Add User Button
				var datatableWrapper = $('#datatable1_wrapper');
				var filter = datatableWrapper.find('div[id$=_filter]');
				var newDiv = ' <label><button class="btn btn-sm btn-primary" onclick="User.createNewUser();">Add User</button>';
				filter.append(newDiv);
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
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'idUser';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = '/api/users/search/all';
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
					$.map(data._embedded.users, function(val, i) {
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
						Notification.show('danger', 'Failed to load user');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			
			var id = data.idUser;
			var type = id === '' ? 'POST' : 'PUT';
			var url = id === '' ? '/api/usercustom' : '/api/usercustom/'+ id;
			var imagePath = $('#avatar')[0];
			var types = new Array('image/jpg', 'image/jpeg', 'image/png');
			if(imagePath.files.length && $.inArray(imagePath.files[0].type, types) === -1) {
				$('label[for="image"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="image"]').css('display', 'block');
			} else {
				var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
				this.readImage(imagePath.files, function(result) {
					if(typeof result !== 'undefined') {
						var strImage = result.replace(/^data:image\/[a-z]+;base64,/, "");
						data.avatarPath = strImage;
						data.avatarChanged = true;
					}
					data = JSON.stringify(data);
					$.ajax({
						'dataType' : 'json',
						'contentType' : 'application/json',
						'type' : type,
						'url' : url,
						'data' : data,
						'beforeSend' : function (xhr){ 
							xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
						},
						'success' : function(data) {
							$('#userModalForm').modal('hide');
							Notification.show('success', 'User saved successfully', function(){
								_this.loadUser();
							});
						},					
						'error' : function(data) {				
							if(data.status == 401) {
								Notification.show('danger', 'Session timed out, please re-login...', function(){
									Login.logout();
								});
							} else {
								Notification.show('danger', 'Failed to save user');
							}
						}
					});
				});
			}
		},
		createNewUser : function() {
			$('#header-title-mode').html('Create New');
			$('#header-title').html('');
			$('#idUser').val('');
			$('#username').val('');
			$('#password').val('');
			$('#fullname').val('');
			$('#role').val('');
			$('.avatar-preview').css('display', 'none');
			$('#avatar-image').attr('src', '');
			$('#avatar-fileupload').attr('class', 'fileupload fileupload-new');
			$('.fileupload-preview').html('');
			Notification.hide();
			$('#userModalForm').modal('show');
		},
		detailUser : function(id) {
			var url = '/api/users/'+ id;
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
						$('#idUser').val(id);
					}
					$('#header-title-mode').html('Edit');
					$('#header-title').html('"'+ data.username +'"');
					$('#username').val(data.username);
					$('#password').val('*******');
					$('#fullname').val(data.fullname);
					$('#role').val(data.role);
					$('#role').trigger('chosen:updated');
					if(data.avatarPath != null && data.avatarPath !== '') {
						$('#avatar-image').attr('src', '/public/images?path='+ data.avatarPath);
						$('.avatar-preview').css('display', 'block');
						$('#avatar-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview').html('');
					} else {
						$('.avatar-preview').css('display', 'none');
						$('#avatar-image').attr('src', '');
					}
					$('#active').val(data.active ? 'true' : 'false');
					$('#active').trigger('chosen:updated');
					Notification.hide();
					$('#userModalForm').modal('show');
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load user');
					}
				}
			});
		},
		deleteUser : function(id) {
			var _this = this;
			var url = '/api/users/'+ id;
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
					Notification.show('success', 'User deleted successfully');
					_this.loadUser();
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete user');
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
