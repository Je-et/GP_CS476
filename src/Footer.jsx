/* Required to define and use React components. */
import React from "react";

/* CSS styles for Footer */
import './Footer.css';

/* Returns JSX that renders a <footer> HTML element containing a copyright notice. */
function Footer () {
    return <footer>&copy; Green Basket 2024</footer>;
}

/* Makes the Footer component available for import in other files. */
export default Footer;