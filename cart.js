// Run when page is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get cart items from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Get container element where cart will display
    let cartContainer = document.getElementById("cart-items");
    let totalContainer = document.getElementById("cart-total");

    cartContainer.innerHTML = ""; // clear before adding

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalContainer.textContent = "£0.00";
        return;
    }

    let total = 0;

    // Loop through cart items and display them
    cart.forEach((item, index) => {
        let row = document.createElement("div");
        row.classList.add("cart-row");

        row.innerHTML = `
            <span>${item.name}</span> - 
            <span>£${item.price}</span> x 
            <span>${item.quantity}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;

        cartContainer.appendChild(row);

        total += item.price * item.quantity;
    });

    // Show total
    totalContainer.textContent = "£" + total.toFixed(2);
});

// Function to remove items from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // remove 1 item at position index
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload(); // reload page to update cart display
}
