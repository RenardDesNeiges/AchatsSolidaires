function jquery_tabify() {
    wp_enqueue_script(
        'jquery-tabify',
        get_template_directory_uri() . '/js/jquery.tabify.js',
        array( 'jquery' )
    );
}
add_action( 'wp_enqueue_scripts', 'jquery_tabify' );