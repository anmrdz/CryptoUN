$(document).ready(function() {

	var cipherTable = $('#ciphertable').DataTable( {
  	columnDefs: [
    	{
      	targets: [ 0, 1, 2, 3, 4, 5 ],
        className: 'mdl-data-table__cell--non-numeric'
      }
    ],
		columns: [
    	{ "width": "5%" },
			{ "width": "22%" },
			{ "width": "22%" },
			{ "width": "17%" },
			{ "width": "17%" },
			{ "width": "17%" }
  	]
	} );

	var plainTable = $('#plaintable').DataTable( {
  	columnDefs: [
    	{
      	targets: [ 0, 1, 2, 3, 4, 5 ],
        className: 'mdl-data-table__cell--non-numeric'
      }
    ],
		columns: [
    	{ "width": "5%" },
			{ "width": "22%" },
			{ "width": "22%" },
			{ "width": "17%" },
			{ "width": "17%" },
			{ "width": "17%" }
  	]
	} );

	var last_key = "";
	var last_size = 0;
	var message = "";

  $("#encrypt_btn").click(function() {
	var plaintxt = $("#plaintext_input").val()
    $.ajax({
      type: 'GET',
      url: 'https://opmodes.appspot.com/_ah/api/opmodes/v1/getCFBCipherTextComplete',
      data: {text: plaintxt},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        $("#ciphertext_card").removeClass("hide");
				$("#ciphertable_card").removeClass("hide");
        $("#ciphertext").text(data.cipherComplete[0]);
				$("#cipheriv").text("IV: " + data.iv[0]);
				$("#ciphersize").text("Size: " + data.mSize[0]);
				cipherTable.clear().draw();
				var messageBits = "";
				for(var i = 0; i < data.mArray.length; i++){
					cipherTable.rows.add([[ i+1, data.IArray[i], data.OArray[i], data.tArray[i], data.mArray[data.mArray.length -1 - i], data.cArray[data.mArray.length -1 - i] ]]).draw();
					messageBits = messageBits.concat( data.mArray[data.mArray.length -1 - i] );
				}
				$("#messagebits").text(messageBits);
	      message = plaintxt;
				last_key = data.iv[0];
				last_size = data.mSize[0];
	    },
      error: function (error) {
				Materialize.toast("Request failed with status " + error.status, 4000);
      }
    });
  });

  $("#decrypt_btn").click(function() {
		if($("#ciphertext_input").val() == "") {
			Materialize.toast("The ciphertext can't be empty", 4000);
			return;
		}
		if($("#type_iv_input").val() == "") {
			Materialize.toast("The ciphertext can't be empty", 4000);
			return;
		}
		if($("#size_m_input").val() == "") {
			Materialize.toast("The ciphertext can't be empty", 4000);
			return;
		}

    $.ajax({
      type: 'GET',
      url: ' https://opmodes.appspot.com/_ah/api/opmodes/v1/getCFBPlainTextComplete',
      data: {bits: $("#ciphertext_input").val(), iv: $("#type_iv_input").val(), size: parseInt( $("#size_m_input").val() )},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
				$("#plaintable_card").removeClass("hide");
        $("#plaintext_card").removeClass("hide");
        $("#plaintext").text(data.pText[0]);
				$("#plainbits").text("bits: " + data.plainComplete[0]);
				plainTable.clear().draw();
				for(var i = 0; i < data.mArray.length; i++){
					plainTable.rows.add([[ i+1, data.IArray[i], data.OArray[i], data.tArray[i], data.cArray[data.mArray.length - 1 - i], data.mArray[data.mArray.length - 1 - i] ]]).draw();
				}
      },
      error: function (error) {
        Materialize.toast("Sorry your ciphertext couldn't be decrypted, check your key", 4000);
      }
    });
  });

});
