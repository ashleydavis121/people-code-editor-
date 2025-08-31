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
// ====== Currency & Cart Setup ======
const rates = { GBP:1, USD:1.27, EUR:1.16 };
const currencySymbols = { GBP:"£", USD:"$", EUR:"€" };

const currencyDropdown = document.getElementById("currency");
const totalElement = document.querySelector(".total");
const discountMessage = document.getElementById("discount-message");
const cartTable = document.getElementById("cart-table").querySelector("tbody");
const emptyCartMsg = document.getElementById("empty-cart");

// ====== Format Number ======
function formatNumber(num) { 
  return Number(num).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}); 
}

// ====== Update Cart Totals ======
function updateCart() {
  let totalGBP = 0;
  const currency = currencyDropdown.value;
  const rate = rates[currency];
  const symbol = currencySymbols[currency] || currency;

  const rows = cartTable.querySelectorAll("tr");
  if (rows.length === 0) {
    emptyCartMsg.style.display = "block";
    totalElement.textContent = "Total: " + symbol + "0.00";
    return;
  } else {
    emptyCartMsg.style.display = "none";
  }

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector(".quantity-input").value);
    const priceEl = row.querySelector(".price");
    const subtotalEl = row.querySelector(".subtotal");
    const gbpPrice = parseFloat(priceEl.dataset.gbp);

    priceEl.textContent = symbol + formatNumber(gbpPrice * rate);
    subtotalEl.textContent = symbol + formatNumber(gbpPrice * qty * rate);
    totalGBP += gbpPrice * qty;
  });

  totalElement.textContent = "Total: " + symbol + formatNumber(totalGBP * rate);

  // Save cart state to localStorage
  saveCartToLocalStorage();
}

// ====== Save Cart Items to localStorage ======
function saveCartToLocalStorage() {
  const cart = [];
  cartTable.querySelectorAll("tr").forEach(row => {
    const name = row.querySelector(".product-name").textContent;
    const qty = parseFloat(row.querySelector(".quantity-input").value);
    const price = parseFloat(row.querySelector(".price").dataset.gbp);
    cart.push({name, quantity: qty, price});
  });
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ====== Load Cart Items from localStorage ======
function loadCartFromLocalStorage() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0) return;

  // Update table quantities
  const rows = cartTable.querySelectorAll("tr");
  rows.forEach((row, i) => {
    if(cart[i]) row.querySelector(".quantity-input").value = cart[i].quantity;
  });

  updateCart();
}

// ====== Event Listeners ======
currencyDropdown.addEventListener("change", updateCart);

document.addEventListener("input", e => {
  if (e.target.classList.contains("quantity-input")) updateCart();
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("remove-btn")) {
    e.target.closest("tr").remove();
    updateCart();
  }
});

// ====== Discount Codes ======
document.getElementById("apply-discount").addEventListener("click", () => {
  const code = document.getElementById("discount-code").value.trim().toUpperCase();
  const discountCodes = { "TEST10": 10, "SAVE5": 5 };

  if(discountCodes[code]) {
    let totalGBP = 0;
    cartTable.querySelectorAll("tr").forEach(row => {
      const qty = parseFloat(row.querySelector(".quantity-input").value);
      const gbpPrice = parseFloat(row.querySelector(".price").dataset.gbp);
      totalGBP += gbpPrice * qty;
    });
    const discountedTotal = totalGBP * (1 - discountCodes[code]/100);
    const currency = currencyDropdown.value;
    const symbol = currencySymbols[currency] || currency;
    totalElement.textContent = "Total: " + symbol + formatNumber(discountedTotal * rates[currency]);
    discountMessage.textContent = `Discount applied: ${discountCodes[code]}% off!`;
  } else {
    discountMessage.textContent = "Invalid discount code.";
  }
});

// ====== Checkout Button ======
document.querySelector(".checkout-btn").addEventListener("click", () => {
  alert("Proceeding to checkout (integration with Stripe/PayPal goes here).");
});

// ====== Welcome Message ======
document.addEventListener("DOMContentLoaded", () => {
  const userEmail = localStorage.getItem("userEmail");
  const username = localStorage.getItem("username");

  if(userEmail || username){
    const welcomeDiv = document.createElement("div");
    welcomeDiv.textContent = `Welcome${username ? ", " + username : ""}${userEmail ? " ("+userEmail+")" : ""}!`;
    welcomeDiv.style.fontWeight = "600";
    welcomeDiv.style.marginBottom = "20px";
    document.body.prepend(welcomeDiv);
  }

  loadCartFromLocalStorage();
});

// Initial cart update
updateCart();
