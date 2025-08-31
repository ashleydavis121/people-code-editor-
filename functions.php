<?php
function people_code_editor_enqueue_styles() {
    wp_enqueue_style('people-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'people_code_editor_enqueue_styles');
