<template>
  <div class="shopping-container">
    <header class="main-header">
      <div class="header-content">
        <h1><i class="material-icons">shopping_cart</i> SantiagoTech</h1>
        <p class="header-subtitle">Tu tienda de tecnología de confianza</p>
      </div>
    </header>

    <div class="content-wrapper">
      <section class="products-section">
        <div class="section-header">
          <h2>Catálogo de Productos</h2>
          <p>Explora nuestra selección premium de tecnología</p>
        </div>

        <div class="products-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-badge">Nuevo</div>
            <div class="product-image-wrapper">
              <img
                :src="product.image"
                :alt="product.name"
                class="product-image"
              />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-footer">
                <span class="product-price"
                  >${{ product.price.toFixed(2) }}</span
                >
                <q-btn
                  unelevated
                  color="primary"
                  label="Agregar"
                  @click="addToCart(product)"
                  icon="add_shopping_cart"
                  size="sm"
                  class="add-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="cart-sidebar">
        <div class="cart-header">
          <h2><i class="material-icons">shopping_bag</i> Carrito</h2>
          <span class="cart-count">{{ totalItems }} items</span>
        </div>

        <div v-if="cartItems.length === 0" class="empty-cart">
          <i class="material-icons empty-icon">shopping_cart</i>
          <p>Tu carrito está vacío</p>
          <small>Agrega productos para comenzar</small>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items-list">
            <transition-group name="cart-item" tag="div">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="cart-item-image"
                />
                <div class="cart-item-info">
                  <h4>{{ item.name }}</h4>
                  <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
                  <div class="cart-item-controls">
                    <q-btn
                      flat
                      dense
                      round
                      size="xs"
                      color="grey-7"
                      icon="remove"
                      @click="decreaseQuantity(item)"
                    />
                    <span class="quantity">{{ item.quantity }}</span>
                    <q-btn
                      flat
                      dense
                      round
                      size="xs"
                      color="grey-7"
                      icon="add"
                      @click="increaseQuantity(item)"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      size="xs"
                      color="negative"
                      icon="delete"
                      @click="removeFromCart(item)"
                      class="delete-btn"
                    />
                  </div>
                </div>
              </div>
            </transition-group>
          </div>

          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Impuesto (16%)</span>
              <span>${{ impuesto.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ totalFinal.toFixed(2) }}</span>
            </div>
            <q-btn
              unelevated
              color="positive"
              label="Finalizar Compra"
              icon="payment"
              @click="checkout"
              class="checkout-btn"
              size="md"
            />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useQuasar } from "quasar";

// Importar imágenes
import mouseImage from "/Mouses.jpg";
import playstationImage from "/playstation5.jpg";
import samsungImage from "/Samsung_Ultra.jpg";
import tabletImage from "/Tablet_gamer.jpg";
import tecladoImage from "/Teclado.jpg";
import sonyImage from "/WH-1000X-M6-Feature-Overview.png";

const $q = useQuasar();

const products = ref([
  {
    id: 1,
    name: "Mouse Gaming",
    description: "Mouse ergonómico para gaming profesional",
    price: 49.99,
    image: mouseImage,
  },
  {
    id: 2,
    name: "PlayStation 5",
    description: "Consola de última generación",
    price: 499.99,
    image: playstationImage,
  },
  {
    id: 3,
    name: "Samsung Ultra",
    description: "Smartphone de alta gama",
    price: 899.99,
    image: samsungImage,
  },
  {
    id: 4,
    name: "Tablet Gamer",
    description: "Tablet potente para juegos",
    price: 599.99,
    image: tabletImage,
  },
  {
    id: 5,
    name: "Teclado Mecánico",
    description: "Teclado mecánico RGB",
    price: 129.99,
    image: tecladoImage,
  },
  {
    id: 6,
    name: "Audífonos Sony WH-1000XM6",
    description: "Audífonos con cancelación de ruido",
    price: 349.99,
    image: sonyImage,
  },
]);

const cartItems = ref([]);

const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const impuesto = computed(() => subtotal.value * 0.16);
const totalFinal = computed(() => subtotal.value + impuesto.value);

watch(
  cartItems,
  (newCart) => {
    localStorage.setItem("carrito", JSON.stringify(newCart));
  },
  { deep: true }
);

watch(totalFinal, (newTotal, oldTotal) => {
  if (newTotal > 1000 && oldTotal <= 1000) {
    $q.notify({
      type: "warning",
      message: "¡Atención! Tu compra supera los $1000",
      position: "top",
      timeout: 3000,
      icon: "warning",
    });
  }
});

const addToCart = (product) => {
  const existingItem = cartItems.value.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.value.push({ ...product, quantity: 1 });
  }
  $q.notify({
    type: "positive",
    message: `${product.name} agregado al carrito`,
    position: "top",
    timeout: 1500,
  });
};

const increaseQuantity = (item) => item.quantity++;

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(item);
  }
};

const removeFromCart = (item) => {
  const index = cartItems.value.findIndex((i) => i.id === item.id);
  if (index > -1) {
    cartItems.value.splice(index, 1);
    $q.notify({
      type: "info",
      message: `${item.name} eliminado del carrito`,
      position: "top",
      timeout: 1500,
    });
  }
};

const checkout = () => {
  $q.notify({
    type: "positive",
    message: `¡Compra realizada! Total: $${totalFinal.value.toFixed(2)}`,
    position: "center",
    timeout: 4000,
  });
  cartItems.value = [];
  localStorage.removeItem("carrito");
};

onMounted(() => {
  const savedCart = localStorage.getItem("carrito");
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart);
      $q.notify({
        type: "info",
        message: "Carrito restaurado",
        position: "top",
        timeout: 2000,
      });
    } catch (error) {
      localStorage.removeItem("carrito");
    }
  }
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.shopping-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header */
.main-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.main-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-header h1 i {
  font-size: 2.5rem;
}

.header-subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.95;
  font-weight: 300;
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

/* Products Section */
.products-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.section-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.product-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

.product-image-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-info h3 {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  line-height: 1.3;
  height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.product-description {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  height: 3.36em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #667eea;
  text-align: center;
}

.add-btn {
  font-weight: 600;
  width: 100%;
}

/* Cart Sidebar */
.cart-sidebar {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 1rem;
}

.cart-header h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-header i {
  font-size: 1.5rem;
  color: #667eea;
}

.cart-count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #95a5a6;
}

.empty-icon {
  font-size: 4rem;
  color: #dfe6e9;
  margin-bottom: 1rem;
}

.empty-cart p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #7f8c8d;
}

.empty-cart small {
  font-size: 0.9rem;
  color: #95a5a6;
}

.cart-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.cart-items-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
}

.cart-items-list::-webkit-scrollbar {
  width: 6px;
}

.cart-items-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.cart-items-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  gap: 0.75rem;
}

.cart-item:hover {
  background: #f1f3f5;
}

/* Animaciones para items del carrito */
.cart-item-enter-active {
  animation: slideDown 0.4s ease-out;
}

.cart-item-leave-active {
  animation: slideUp 0.3s ease-in;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 200px;
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
    max-height: 200px;
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
  }
}

.cart-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.cart-item-info h4 {
  font-size: 0.85rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-price {
  font-size: 0.95rem;
  color: #667eea;
  font-weight: 700;
  margin: 0;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.quantity {
  font-weight: 600;
  color: #2c3e50;
  min-width: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.delete-btn {
  margin-left: 0.25rem;
}

/* Cart Summary */
.cart-summary {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.25rem;
  margin-top: auto;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: #2c3e50;
}

.summary-row.total {
  border-top: 2px solid #e0e0e0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.checkout-btn {
  width: 100%;
  margin-top: 1rem;
  font-weight: 600;
  padding: 0.75rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .cart-sidebar {
    position: relative;
    top: 0;
    max-height: none;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .main-header h1 {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .content-wrapper {
    padding: 1rem;
    gap: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .products-section,
  .cart-sidebar {
    padding: 1.25rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .cart-header h2 {
    font-size: 1.2rem;
  }

  .cart-item {
    padding: 0.65rem;
  }

  .cart-item-image {
    width: 45px;
    height: 45px;
  }

  .cart-item-info h4 {
    font-size: 0.8rem;
  }

  .cart-item-price {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .main-header {
    padding: 1.5rem 0;
  }

  .main-header h1 {
    font-size: 1.5rem;
  }

  .main-header h1 i {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.85rem;
  }

  .content-wrapper {
    padding: 0.75rem;
  }

  .products-section,
  .cart-sidebar {
    padding: 1rem;
  }

  .product-image-wrapper {
    height: 150px;
  }

  .product-info {
    padding: 0.85rem;
  }

  .product-info h3 {
    font-size: 0.95rem;
  }

  .product-description {
    font-size: 0.8rem;
  }

  .cart-item-controls {
    gap: 0.3rem;
  }

  .quantity {
    font-size: 0.85rem;
    min-width: 18px;
  }
}
</style>
