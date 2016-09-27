$(document).ready(function() {
	
	var last_key = "", last_iv = "";
	
  $("#encrypt_btn").click(function() {
	var plaintxt = $("#plaintext_input").val()
	
	if(plaintxt == "") {
		Materialize.toast("The plaintext can't be empty", 4000);
		return;
	}
	
    $.ajax({
      type: 'GET',
      url: 'https://cryptoun2016.appspot.com/_ah/api/criptoun/1/encryptCFBDES',
      data: {plaintext: plaintxt},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        $("#ciphertext_card").removeClass("hide");
        $("#ciphertext").text(data.cipherText);
		
		$("#iv_card").removeClass("hide");
        $("#iv").text(data.iv);
		
		$("#key_card").removeClass("hide");
        $("#key").text(data.desKeyText);
		
		last_key = data.desKeyText;
		last_iv = data.iv;
      },
      error: function (error) {
        alert("Request failed with status " + error.status);
      }
    });
  });
  
  $("#decrypt_btn").click(function() {
	
	var key = last_key;
	var liv = last_iv;
	if ($("#type_key").val() == "ck") {
		key = $("#customkey_input").val();
		liv = $("#customiv_input").val();
	}
	
	if($("#ciphertext_input").val() == "") {
		Materialize.toast("The ciphertext can't be empty", 4000);
		return;
	}
	
	if($("#type_key").val() == "" || $("#type_key").val() == null || liv == "" || key == "") {
		Materialize.toast("Choose a key and IV", 4000);
		return;
	}
	
    $.ajax({
      type: 'GET',
      url: 'https://cryptoun2016.appspot.com/_ah/api/criptoun/1/decryptCFBDES',
      data: {ciphertext: $("#ciphertext_input").val(), desKeyText: key, iv: liv},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        $("#plaintext_card").removeClass("hide");
        $("#plaintext").text(data.plainText);
      },
      error: function (error) {
        Materialize.toast("Sorry your ciphertext couldn't be decrypted, check your key and iv", 4000);
      }
    });
  });
  
  $("#type_key").change(function() {
	 if ($("#type_key").val() == "lk") {
		 if(last_key == "") {
			Materialize.toast("There isn't a last key", 4000);
		 }
		 $("#custom").addClass("hide");
	 } else if ($("#type_key").val() == "ck") {
		 $("#custom").removeClass("hide");
	 }
  });
   
});
