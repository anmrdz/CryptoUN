$(document).ready(function() {

	var last_key = "", last_iv = "", last_type = "";

  $("#generate_btn").click(function() {
		var rule = $("#rule_input").val();
		var bits = $("#bits_input").val();
		var iterations = $("#iterations_input").val();

		if(rule == "" || rule == undefined) {
			Materialize.toast("The rule can't be empty", 4000);
			return;
		}
		if(bits == "" || bits == undefined) {
			Materialize.toast("The number of bits can't be empty", 4000);
			return;
		}
		if(iterations == "" || iterations == undefined) {
			Materialize.toast("The number of iterations can't be empty", 4000);
			return;
		}

  	$.ajax({
      type: 'GET',
      url: 'https://cryptoun2016.appspot.com/_ah/api/criptoun/1/evolveUCA',
      data: {rule: parseInt(rule), numBits: parseInt(bits), iterations: parseInt(iterations)},
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
				drawCellularAutomata(data.items);
      },
      error: function (error) {
        alert("Request failed with status " + error.status);
      }
    });

  });

	function drawCellularAutomata(elements) {
		var html = "";
		var idx = 0;
		html += "<table>";
		for(var i = 0; i < elements.length; i++){
			html += "<tr>";
			for(var j = 0; j < elements[i].length; j++){
				if(elements[i][j] == '1'){
					html += '<td class="checked" id="k' + idx + '" />';
				}else{
					html += '<td class="unchecked" id="k' + idx + '" />';
				}
				idx++;
			}
			html += "</tr>";
		}
		html += "</table>";
		$("#output").html(html);
		$("#output").removeClass("hide");
	}

});
