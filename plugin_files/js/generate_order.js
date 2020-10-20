/* 
 *  Utility functions
*/

// Downloads a string as a text file
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
// Queries GraphDB
function dbQuery(inputQuery,promiseFunction){
    //Computes the url of the graphql server
    local_url = "https://" + window.location.hostname + "/graphql"
    
    //fetches the query
    const resp_db = fetch(local_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: inputQuery }),
    })
    .then(res => res.json())
    .then(res => promiseFunction(res.data));
}

/* 
 *  DB query formatting functions
*/

//Converts the json from the DB to an accounting-ready csv (pending orders)
function pendingAccountingCSV(inputArray){

    //Names of the collumns
    buffer =  "Prénom/Nom,Total Commande,date\n"
    //Content
    for(element in inputArray){
        if(inputArray[element].status == "PROCESSING"){
            buffer += inputArray[element].customer.firstName + " " + inputArray[element].customer.lastName + ","
            buffer += inputArray[element].subtotal + ","
            buffer += inputArray[element].date.substring(0, 10)
            buffer += "\n"
        }
    }

    return buffer
}

//Converts the json from the DB to an accounting-ready csv (pending orders)
function accountingCSV(inputArray){

    
    
    inputval = document.getElementById("start-date").value;
    zero_date = new Date(inputval);

    //Names of the collumns
    buffer =  "Prénom/Nom,Total Commande,date\n"
    //Content
    for(element in inputArray){
        cdate = new Date(inputArray[element].date.substring(0, 10))
        if(cdate >= zero_date){
            buffer += inputArray[element].customer.firstName + " " + inputArray[element].customer.lastName + ","
            buffer += inputArray[element].subtotal + ","
            buffer += inputArray[element].date.substring(0, 10) + ","
            buffer += inputArray[element].status
            buffer += "\n"
        }
    }

    return buffer
}

//Gets the price per-person for accounting purposes (pending orders)
pendingAccounting = function(res){
    console.log("Log")
    orders_array = res.orders.nodes

    var today = new Date();
    var filename = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"_pending_accounting.csv";

    download(filename,pendingAccountingCSV(orders_array))
    console.log(orders_array)

}

accounting = function(res){
    console.log("Log")
    orders_array = res.orders.nodes

    var today = new Date();
    var filename = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"_accounting.csv";

    download(filename,accountingCSV(orders_array))
    console.log(orders_array)

}

/* 
 *  GraphQL requests
*/

//Request for the accounting csv
cashSummaryRequest = " query MyQuery { orders { nodes { subtotal customer { firstName lastName } date status } } }";

/* 
 *  "Main" functions
*/

function generatePendingAccountingCSV(){
    dbQuery(cashSummaryRequest,pendingAccounting)
}

function generateAccountingCSV(){
    dbQuery(cashSummaryRequest,accounting)
}

// Runs when the page is loaded
jQuery(document).ready(function($) {
    //binding buttons to functions
    document.getElementById("generatePeriodAccounting").onclick = generatePendingAccountingCSV;
    document.getElementById("generateAccounting").onclick = generateAccountingCSV;
});

