<!DOCTYPE html>
<html>
	<head>
		<title>Page Title</title>
	</head>
	<body>
		<div id="tables_div">
			<table id="number_canvas"></table>
			<table id="answers"></table>
		</div>

		<div class="button_holder">
			<button onclick="GetNewNumber()">Get New Number</button>
		</div>
	</body>
</html>

<script>
const canvas_size = 28;
const answers_rows = 10;
const answers_cols = 3;

GenerateCanvas(canvas_size);
GenerateAnswers(answers_rows);

// TODO: Refactor
function GenerateCanvas (size) {
	let table = document.getElementById('number_canvas');

	let table_body = document.createElement('tbody');
	table.appendChild(table_body);

	let num_rows = size;
	let num_cols = size;

	for (let y = 0; y < num_rows; y++)
	{
		let tr =document.createElement('tr')

		for (let x = 0; x < num_cols; x++)
		{
			let td = document.createElement('td');

			td.setAttribute("id", "c-cell-" + x + ":" + y);
			td.setAttribute("width", "19px");
			td.setAttribute("height", "19px");
			tr.appendChild(td);
		}

		table_body.appendChild(tr);
	}
}

function GenerateAnswers (size) {
	let table = document.getElementById('answers');

	let table_body = document.createElement('tbody');
	table.appendChild(table_body);

	let num_rows = size;
	let num_cols = answers_cols;

	for (let y = 0; y < num_rows; y++)
	{
		let tr =document.createElement('tr')

		for (let x = 0; x < num_cols; x++)
		{
			let td = document.createElement('td');

            let p = document.createElement('p');

            if (x === 0) {
                p.innerHTML = DigitToString(y) + ': ';
            } else if (x === 1) {
                 td.style.width = "0.4em";
            } else if (x === 2) {
                 p.innerHTML = ' 0.00%';
            }

            td.appendChild(p);

			td.setAttribute("id", "a-cell-" + x + ":" + y);
			tr.appendChild(td);
		}

		table_body.appendChild(tr);
	}
}

async function GetNewNumber() {
    const response = await fetch("/get_number", {
		method: 'POST',
		headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		}
	});

	response.json().then(data => {
        DrawDigit(data["digit_data"]);
        DrawAnswers(data["answers"]);
	});
}

function DigitToString(digit) {
    let str;
    if (digit === 0) {
        str = "ZERO";
    } else if (digit === 1) {
        str = "ONE";
    } else if (digit === 2) {
        str = "TWO";
    } else if (digit === 3) {
        str = "THREE";
    } else if (digit === 4) {
        str = "FOUR";
    } else if (digit === 5) {
        str = "FIVE";
    } else if (digit === 6) {
        str = "SIX";
    } else if (digit === 7) {
        str = "SEVEN";
    } else if (digit === 8) {
        str = "EIGHT";
    } else if (digit === 9) {
        str = "NINE";
    } else {
        str = "UNKNOWN DIGIT";
    }

    return str;
}

function DrawDigit(digit_data) {
    for (let i = 0; i < canvas_size * canvas_size; i++) {
        let x = i % canvas_size;
        let y = Math.floor(i / canvas_size);
        let cell = document.getElementById("c-cell-" + x + ":" + y);

        let cell_color = digit_data.input_values[i];
        let rgb = [ cell_color, cell_color, cell_color ]
        cell.style["background-color"] = "rgba(" + rgb.join(",") + ",1)";
    }
}

function DrawAnswers (answers) {
	for (let y = 0; y < answers_rows; y++)
	{
		for (let x = 0; x < answers_cols; x++)
		{
            let cell = document.getElementById("a-cell-" + x + ":" + y);
            let p = cell.firstChild;

            if (x === 0) {
                p.innerHTML = DigitToString(answers[y]["real_value"]) + ': ';
            } else if (x === 2) {
                p.innerHTML = ' ' + answers[y]["percentage"] + '%';
            }
        }
    }
}

</script>

<style>
body {
  background-color: #181822;
}
#number_canvas table, #number_canvas th, #number_canvas td {
}
table {
  border-collapse: collapse;
  margin: auto;
}
#number_canvas td {
  background-color: black;
}
#answers {
  margin-left: 2.5em;
  color: white;
  font-size: 1.25em;
  font-weight: bold;
}
#tables_div {
  width: 50%;
  margin: auto;
  margin-top: 5em;
  padding: 2em;
  background-color: #585882;
  display: flex;
}
.button_holder {
  width: 70%;
  margin: auto;
  margin-top: 2em;
  text-align: center;
}
button {
  width: 10em;
  height: 3em;
  margin-left: 1em;
  margin-right: 1em;
}
</style>
