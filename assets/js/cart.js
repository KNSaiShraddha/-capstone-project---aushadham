document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const orderSummary = document.querySelector('.order-summary');
    const removeItemBtns = document.querySelectorAll('.remove-item');
    const quantityInputs = document.querySelectorAll('.quantity-selector input');
    const updateCartBtn = document.querySelector('.btn-update');
    
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Add to cart functionality
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.dataset.id || Math.floor(Math.random() * 1000); // In a real app, use actual product IDs
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('₹', ''));
                const productImage = productCard.querySelector('img').src;
                
                // Check if product already in cart
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                // Update cart in localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Show feedback
                alert(`${productName} has been added to your cart!`);
            });
        });
    }
    
    // Update cart count display
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Render cart items on cart page
    if (cartItemsContainer) {
        renderCartItems();
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="products.html">Continue shopping</a></p>';
            updateOrderSummary();
            return;
        }
        
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="item-meta">
                            <span class="price">₹${item.price.toFixed(2)}</span>
                            <div class="quantity-selector">
                                <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
                                <input type="number" value="${item.quantity}" min="1">
                                <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
                        <span class="item-total">₹${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = `
            <div class="cart-header">
                <h2>Your Items</h2>
                <span>${cart.reduce((total, item) => total + item.quantity, 0)} items</span>
            </div>
            ${itemsHTML}
            <div class="cart-actions">
                <a href="products.html" class="continue-shopping"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
                <button class="btn btn-update">Update Cart</button>
            </div>
        `;
        
        // Re-attach event listeners to new elements
        attachCartItemEvents();
        updateOrderSummary();
    }
    
    function attachCartItemEvents() {
        // Quantity controls
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.nextElementSibling;
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        });
        
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                input.value = parseInt(input.value) + 1;
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                
                cart = cart.filter(item => item.id !== itemId);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                renderCartItems();
                updateCartCount();
            });
        });
    }
    
    // Update cart button
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            document.querySelectorAll('.cart-item').forEach(item => {
                const itemId = item.dataset.id;
                const newQuantity = parseInt(item.querySelector('input').value);
                
                const cartItem = cart.find(item => item.id === itemId);
                if (cartItem) {
                    cartItem.quantity = newQuantity;
                }
            });
            
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
            
            alert('Cart updated successfully!');
        });
    }
    
    // Update order summary
    function updateOrderSummary() {
        if (!orderSummary) return;
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
        const tax = subtotal * 0.09; // 9% tax
        const total = subtotal + shipping + tax;
        
        orderSummary.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `₹${subtotal.toFixed(2)}`;
        orderSummary.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `₹${shipping.toFixed(2)}`;
        orderSummary.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `₹${tax.toFixed(2)}`;
        orderSummary.querySelector('.summary-row.total span:last-child').textContent = `₹${total.toFixed(2)}`;
    }
});