function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

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


cashSummaryGenerator = function(res){
    console.log("Log")
    orders_array = res.orders.nodes
    //document.getElementById('mainP').innerHTML = cashSummaryToCSV(orders_array)
    download("accounting.csv",cashSummaryToCSV(orders_array))
    console.log(orders_array)

}

function cashSummaryToCSV(inputArray){
    //Name line
    buffer =  "Prénom/Nom,Total Commande,\n"
    //Content
    for(element in inputArray){
        buffer += inputArray[element].customer.firstName + " " + inputArray[element].customer.lastName + ","
        buffer += inputArray[element].subtotal + ","
        buffer += "\n"
    }


    return buffer
}

cashSummaryRequest = " query MyQuery { orders { nodes {  subtotal customer { firstName lastName } } } }";

function callDB(){
    
    //test_query = "{ orders { edges { node { id } } } }"
    dbQuery(cashSummaryRequest,cashSummaryGenerator)
}

jQuery(document).ready(function($) {
    callDB()
});