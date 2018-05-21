/*-----------------------------------------------------------------------------------*/
/*	Partner
/*-----------------------------------------------------------------------------------*/
var Partner = function() {
	
	return {
		initialize : function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('admin/partner-content-panel', function() {
					$('.sub-menu-partner').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-handshake-o');
					$('.pageheader-h2-text').html(' Partner');
					$('.pageheader-module').html('Partner');
					$('.wysihtml5text').wysihtml5({
						'stylesheets': []
					});
					$('#formvalidate').validate({
						submitHandler: function(form) {
							_this.saveOrUpdate(form);
						}
					});
					$('#btn-cancel').on('click', function(evt) {
						evt.preventDefault();
						$('#partnerModalForm').modal('hide');
					});
					_this.load();
				});
			});
		},
		load : function() {
			if($('#datatable1').length) {
				var _this = this;
				$('#datatable1').dataTable().fnDestroy();
				$('#datatable1').show();
				$('#datatable1').dataTable({
					'sAjaxSource' : 'api/partner',
					'sAjaxDataProp' : '_embedded.partner',
					'aoColumns' : [ 
						{ 'mData': null, 'sWidth' : '5%' },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var img = '<div align="center"><img src="public/images?path='+ row.avatarPath +'" style="width:90px;height:90px;padding:3px;border:thin solid #dddddd;border-radius:5px;"></div>';
								return img;
							}
						},
						{ 'mData': null, 'mRender': function (data, type, row) {
								var name = (row.companyName == undefined || row.companyName == null ? '-' : row.companyName + '<br>');
								name += (row.name == undefined || row.name == null ? '' : row.name + '<br>');
								name += (row.phone == undefined || row.phone == null ? '' : row.phone +'<br>');
								name += (row.phone2 == undefined || row.phone2 == null ? '' : row.phone2 +'<br>');
								name += (row.website == undefined || row.website == null ? '' : row.website +'<br>');
								name += (row.email == undefined || row.email == null ? '' : row.email +'<br>');
								return name;
							}
						},
						{ 'mData': 'address' },
						{ 'mData': 'content' },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a onclick="Partner.detail('+ id +')">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {Partner.delete('+ id +');}">Delete</a>';
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
				// Add Partner Button
				var datatableWrapper = $('#datatable1_wrapper');
				var filter = datatableWrapper.find('div[id$=_filter]');
				var newDiv = ' <label><button class="btn btn-sm btn-primary" onclick="Partner.detail();">Add Partner</button>';
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
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'id';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = 'api/partner/search/all';
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
					$.map(data._embedded.partner, function(val, i) {
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
						Notification.show('danger', 'Failed to load partner');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			
			var id = data.id;
			var avatar = $('#avatar')[0];
			var types = new Array('image/jpg', 'image/jpeg', 'image/png');
			if(avatar.files.length && $.inArray(avatar.files[0].type, types) === -1) {
				$('label[for="avatar"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="avatar"]').css('display', 'block');
			} else {
				var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
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
						'url' : 'api/partnercustom/'+ id,
						'data' : data,
						'beforeSend' : function (xhr){ 
							xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
						},
						'success' : function(data) {
							if(data.RESULTS) {
								$('#partnerModalForm').modal('hide');
								Notification.show('success', 'Partner saved successfully', function(){
									_this.load();
									_this.loadNotification();
								});
							} else {
								Notification.show('danger', 'Failed to save partner');
							}
						},
						'error' : function(data) {				
							if(data.status == 401) {
								Notification.show('danger', 'Session timed out, please re-login...', function(){
									Login.logout();
								});
							} else {
								Notification.show('danger', 'Failed to save partner');
							}
						}
					});
				});
			}
		},
		detail : function(id) {
			if(id == undefined) {
				$('#companyName').val('');
				$('#email').val('');
				$('#phone').val('');
				$('#phone2').val('');
				$('#website').val('');
				$('#address').data('wysihtml5').editor.setValue('');
				$('#address').autogrow();
				$('#content').data('wysihtml5').editor.setValue('');
				$('#content').autogrow();
				$('.avatar-preview').css('display', 'none');
				$('#avatar-image').attr('src', '');
				$('#approval').attr('checked', false);
				$('#partnerModalForm').modal('show');
			} else {
				var url = 'api/partner/'+ id;
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
							$('#id').val(id);
						}
						$('#companyName').val(data.companyName);
						$('#email').val(data.email);
						$('#phone').val(data.phone);
						$('#phone2').val(data.phone2);
						$('#website').val(data.website);
						$('#address').data('wysihtml5').editor.setValue(data.address);
						$('#address').autogrow();
						$('#content').data('wysihtml5').editor.setValue(data.content);
						$('#content').autogrow();
						if(data.avatarPath != null && data.avatarPath !== '') {
							$('#avatar-image').attr('src', 'public/images?path='+ data.avatarPath);
							$('.avatar-preview').css('display', 'block');
							$('#avatar-fileupload').attr('class', 'fileupload fileupload-new');
							$('.fileupload-preview').html('');
						} else {
							$('.avatar-preview').css('display', 'none');
							$('#avatar-image').attr('src', '');
						}
						$('#approval').attr('checked', data.approval);
						$('#partnerModalForm').modal('show');
					},
					'error' : function(data) {				
						if(data.status == 401) {
							Notification.show('danger', 'Session timed out, please re-login...', function(){
								Login.logout();
							});
						} else {
							Notification.show('danger', 'Failed to load partner');
						}
					}
				});
			}
		},
		delete : function(id) {
			var _this = this;
			var url = 'api/partnercustom/'+ id;
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
					Notification.show('success', 'Partner deleted successfully');
					_this.load();
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete partner');
					}
				}
			});
		},
		loadNotification : function() {
			var _this = this;
			var restParams = new Array();
			restParams.push({ 'name' : 'q', 'value' : false});
			var url = 'api/partner/search/approval';
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
					$('.header-notification-title').html('You Have '+ total +' New Partners');
					if(total > 0) {
						$('.header-notification-badge').html(total);
						$.map(data._embedded.partner, function(val, i) {
							contents += '<li class="new"><a onclick="Login.loadModule(\'partner\');"><span class="thumb"><img src="public/images?path='+ val.avatarPath +'" alt="" /></span><span class="desc"><span class="name">'+ val.name +' ('+ val.age +')<span class="badge badge-success">new</span></span><span class="msg">'+ val.occupation +'</span></span></a></li>';
						});
						contents += '<li class="new"><a onclick="Login.loadModule(\'partner\');">See All New Partners</a></li>';
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
