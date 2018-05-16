
$(document).ready(function() {
	
		/*$('#usertable').dataTable({
			"bProcessing": true,
			"bServerSide": true,
			"bPaginate": true,
			"bSort":false,
           // "sAjaxSource": "https://www.phpflow.com/demo/datatable/response.php",
			"sAjaxSource": "https://datatables.net/examples/server_side/scripts/server_processing.php",
			"aoColumns": [
				   { mData: '0' } ,
                   { mData: '1' },
                   { mData: '2' }
           ]
		});  */
	 $('#usertable').DataTable( {
	        "bProcessing": true,
	        "bServerSide": true,
	        "sAjaxSource": "http://localhost:8080/api/users",
	        
	        "sAjaxDataProp": "_embedded.users",
	        "aoColumns": [
	   				   { mData: 'fullname' } ,
	                   { mData: 'username' },
	                   { mData: 'password' }
	         ]
	    } );
});
