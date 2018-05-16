/*-----------------------------------------------------------------------------------*/
/*	Pages
/*-----------------------------------------------------------------------------------*/
var Pages = function() {
	
	return {
		initialize : function(isAddEditPage) {
			var _this = this;
			Login.auth(function() {
				if(isAddEditPage) {
					$('.contentpanel').load('/admin/addpage-content-panel', function() {
						$('.sub-menu-pages').addClass('active');
						$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
						$('.pageheader-h2-icon').addClass('fa fa-file-text');
						$('.pageheader-h2-text').html(' Add Page');
						$('.pageheader-module').html('Pages');
						var id = Pages.getUrlParameter('id') === '' ? '' : Pages.getUrlParameter('id');
						if(id !== '') {
							_this.detailPages(id);
						}
						$('.chosen-select').chosen({ width: '100%' });
						$('textarea').wysihtml5({
						   'stylesheets': []
						});
						$('textarea').autogrow();
						$('#header-image-image').css('display', 'none');
						$('.icon-preview').css('display', 'none');
						$('#icon-image').attr('src', '');
						$('#orders').spinner({ min: 1, max: 1000 });
						$('#formvalidate').validate({
							submitHandler: function(form) {
								Pages.saveOrUpdate(form);
							}
						});
					});
				} else {
					$('.contentpanel').load('/admin/pages-content-panel', function() {
						$('.sub-menu-pages').addClass('active');
						$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
						$('.pageheader-h2-icon').addClass('fa fa-file-text');
						$('.pageheader-h2-text').html(' Pages');
						$('.pageheader-module').html('Pages');
						_this.loadPages();
					});
				}
			});
		},
		loadPages : function() {
			if($('#datatable1').length) {
				var _this = this;
				$('#datatable1').dataTable().fnDestroy();
				$('#datatable1').show();
				$('#datatable1').dataTable({
					'sAjaxSource' : '/api/pages',
					'sAjaxDataProp' : '_embedded.pages',
					'aoColumns' : [ 
						{ "mData": null },
						{ "mData": "title" },
						{ "mData": "type" },
						{ "mData": "breadcrumb" },
						{ "mData": "code" },
						{ "mData": "orders" },
						{ "mData": null, "mRender": function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a href="/admin/addpage?id='+ id +'">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {Pages.deletePages('+ id +');}">Delete</a>';
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
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'idPage';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = '/api/pages/search/all';
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
					$.map(data._embedded.pages, function(val, i) {
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
						Notification.show('danger', 'Failed to load page');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			
			var id = data.idPage;
			var type = id === '' ? 'POST' : 'PUT';
			var url = id === '' ? '/api/pagescustom' : '/api/pagescustom/'+ id;
			var headerImage = $('#headerImage')[0], icon = $('#icon')[0];
			var types = new Array('image/jpg', 'image/jpeg', 'image/png');
			if(headerImage.files.length && $.inArray(headerImage.files[0].type, types) === -1) {
				$('label[for="headerImage"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="headerImage"]').css('display', 'block');
			} else if(icon.files.length && $.inArray(icon.files[0].type, types) === -1) {
				$('label[for="icon"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="icon"]').css('display', 'block');
			} else {
				var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
				this.readImage(headerImage.files, function(result) {
					if(typeof result !== 'undefined') {
						data.headerImagePath = result.replace(/^data:image\/[a-z]+;base64,/, "");
						data.headerImagePathChanged = true;
					}
					_this.readImage(icon.files, function(result) {
						if(typeof result !== 'undefined') {
							data.iconPath = result.replace(/^data:image\/[a-z]+;base64,/, "");
							data.iconPathChanged = true;
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
								Notification.show('success', 'Page saved successfully', function(){
									window.location.replace('/admin/pages');
								});
							},
							'error' : function(data) {				
								if(data.status == 401) {
									Notification.show('danger', 'Session timed out, please re-login...', function(){
										Login.logout();
									});
								} else {
									Notification.show('danger', 'Failed to save page');
								}
							}
						});
					});
				});
			}
		},
		detailPages : function(id) {
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			var url = '/api/pages/'+ id;
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
						$('#id-page').val(id);
					}
					$('#header-title-mode').html('Edit');
					$('#header-title').html('"'+ data.title +'"');
					$('#title').val(data.title);
					$('#type').val(data.type);
					$('#type').trigger('chosen:updated');
					$('#breadcrumb').val(data.breadcrumb);
					$('#content').val(data.content);
					$('#code').val(data.code);
					$('#button-text').val(data.buttonText);
					$('#orders').val(data.orders);
					if(data.headerImagePath != null && data.headerImagePath !== '') {
						$('#header-image-image').attr('src', '/public/images?path='+ data.headerImagePath);
						$('#header-image-image').css('display', 'block');
						$('#header-image-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview header-image-preview').html('');
					} else {
						$('#header-image-image').css('display', 'none');
						$('#header-image-image').attr('src', '');
					}
					if(data.iconPath != null && data.iconPath !== '') {
						$('#icon-image').attr('src', '/public/images?path='+ data.iconPath);
						$('.icon-preview').css('display', 'block');
						$('#icon-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview icon-preview').html('');
					} else {
						$('.icon-preview').css('display', 'none');
						$('#icon-image').attr('src', '');
					}
					$('#active').val(data.active ? 'true' : 'false');
					$('#active').trigger('chosen:updated');
				},
				'error' : function(data) {
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load page');
					}
				}
			});
		},
		deletePages : function(id) {
			var _this = this;
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			var url = '/api/pagescustom/'+ id;
			$.ajax({
				'dataType' : 'json',
				'contentType' : 'application/json',
				'type' : 'DELETE',
				'url' : url,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
				},
				'success' : function(data) {
					Notification.show('success', 'Page deleted successfully');
					_this.loadPages();
				},
				'error' : function(data) {
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete page');
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
