$(document).ready(function() {

  $("#encrypt_btn").click(function() {
    $.ajax({
      type: 'GET',
      url: 'https://crypto-142003.appspot.com/_ah/api/cryptoAPI/v1/getCipherTextWithKey',
      data: {plaintext: $("#plaintext_input").val()},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        $("#ciphertext_card").removeClass("hide");
        $("#ciphertext").text(data.cipherText);
        console.log(data.key.length);
      },
      error: function (error) {
        alert("Request failed with status " + error.status);
      }
    });
  });
  
  $("#decrypt_btn").click(function() {
    $.ajax({
      type: 'POST',
      url: 'https://crypto-142003.appspot.com/_ah/api/cryptoAPI/v1/decipher',
      data: {ciphertext: $("#ciphertext_input").val(), grilleKey: $("#key_input").val()},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        $("#plaintext_card").removeClass("hide");
        $("#plaintext").text(data.data);
      },
      error: function (error) {
        alert("Request failed with status " + error.status);
      }
    });
  });
});
