/*-----------------------------------------------------------------------------------*/
/*	Profile
/*-----------------------------------------------------------------------------------*/
var Profile = function() {
	
	return {
		initialize : function() {
			var _this = this;
			Login.auth(function() {
				$('.contentpanel').load('/admin/profile-content-panel', function() {
					$('.sub-menu-profile').addClass('active');
					$('.pageheader-h2-icon').attr('class', 'pageheader-h2-icon');
					$('.pageheader-h2-icon').addClass('fa fa-wrench');
					$('.pageheader-h2-text').html(' Profile');
					$('.pageheader-module').html('Profile');
					$('#footerDescription').wysihtml5({
						'stylesheets': []
					});
					$('#formvalidate').validate({
						submitHandler: function(form) {
							_this.saveOrUpdate(form);
						}
					});
					$('#btn-cancel').on('click', function(evt) {
						evt.preventDefault();
						$('#profileModalForm').modal('hide');
					});
					_this.loadProfile();
				});
			});
		},
		loadProfile : function() {
			if($('#datatable1').length) {
				var _this = this;
				$('#datatable1').dataTable().fnDestroy();
				$('#datatable1').show();
				$('#datatable1').dataTable({
					'sAjaxSource' : '/api/profiles',
					'sAjaxDataProp' : '_embedded.profiles',
					'aoColumns' : [ 
						{ 'mData': null },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var img = '<div align="center"><img src="/public/images?path='+ row.logo +'" style="padding:3px;border:thin solid #dddddd;border-radius:5px;" /><br>'+ row.companyName +'</div>';
								return img;
							}, "bSortable" : false
						},
						{ 'mData': null, 'mRender': function (data, type, row) {
								var address = row.address1 +' <br> '+ row.address2;
								return address;
							}, "bSortable" : false
						},
						{ 'mData': 'hotline', "bSortable" : false },
						{ 'mData': 'email', "bSortable" : false },
						{ 'mData': null, 'mRender': function (data, type, row) {
								var youtubeLink = row.youtubeLink;
								var instagramLink = row.instagramLink;
								var facebookLink = row.facebookLink;
								var twitterLink = row.twitterLink;
								var links = '<i class="fa fa-youtube"></i>'+ youtubeLink +'<br>';
								links += '<i class="fa fa-instagram"></i>'+ instagramLink +'<br>';
								links += '<i class="fa fa-facebook-f"></i>'+ facebookLink +'<br>';
								links += '<i class="fa fa-twitter"></i>'+ twitterLink +'';
								return links;
							}, "bSortable" : false
						},
						{ 'mData': null, 'mRender': function (data, type, row) {
								var hrefs = row._links.self.href.split('/');
								var id = hrefs[hrefs.length - 1];
								var action = '<a onclick="Profile.detailProfile('+ id +')">Edit</a>';
								action += '&nbsp;|&nbsp;<a href="#" onclick="if(confirm(\'Are you sure?\')) {Profile.deleteProfile('+ id +');}">Delete</a>';
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
							$(nRow).css({'background-color':'#ffaabb'});
						}
						
						return nRow;
					}
				});
				// Add Profile Button
				var datatableWrapper = $('#datatable1_wrapper');
				var filter = datatableWrapper.find('div[id$=_filter]');
				var newDiv = ' <label><button class="btn btn-sm btn-primary" onclick="Profile.createNewProfile();">Add Profile</button>';
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
			var sortName = paramMap['mDataProp_' + sortCol] != null ? paramMap['mDataProp_' + sortCol] : 'idProfile';

			//create new json structure for parameters for REST request
			var restParams = new Array();
			restParams.push({"name" : "size", "value" : pageSize});
			restParams.push({"name" : "page", "value" : pageNum });
			restParams.push({"name" : "sort", "value" : sortName +','+ sortDir });

			//if we are searching by name, override the url and add the name parameter
			var url = sSource;
			if (paramMap.sSearch != '') {
				url = '/api/profiles/search/all';
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
					$.map(data._embedded.profiles, function(val, i) {
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
						Notification.show('danger', 'Failed to load profile');
					}
				}
			});
		},
		saveOrUpdate : function(form) {
			var _this = this;
			var data = {};
			$(form).serializeArray().map(function(x){data[x.name] = x.value;});
			
			var id = data.idProfile;
			var type = id === '' ? 'POST' : 'PUT';
			var url = id === '' ? '/api/profilescustom' : '/api/profilescustom/'+ id;
			var imagePath = $('#logoPath')[0];
			var types = new Array('image/jpg', 'image/jpeg', 'image/png');
			if(imagePath.files.length && $.inArray(imagePath.files[0].type, types) === -1) {
				$('label[for="image"]').html('Accepted formats are only jpg, jpeg and png');
				$('label[for="image"]').css('display', 'block');
			} else {
				var token = Login.checkLS() ? localStorage.getItem('t') : $.cookie('t');
				this.readImage(imagePath.files, function(result) {
					if(typeof result !== 'undefined') {
						data.logo = result.replace(/^data:image\/[a-z]+;base64,/, "");
						data.logoChanged = true;
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
							$('#profileModalForm').modal('hide');
							Notification.show('success', 'Profile saved successfully', function(){
								_this.loadProfile();
							});
						},
						'error' : function(data) {				
							if(data.status == 401) {
								Notification.show('danger', 'Session timed out, please re-login...', function(){
									Login.logout();
								});
							} else {
								Notification.show('danger', 'Failed to save profile');
							}
						}
					});
				});
			}
		},
		createNewProfile : function() {
			$('#header-title-mode').html('Create New');
			$('#header-title').html('');
			$('#idProfile').val('');
			$('#companyName').val('');
			$('#address1').val('');
			$('#address2').val('');
			$('#hotline').val('');
			$('#email').val('');
			$('.logo-preview').css('display', 'none');
			$('#logo-image').css('display', 'none');
			$('#logo-image').attr('src', '');
			$('#footerDescription').data('wysihtml5').editor.setValue('');
			$('#footerDescription').autogrow();
			$('#instagramLink').val('');
			$('#facebookLink').val('');
			$('#youtubeLink').val('');
			$('#twitterLink').val('');
			$('#prime').attr('checked', false);
			$('#profileModalForm').modal('show');
		},
		detailProfile : function(id) {
			var url = '/api/profiles/'+ id;
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
						$('#idProfile').val(id);
					}
					$('#header-title-mode').html('Edit');
					$('#header-title').html('"'+ data.companyName +'"');
					$('#companyName').val(data.companyName);
					$('#address1').val(data.address1);
					$('#address2').val(data.address2);
					$('#hotline').val(data.hotline);
					$('#email').val(data.email);
					if(data.logo != null && data.logo !== '') {
						$('.logo-preview').css('display', 'block');
						$('#logo-image').attr('src', '/public/images?path='+ data.logo);
						$('#logo-image').css('display', 'block');
						$('#logo-image-fileupload').attr('class', 'fileupload fileupload-new');
						$('.fileupload-preview logo-image-preview').html('');
					} else {
						$('.logo-preview').css('display', 'none');
						$('#logo-image').css('display', 'none');
						$('#logo-image').attr('src', '');
					}
					$('#footerDescription').data('wysihtml5').editor.setValue(data.footerDescription);
					$('#footerDescription').autogrow();
					$('#instagramLink').val(data.instagramLink);
					$('#facebookLink').val(data.facebookLink);
					$('#youtubeLink').val(data.youtubeLink);
					$('#twitterLink').val(data.twitterLink);
					$('#prime').attr('checked', data.prime);
					$('#profileModalForm').modal('show');
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to load profile');
					}
				}
			});
		},
		deleteProfile : function(id) {
			var _this = this;
			var url = '/api/profilescustom/'+ id;
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
					Notification.show('success', 'Profile deleted successfully');
					_this.loadProfile();
				},
				'error' : function(data) {				
					if(data.status == 401) {
						Notification.show('danger', 'Session timed out, please re-login...', function(){
							Login.logout();
						});
					} else {
						Notification.show('danger', 'Failed to delete profile');
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
