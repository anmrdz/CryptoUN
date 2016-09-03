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
		for (var mask = 0; mask < 4; mask++) {
			drawBoard(mask, data.keyMap[mask]);
			console.log(data.keyMap[mask]);
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

    function drawBoard(canvas, mask){
		$("#canvas_mask"+canvas).removeClass("hide");
		var context = $("#canvas_mask"+canvas)[0].getContext("2d");
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		var lm = mask.length
		context.font = "35pt Roboto";
		var board_w = 40 * lm;
		var board_h = board_w;
		var p = 10;
		
		context.beginPath();

		for (var x = 0; x <= board_w; x += 40) {
			context.moveTo(0.5 + x + p, p);
			context.lineTo(0.5 + x + p, board_h + p);
		}
		
		for (var idx = 0; idx < lm; idx++){
			context.fillText(""+idx, (mask[idx]%lm) * 40 + 20, Math.floor(mask[idx]/lm) * 40 + 40);
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
