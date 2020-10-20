<?php
/*
 * Template Name: Good to Be Bad
 * Description: A Page Template with a darker design.
 */



wp_enqueue_script('generate_order');

get_header() 
?>

<h3>Compatbilité : </h3>
<button type="button"  id="generatePeriodAccounting">Générer la comptabilité pour les commandes en cours</button>
</br>
<button type="button"  id="generateAccounting">Générer la comptabilité à partir du : </button>
<input type="date" id="start-date" name="account-start"
       value="2019-01-01"
       min="2018-01-01">
</br>


<div id="mainP"></div>