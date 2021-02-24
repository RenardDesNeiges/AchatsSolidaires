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
    buffer =  "Prenom/Nom,Total Commande,date\n"
    //Content
    for(element in inputArray){
        if(inputArray[element].status == "PROCESSING"){
            buffer += inputArray[element].customer.firstName + " " + inputArray[element].customer.lastName + ","
            buffer += inputArray[element].total + ","
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
            buffer += inputArray[element].total + ","
            buffer += inputArray[element].date.substring(0, 10) + ","
            buffer += inputArray[element].status
            buffer += "\n"
        }
    }

    return buffer
}

//Generates the dashboard's HTML
function dashboardHTML(inputArray){

    //Names of the collumns
    buffer =  "<table>"
    //Content
    buffer += "<tr><td><b>Nom</b></td><td><b>Mail</b></td><td><b>Commande</b></td></tr>"
    for(element in inputArray){
        buffer += "<tr>"
        if(inputArray[element].status == "PROCESSING"){
            buffer += "<td>" + inputArray[element].customer.firstName + " " + inputArray[element].customer.lastName + "</td>"
            buffer += "<td>" + inputArray[element].customer.email + "</td>"
            buffer += "<td><u>Produit</u></td><td><u>Quantité</u></td><td><u>Prix</u></td>"
            for(pID in inputArray[element].lineItems.nodes){
                buffer += "<tr>"
                buffer += "<td></td><td></td>"
                buffer += "<td>" + inputArray[element].lineItems.nodes[pID].product.name + "</td>"
                buffer += "<td>" + inputArray[element].lineItems.nodes[pID].quantity + "</td>"
                buffer += "<td>" + inputArray[element].lineItems.nodes[pID].subtotal + "CHF </td>"
                buffer += "</tr>"
            }
            buffer += "<tr><td></td><td></td><td></td>"
            buffer += "<td><i>Total:</i></td><td>"+inputArray[element].total+"</td></tr>"
        }
    }


    buffer +=  "</table>"

    return buffer
}

//Generates the supplier dashboard's HTML
function supplyDashboardHTML(inputArray){
    alert("TEST")
    //Names of the collumns
    buffer =  "this is the dashboard"

    return buffer
}

function parseSupply(inputArray){
    itemList = []
    ids = []
    supplyList = {}
    for(id in inputArray){
        if(inputArray[id].status == "PROCESSING"){
            for(subID in inputArray[id].lineItems.nodes){
                element = inputArray[id].lineItems.nodes[subID]
                itemList.push(element)
                if(ids.includes(element.product.id)){
                    supplyList[element.product.id].subtotal = String(parseFloat(supplyList[element.product.id].subtotal) + parseFloat(element.subtotal))
                    supplyList[element.product.id].quantity = parseInt(supplyList[element.product.id].quantity) + parseInt(element.quantity)
                }
                else{
                    ids.push(element.product.id)
                    supplyList[element.product.id] = element
                }
            }
        }
    }
    return supplyList
}

//Converts the json from the DB to an accounting-ready csv (pending orders)
function supplyCSV(inputArray){
    
    supplyList = parseSupply(inputArray)
    
    //Names of the collumns
    buffer = "Fournisseur,Produit,Total, Quantite, Prix(par unité)\n"
    //Content
    for(id in supplyList){
        element = supplyList[id]
        try{
            buffer += String( supplyList[id].product.attributes.nodes[0].options[0] ) + ","
        }
        catch(error){
            buffer += "NO SUPPLIER , "
        }
        buffer += String( supplyList[id].product.name ) + ","
        buffer += String( supplyList[id].subtotal ) + ","
        buffer += String( supplyList[id].quantity ) + ","
        buffer += String( parseFloat(supplyList[id].subtotal)/parseInt(supplyList[id].quantity) ) + "\n"
    }
    return buffer
}

//Gets the price per-person for accounting purposes (pending orders)
pendingAccounting = function(res){
    orders_array = res.orders.nodes

    var today = new Date();
    var filename = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"_pending_accounting.csv";

    download(filename,pendingAccountingCSV(orders_array))
    console.log(orders_array)

}

accounting = function(res){
    orders_array = res.orders.nodes

    var today = new Date();
    var filename = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"_accounting.csv";

    download(filename,accountingCSV(orders_array))
    console.log(orders_array)

}

dashboard = function(res){
    orders_array = res.orders.nodes

    document.getElementById("dashboard").innerHTML = dashboardHTML(orders_array)
    console.log(orders_array)
}

supplyDashboard = function(res){
    orders_array = res.orders.nodes

    document.getElementById("supplyDashboard").innerHTML = supplyDashboardHTML(orders_array)
    console.log(orders_array)
}

supply = function(res){
    orders_array = res.orders.nodes

    var today = new Date();
    var filename = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+"_supply.csv";

    download(filename,supplyCSV(orders_array))
    console.log(orders_array)
}



/* 
 *  GraphQL requests
*/

//Request for the accounting csv
cashSummaryRequest = " query MyQuery { orders { nodes { total customer { firstName lastName } date status } } }";
dashboardRequest = "query MyQuery { orders { nodes { customer { firstName lastName email } date status total lineItems { nodes { product { name } quantity subtotal } } } }}";
supplyRequest = "query MyQuery { orders { nodes { status lineItems { nodes { subtotal quantity product { attributes { nodes { name options } } name id } } } } }}"

/* 
 * Hook functions
*/

//Generating the pending accounting CSV file
function generatePendingAccountingCSV(){
    dbQuery(cashSummaryRequest,pendingAccounting)
}

//Generating the accounting CSV file
function generateAccountingCSV(){
    dbQuery(dashboardRequest,accounting)
}

//Generating the dashboard
function generateDashboard(){
    dbQuery(dashboardRequest,dashboard)
}

//Generating the dashboard
function generateSupplyDashboard(){
    dbQuery(dashboardRequest,dashboard)
}

//Generating the supply CSV file
function generateSupplyCSV(){
    dbQuery(supplyRequest,supply)
}

// Runs when the page is loaded
jQuery(document).ready(function($) {
    //binding buttons to functions
    document.getElementById("generatePeriodAccounting").onclick = generatePendingAccountingCSV;
    document.getElementById("generateAccounting").onclick = generateAccountingCSV;
    document.getElementById("generateBulkList").onclick = generateSupplyCSV
    generateDashboard();
    generateSupplyDashboard();
});

