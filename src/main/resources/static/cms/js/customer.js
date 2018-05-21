/*-----------------------------------------------------------------------------------*/
/*	Customer
/*-----------------------------------------------------------------------------------*/
var Customer = function() {
	
	return {
		initialize : function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('admin/customer-content-panel', function() {
					$('.sub-menu-customer').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-user-circle');
					$('.pageheader-h2-text').html(' Customer');
					$('.pageheader-module').html('Customer');
					$('#formvalidate').validate({
						submitHandler: function(form) {
							_this.saveOrUpdate(form);
						}
					});
					$('#btn-cancel').on('click', function(evt) {
						evt.preventDefault();
						$('#customerModalForm').modal('hide');
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
					'sAjaxSource' : 'api/customer',
					'sAjaxDataProp' : '_embedded.customer',
					'aoColumns' : [ 
						{ 'mData': null, 'sWidth' : '5%' },
						{ 'mData': 'name' },
						{ 'mData': 'email' },
						{ 'mData': 'phone' },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a onclick="Customer.detail('+ id +')">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {Customer.delete('+ id +');}">Delete</a>';
								return action;
							}, 'bSortable' : false
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
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'id';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = 'api/customer/search/all';
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
					$.map(data._embedded.customer, function(val, i) {
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
						Notification.show('danger', 'Failed to load customer');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			var id = data.id;
			var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
			data = JSON.stringify(data);
			$.ajax({
				'dataType' : 'json',
				'contentType' : 'application/json',
				'type' : 'PUT',
				'url' : 'api/customer/'+ id,
				'data' : data,
				'beforeSend' : function (xhr){ 
					xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
				},
				'success' : function(data) {
					$('#customerModalForm').modal('hide');
					Notification.show('success', 'Customer saved successfully', function(){
						_this.load();
						_this.loadNotification();
					});
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to save customer');
					}
				}
			});
		},
		detail : function(id) {
			var url = 'api/customer/'+ id;
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
					$('#name').val(data.name);
					$('#email').val(data.email);
					$('#phone').val(data.phone);
					$('#approval').attr('checked', data.approval);
					$('#customerModalForm').modal('show');
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load customer');
					}
				}
			});
		},
		delete : function(id) {
			var _this = this;
			var url = 'api/customer/'+ id;
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
					Notification.show('success', 'customer deleted successfully');
					_this.load();
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete customer');
					}
				}
			});
		},
		loadNotification : function() {
			var _this = this;
			var restParams = new Array();
			restParams.push({ 'name' : 'q', 'value' : false});
			var url = 'api/customer/search/approval';
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
					$('.header-notification-title').html('You Have '+ total +' New Customer');
					if(total > 0) {
						$('.header-notification-badge').html(total);
						$.map(data._embedded.customer, function(val, i) {
							contents += '<li class="new"><a onclick="Login.loadModule(\'customer\');"><span class="thumb"><img src="public/images?path='+ val.avatarPath +'" alt="" /></span><span class="desc"><span class="name">'+ val.name +' ('+ val.age +')<span class="badge badge-success">new</span></span><span class="msg">'+ val.occupation +'</span></span></a></li>';
						});
						contents += '<li class="new"><a onclick="Login.loadModule(\'customer\');">See All New Customers</a></li>';
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
