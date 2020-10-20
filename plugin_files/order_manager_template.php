<?php
/*
 * Template Name: Good to Be Bad
 * Description: A Page Template with a darker design.
 */



wp_enqueue_script('generate_order');

get_header() 
?>

<h3>Compatbilité : </h3>
<button type="button"  id="generatePeriodAccounting">Générer la comptabilité pour la commandes en cours</button>
</br>
<button type="button"  id="generateAccounting">Générer la comptabilité à partir du : </button>
<input type="date" id="start-date" name="account-start"
       value="2019-01-01"
       min="2018-01-01">
</br>

<h3>Fournisseurs : </h3>
<button type="button"  id="generateBulkList">Générer la liste des achats par fournisseur</button>
</br>

<h3>Permanence : </h3>
<div id="dashboard"></div>

<div id="mainP"></div>