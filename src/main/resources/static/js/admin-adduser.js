
var postForm = $( '#formuser' );
var jsonData = function( form ) {
    var arrData = form.serializeArray(),
        objData = {};
     
    $.each( arrData, function( index, elem ) {
        objData[elem.name] = elem.value;
    });
     
    return JSON.stringify( objData );
};
 
postForm.on( 'submit', function( e ) {
    e.preventDefault();     
    console.log("json postForm",jsonData(postForm));
    $.ajax({
        url: 'http:///google.com',
        method: 'POST',
        data: jsonData(postForm),
        crossDomain: true,
        contentType: 'application/json',
//        beforeSend: function ( xhr ) {
//            xhr.setRequestHeader( 'Authorization', 'Basic username:password' );
//        },
        success: function( data ) {
            console.log( data );
        },
        error: function( error ) {
            console.log( error );
        }
    });
});

$(document).ready(function() {
	alert("hendra");
	$('#usertable').DataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": "../server_side/scripts/server_processing.php"
    } );
});
