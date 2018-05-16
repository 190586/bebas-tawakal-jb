/*-----------------------------------------------------------------------------------*/
/*	Menu
/*-----------------------------------------------------------------------------------*/
var Menu = function() {
	
	return {
		initialize : function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('/admin/menu-content-panel', function() {
					$('.sub-menu-menu').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-tasks');
					$('.pageheader-h2-text').html(' Menu');
					$('.pageheader-module').html('Menu');
					$('.chosen-select').chosen({ width: '100%' });
					$('#orders').spinner({ min: 1, max: 150 });
					$('#shortDescription').wysihtml5({
						'stylesheets': []
					});
					$('#description').wysihtml5({
						'stylesheets': []
					});
					$('#formvalidate').validate({
						submitHandler: function(form) {
							_this.saveOrUpdate(form);
						}
					});
					$('#startTime').datepicker({'dateFormat':'yy-mm-dd'});
					$('#endTime').datepicker({'dateFormat':'yy-mm-dd'});
					$('#btn-cancel').on('click', function(evt) {
						evt.preventDefault();
						$('#menuModalForm').modal('hide');
					});
					_this.loadMenu();
				});
			});
		},
		loadMenu : function() {
			if($('#datatable1').length) {
				var _this = this;
				$('#datatable1').dataTable().fnDestroy();
				$('#datatable1').show();
				$('#datatable1').dataTable({
					'sAjaxSource' : '/api/menus',
					'sAjaxDataProp' : '_embedded.menus',
					'aoColumns' : [ 
						{ 'mData': null },
						{ 'mData': 'title' },
						{ 'mData': 'type' },
						{ 'mData': 'shortDescription' },
						{ 'mData': 'orders' },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var startTime = row.startTime.substring(0, 10).replace(/-/g, '/');
								var endTime = row.endTime.substring(0, 10).replace(/-/g, '/');
								var activeTime = startTime +' - '+ endTime;
								return activeTime;
							}, "bSortable" : false
						},
						{ 'mData': null, 'mRender': function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a onclick="Menu.detailMenu('+ id +')">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {Menu.deleteMenu('+ id +');}">Delete</a>';
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
				// Add Menu Button
				var datatableWrapper = $('#datatable1_wrapper');
				var filter = datatableWrapper.find('div[id$=_filter]');
				var newDiv = ' <label><button class="btn btn-sm btn-primary" onclick="Menu.createNewMenu();">Add Menu</button>';
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
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'idMenu';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = '/api/menus/search/all';
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
					$.map(data._embedded.menus, function(val, i) {
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
						Notification.show('danger', 'Failed to load menu');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			
			var id = data.idMenu;
			var type = id === '' ? 'POST' : 'PUT';
			var url = id === '' ? '/api/menuscustom' : '/api/menuscustom/'+ id;
			var imagePath = $('#image')[0];
			var types = new Array('image/jpg', 'image/jpeg', 'image/png');
			if(imagePath.files.length && $.inArray(imagePath.files[0].type, types) === -1) {
				$('label[for="image"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="image"]').css('display', 'block');
			} else {
				var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
				this.readImage(imagePath.files, function(result) {
					if(typeof result !== 'undefined') {
						data.imagePath = result.replace(/^data:image\/[a-z]+;base64,/, "");
						data.imagePathChanged = true;
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
							$('#menuModalForm').modal('hide');
							Notification.show('success', 'Menu saved successfully', function(){
								_this.loadMenu();
							});
						},
						'error' : function(data) {				
							if(data.status == 401) {
								Notification.show('danger', 'Session timed out, please re-login...', function(){
									Login.logout();
								});
							} else {
								Notification.show('danger', 'Failed to save menu');
							}
						}
					});
				});
			}
		},
		createNewMenu : function() {
			$('#header-title-mode').html('Create New');
			$('#header-title').html('');
			$('#idMenu').val('');
			$('#title').val('');
			$('#type').val('CAROUSEL');
			$('#type').trigger('chosen:updated');
			$('#shortDescription').data('wysihtml5').editor.setValue('');
			$('#shortDescription').autogrow();
			$('#description').data('wysihtml5').editor.setValue('');
			$('#description').autogrow();
			$('#url').val('#');
			$('#buttonText').val('');
			$('#menu-image').css('display', 'none');
			$('#menu-image').attr('src', '');
			$('#orders').val('1');
			$('#dataHref').attr('checked', false);
			$('#startTime').val('');
			$('#endTime').val('');
			$('#active').val('true');
			$('#active').trigger('chosen:updated');
			$('#menuModalForm').modal('show');
		},
		detailMenu : function(id) {
			var url = '/api/menus/'+ id;
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
						$('#idMenu').val(id);
					}
					$('#header-title-mode').html('Edit');
					$('#header-title').html('"'+ data.title +'"');
					$('#title').val(data.title);
					$('#type').val(data.type);
					$('#type').trigger('chosen:updated');
					$('#shortDescription').data('wysihtml5').editor.setValue(data.shortDescription);
					$('#shortDescription').autogrow();
					$('#description').data('wysihtml5').editor.setValue(data.description);
					$('#description').autogrow();
					$('#url').val(data.url);
					$('#buttonText').val(data.buttonText);
					if(data.imagePath != null && data.imagePath !== '') {
						$('#menu-image').attr('src', '/public/images?path='+ data.imagePath);
						$('#menu-image').css('display', 'block');
						$('#menu-image-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview header-image-preview').html('');
					} else {
						$('#menu-image').css('display', 'none');
						$('#menu-image').attr('src', '');
					}
					$('#orders').val(data.orders);
					$('#dataHref').attr('checked', data.dataHref);
					$('#startTime').val(data.startTime.substring(0, 10));
					$('#endTime').val(data.endTime.substring(0, 10));
					$('#active').val(data.active ? 'true' : 'false');
					$('#active').trigger('chosen:updated');
					$('#menuModalForm').modal('show');
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load menu');
					}
				}
			});
		},
		deleteMenu : function(id) {
			var _this = this;
			var url = '/api/menus/'+ id;
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
					Notification.show('success', 'Menu deleted successfully');
					_this.loadMenu();
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete menu');
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
