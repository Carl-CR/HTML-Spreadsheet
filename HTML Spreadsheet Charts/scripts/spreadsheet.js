// YOUR CODE GOES HERE
$(document).ready(function(){
	fetch('grades.csv')
	  .then(response => response.text())
	  .then(data => {
		const tableData = parseData(data);
		const table = createTable(tableData);
		$('#Spreadsheet').append(table);

		//When a column header is pressed 
		$('th.column-header').click(function(){ 
			var colIndex = $(this).closest('th').index() + 1;
			selectColumn(colIndex);
		});

		//When a row header is pressed
		$('td.row-header').click(function(){ 
			var rowIndex = $(this).closest('tr').index() + 1;
			selectRow(rowIndex);
		});

		//Will create a textbox that will enter a new number when the enter key is hit
		$('td:not(:first-child)').on('click',function(){ 
			var prevVal = $(this).text(); 
			var textField = $('<input type="text" value="' + prevVal + '">'); 
			$(this).html(textField); 
			textField.focus(); 

			textField.on('keypress', function(e){ 
				if(e.key == 'Enter'){ 
					var newVal = textField.val(); 
					$(this).parent().text(newVal);
				}
			});
		}); 
	  });
});

//Parsing the data
function parseData(data){ 
	const rows = data.split('\n'); 
	return rows.map(row => row.split(',')); 
}

//Creating the table
function createTable(tableData){ 
	const table = $('<table></table>'); 
	table.append(createHeaderRow(tableData[0])); 
	table.append(createBodyRows(tableData.slice(1)));
	return table;
}

//Creating the Row headers
function createHeaderRow (headerData){ 
	const headerRow = $('<tr></tr>');  
	headerData.forEach((cellData, index) => { 
		const cell = $('<th></th>'); 
		if (index > 0){ 
			cell.addClass('column-header'); 
		}
		cell.text(cellData);
		headerRow.append(cell);
	}); 
	return headerRow;
}
//Creating the column headers
function createBodyRows(bodyData){ 
	return bodyData.map(rowData => { 
		const row = $('<tr></tr>'); 
		rowData.forEach((cellData, columnIndex) => { 
			const cell = $('<td></td>'); 
			if (columnIndex == 0){ 
				cell.addClass('row-header');
			}
			cell.text(cellData); 
			row.append(cell);
		});
		return row;
	});
}

//Deselect function so that it is no longer highlighted
function deselectAll(){ 
    $('td').removeClass('selected');
	$('tr').removeClass('selected');
}

//Getting a list a values
function extractData(rowOrColumn) {
	const data = [];
	if (rowOrColumn.is("tr")) { // extract row data
	  rowOrColumn.find('td:not(:first-child)').each(function() {
		const value = parseFloat($(this).text());
		if (!isNaN(value)) {
		  data.push(value);
		}
	  }); 
	} else if (rowOrColumn.is("td")) { // extract column data
	  const colIndex = rowOrColumn.index() + 1;
	  $('tr').each(function() {
		const value = parseFloat($(this).find('td:nth-child(' + colIndex + ')').text());
		if (!isNaN(value)) {
		  data.push(value);
		}
	  });
	}
	return data;
}

//When selecting a column
function selectColumn(colIndex){ 
    deselectAll();
    $('td:nth-child(' + colIndex + ') ').addClass('selected');

	const selectedCol = $('td:nth-child(' + colIndex + ') '); 
	const selectedData = extractData(selectedCol); 
	
	//To print the data from the column that was selected
	//printHeader(selectedData);

	const freqData = getFrequencies(selectedData); 
	
	createChart(freqData);
	
}

//When selecting a row
function selectRow(rowIndex){ 
    deselectAll();
    $('tr:nth-child(' + rowIndex + ') ').addClass('selected');
  	
	const selectedRow = $('tr:nth-child(' + rowIndex + ') ');
	const selectedData = extractData(selectedRow);

	//To print the data from the row that was selected
	//printHeader(selectedData);

	const freqData = getFrequencies(selectedData); 
	createChart(freqData);

}

/*
//To print out the list of valuesfor checking
function printHeader(data) {
	const outputDiv = document.querySelector("#output");
  	const header = document.createElement("h3");
  	header.innerText = "Selected Data: " + data.join(", ");
  	outputDiv.appendChild(header);
}
*/