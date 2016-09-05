$(document).ready(function() {
	
	var last_key = "";
	
  $("#encrypt_btn").click(function() {
	var plaintxt = $("#plaintext_input").val()
    $.ajax({
      type: 'GET',
      url: 'https://turning-grille.appspot.com/_ah/api/turning/v1/getCipherTextWithKey',
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
		$("#div_masks").removeClass("hide");
		last_key = data.keyMap[3];
      },
      error: function (error) {
        alert("Request failed with status " + error.status);
      }
    });
  });
  
  $("#decrypt_btn").click(function() {
	
	var key = last_key;
	if (last_key == "custom") {
		key = [];
		$("#custom_key input").each(function(id) {
			if($(this).prop('checked')) {
				key.push(id);
			}
		});
	}	
	
    $.ajax({
      type: 'GET',
      url: 'https://turning-grille.appspot.com/_ah/api/turning/v1/decipher',
      data: {ciphertext: $("#ciphertext_input").val(), grilleKey: key},
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
  
  $("#type_key").change(function() {
	 if ($("#type_key").val() == "lk") {
		 if(last_key == "") {
			Materialize.toast("There isn't a last key", 4000);
		 }
		 $("#custom_key").addClass("hide");
		 $("#size_key_div").addClass("hide");
	 } else if ($("#type_key").val() == "ck") {
		 $("#size_key_div").removeClass("hide");
	 }
  });
  
  $("#size_key_input").change(function() {
	 var size_key = $(this).val();
	 if(size_key % 2 != 0) {
		 Materialize.toast("The size of the matrix must be an even number", 4000);
	 } else {
		$("#custom_key").removeClass("hide");
		drawCustomKey(size_key);
		last_key = "custom";
	 }
  });
  
  
	function drawCustomKey(size) {
		var html = "<h4> Custom key </h4>";
		var idx = 0;
		for (var i = 0; i < size; i++) {
			html += "<p>";
			for (var j = 0; j < size; j++) {
				html += '<input type="checkbox" class="filled-in" id="k' + idx + '" /> \
			  <label for="k'+ idx + '"></label>';
			  idx++;
			}
			html += "</p>";
		}
		$("#custom_key").html(html);
	}

    function drawBoard(canvas, mask, lm){
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
