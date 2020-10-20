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
    console.log(res)
}

cashSummaryRequest = "  query MyQuery {
                        orders {
                            nodes {
                            subtotal
                            id
                            customer {
                                displayName
                            }
                            }
                        }
                    }";

function callDB(){
    
    //test_query = "{ orders { edges { node { id } } } }"
    dbQuery(cashSummaryRequest,cashSummaryGenerator)
}

jQuery(document).ready(function($) {
    document.getElementById('mainP').innerHTML = window.location.hostname
    callDB()
});