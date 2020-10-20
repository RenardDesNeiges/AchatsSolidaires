<?php
/*
 * Template Name: Good to Be Bad
 * Description: A Page Template with a darker design.
 */



wp_enqueue_script('generate_order');

get_header() 
?>

<button type="button"  onclick="generateCashCSV()">Generate Accounting Summary</button>

<div id="mainP"></div>