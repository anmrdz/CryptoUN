$(document).ready(function() {
	
  $("#encrypt_btn").click(function() {
	var plaintxt = $("#plaintext_input").val()
    $.ajax({
      type: 'GET',
      url: 'https://crypto-142003.appspot.com/_ah/api/cryptoAPI/v1/getCipherTextWithKey',
      data: {plaintext: plaintxt},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        $("#ciphertext_card").removeClass("hide");
        $("#ciphertext").text(data.cipherText);
		var sq = Math.floor(Math.sqrt(plaintxt.length));
		var lm = sq % 2 == 0? ((sq*sq) < plaintxt.length? sq + 2 : sq): sq + 1;
		for (var mask = 0; mask < 4; mask++) {
			drawBoard(mask, data.keyMap[mask], lm);
		}
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

    function drawBoard(canvas, mask, lm){
		$("#canvas_mask"+canvas).removeClass("hide");
		var context = $("#canvas_mask"+canvas)[0].getContext("2d");
		var board_w = 40 * lm;
		var board_h = board_w;
		var p = 10;
		
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.canvas.height = board_h + 20;
		context.canvas.width = board_w + 20;
		context.beginPath();
		context.font = "35pt Roboto";

		for (var x = 0; x <= board_w; x += 40) {
			context.moveTo(0.5 + x + p, p);
			context.lineTo(0.5 + x + p, board_h + p);
		}
		
		for (var idx = 0; idx < lm; idx++){
			context.fillText("*", (mask[idx]%lm) * 40 + 15, Math.floor(mask[idx]/lm) * 40 + 45);
		}

		for (var x = 0; x <= board_h; x += 40) {
			context.moveTo(p, 0.5 + x + p);
			context.lineTo(board_w + p, 0.5 + x + p);
		}

		context.strokeStyle = "black";
		context.stroke();
		context.closePath();
    } 
  
});
