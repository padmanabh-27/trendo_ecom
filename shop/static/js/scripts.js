document.addEventListener("DOMContentLoaded", function () {

    const toast = document.getElementById("cart-toast");

    const cartPopup = document.getElementById("cart-popup");
    const cartItemsBox = document.getElementById("cart-items");
    const openCartBtn = document.getElementById("open-cart");
    const closeCartBtn = document.getElementById("close-cart");
    const cartTotalBox = document.getElementById("cart-total");

    const payBtn = document.querySelector(".pay-btn");

    // -------------------------
    // ADD TO CART
    // -------------------------
    document.querySelectorAll(".add-to-cart").forEach(btn => {

        btn.addEventListener("click", function () {

            const pid = this.dataset.id;
            const name = this.dataset.name;

            fetch(`/shop/add-to-cart/${pid}/`)
                .then(r => r.json())
                .then(() => {

                    if (toast) {
                        toast.textContent = "✅ " + name + " added to cart";
                        toast.classList.add("show");
                        setTimeout(() => toast.classList.remove("show"), 2000);
                    }

                });

        });

    });


    function loadCart() {

        fetch("/shop/cart-data/")
            .then(r => r.json())
            .then(data => {

                cartItemsBox.innerHTML = "";

                if (!data.items || data.items.length === 0) {

                    cartItemsBox.innerHTML =
                        "<p class='empty-cart'>No items in cart</p>";

                    cartTotalBox.textContent = "";

                    if (payBtn) {
                        payBtn.style.display = "none";
                    }

                    return;
                }

                if (payBtn) {
                    payBtn.style.display = "block";
                }

                data.items.forEach(item => {

                    const div = document.createElement("div");
                    div.className = "cart-item";

                    div.innerHTML = `
                        <div>
                            ${item.name}<br>
                            ₹${item.price} × ${item.qty}
                        </div>

                        <div>
                            <button class="qty-btn" data-id="${item.id}" data-action="dec">−</button>
                            <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
                        </div>
                    `;

                    cartItemsBox.appendChild(div);
                });

                cartTotalBox.textContent = "Total : ₹" + data.total;

                attachQtyButtons();
            });
    }


    function attachQtyButtons() {

        document.querySelectorAll(".qty-btn").forEach(btn => {

            btn.addEventListener("click", function () {

                const pid = this.dataset.id;
                const action = this.dataset.action;

                fetch(`/shop/update-cart/${pid}/${action}/`)
                    .then(r => r.json())
                    .then(() => loadCart());

            });

        });

    }


    // -------------------------
    // OPEN CART
    // -------------------------
    if (openCartBtn) {
        openCartBtn.addEventListener("click", function () {
            cartPopup.classList.add("show");
            loadCart();
        });
    }

    // -------------------------
    // CLOSE CART
    // -------------------------
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", function () {
            cartPopup.classList.remove("show");
        });
    }

});
