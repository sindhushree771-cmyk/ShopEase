const products = [
  {id:1,name:"Wireless Headphones",category:"Electronics",price:59.99,emoji:"🎧",color:"#e5e8df",description:"Comfortable wireless headphones for music, study and everyday listening."},
  {id:2,name:"Everyday Smartphone",category:"Electronics",price:399.00,emoji:"📱",color:"#e4eafa",description:"A modern smartphone concept with a bright screen and a sleek design."},
  {id:3,name:"Classic Wristwatch",category:"Electronics",price:89.50,emoji:"⌚",color:"#f1e7dc",description:"A simple, versatile watch that works for casual and formal days."},
  {id:4,name:"Cotton T-Shirt",category:"Clothing",price:24.00,emoji:"👕",color:"#f4e4dc",description:"A soft everyday cotton T-shirt with a relaxed, easy-to-style fit."},
  {id:5,name:"Canvas Sneakers",category:"Clothing",price:48.00,emoji:"👟",color:"#e8e5f1",description:"Casual canvas sneakers designed for everyday comfort."},
  {id:6,name:"Classic Backpack",category:"Clothing",price:42.50,emoji:"🎒",color:"#e2ece5",description:"A practical backpack for books, commuting and daily essentials."},
  {id:7,name:"Ceramic Plant Pot",category:"Home & Decor",price:18.00,emoji:"🪴",color:"#e8ebdd",description:"A minimal plant pot to bring a little green into your room."},
  {id:8,name:"Scented Candle",category:"Home & Decor",price:16.50,emoji:"🕯️",color:"#f4e6c9",description:"A cosy decorative candle for a calm evening at home."}
];
let selectedCategory = "All Products";
let cart = [];
const $ = id => document.getElementById(id);
const productGrid = $("productGrid"), searchInput = $("searchInput");
function money(value){return "$"+value.toFixed(2)}
function showView(view){
  $("homeView").hidden = view !== "home";
  $("detailView").hidden = view !== "detail";
  $("cartView").hidden = view !== "cart";
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderProducts(){
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(p =>
    (selectedCategory === "All Products" || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
  );
  productGrid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-image" style="background:${p.color}"><span class="emoji" role="img" aria-label="${p.name}">${p.emoji}</span></div>
      <div class="product-info"><div class="product-category">${p.category}</div><h3>${p.name}</h3>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="small-button" data-detail="${p.id}">Details</button></div>
      </div>
    </article>`).join("");
  $("resultCount").textContent = `${filtered.length} product${filtered.length===1?"":"s"}`;
  $("emptyMessage").hidden = filtered.length !== 0;
}
function openDetail(id){
  const p = products.find(item=>item.id===id); if(!p)return;
  $("detailContent").innerHTML = `<div class="detail-layout">
    <div class="detail-image" style="background:${p.color}"><span class="emoji" role="img" aria-label="${p.name}">${p.emoji}</span></div>
    <div class="detail-copy"><div class="product-category">${p.category}</div><h1>${p.name}</h1><p>${p.description}</p><div class="price">${money(p.price)}</div>
    <button class="small-button" data-add="${p.id}">Add to cart</button></div></div>`;
  showView("detail");
}
function addToCart(id){
  const existing=cart.find(item=>item.id===id);
  if(existing) existing.quantity++; else cart.push({id,quantity:1});
  updateCartCount(); toast(`${products.find(p=>p.id===id).name} added to cart`);
}
function updateCartCount(){ $("cartCount").textContent=cart.reduce((sum,item)=>sum+item.quantity,0); }
function renderCart(){
  const container=$("cartContent");
  if(!cart.length){
    container.innerHTML='<div class="empty-cart"><h3>Your cart is empty</h3><p>Explore the collection and add something you like.</p><button data-home>Browse products</button></div>'; return;
  }
  const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0);
  container.innerHTML=`<div>${cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-row">
    <div class="cart-thumb" style="background:${p.color}">${p.emoji}</div>
    <div><h3>${p.name}</h3><p>${money(p.price)} each</p></div>
    <div class="quantity-control"><button data-quantity="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div>
    <button class="remove-button" data-remove="${p.id}">Remove</button></div>`}).join("")}</div>
    <div class="cart-summary"><div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-line"><span>Shipping</span><span>Free</span></div><div class="summary-line summary-total"><span>Total</span><span>${money(subtotal)}</span></div><button class="checkout-button" id="checkoutButton">Demo checkout</button></div>`;
}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
document.querySelectorAll(".category-btn").forEach(button=>button.addEventListener("click",()=>{
  selectedCategory=button.dataset.category;
  document.querySelectorAll(".category-btn").forEach(b=>b.classList.toggle("active",b===button));
  renderProducts();
}));
searchInput.addEventListener("input",renderProducts);
$("productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-detail]");if(b)openDetail(Number(b.dataset.detail))});
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add){addToCart(Number(add.dataset.add));return}
  const qty=e.target.closest("[data-quantity]"); if(qty){
    const id=Number(qty.dataset.quantity), item=cart.find(x=>x.id===id); if(item){item.quantity+=Number(qty.dataset.change);if(item.quantity<=0)cart=cart.filter(x=>x.id!==id)}
    updateCartCount();renderCart();return;
  }
  const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));updateCartCount();renderCart();return}
  if(e.target.closest("[data-home]")){showView("home");return}
  if(e.target.closest("#cartNav")){renderCart();showView("cart");return}
  if(e.target.closest("#checkoutButton")){toast("Demo checkout complete! No payment was processed.");cart=[];updateCartCount();renderCart()}
});
renderProducts();
