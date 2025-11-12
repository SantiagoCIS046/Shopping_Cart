# Funcionalidades Implementadas - Carrito de Compras

## ✅ Computed Properties

### 1. totalItems

```javascript
const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
});
```

- **Función**: Calcula la suma de todas las cantidades en el carrito
- **Uso**: Se muestra en el título "Mi Carrito (X items)"
- **Reactivo**: Se actualiza automáticamente cuando se agregan/eliminan productos

### 2. subtotal

```javascript
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});
```

- **Función**: Suma de precio × cantidad de cada producto
- **Uso**: Se muestra en el resumen de compra
- **Reactivo**: Se recalcula automáticamente con cada cambio

### 3. impuesto

```javascript
const impuesto = computed(() => {
  return subtotal.value * 0.16;
});
```

- **Función**: Calcula el 16% del subtotal
- **Uso**: Se muestra como "Impuesto (16%)" en el resumen
- **Reactivo**: Depende del subtotal, se actualiza automáticamente

### 4. totalFinal

```javascript
const totalFinal = computed(() => {
  return subtotal.value + impuesto.value;
});
```

- **Función**: Suma del subtotal + impuesto
- **Uso**: Se muestra como "Total Final" en el resumen
- **Reactivo**: Se actualiza cuando cambian subtotal o impuesto

## ✅ Watchers

### 1. Watch del Carrito (localStorage)

```javascript
watch(
  cartItems,
  (newCart) => {
    localStorage.setItem("carrito", JSON.stringify(newCart));
    console.log("Carrito guardado en localStorage:", newCart);
  },
  { deep: true }
);
```

- **Función**: Guarda automáticamente el carrito en localStorage
- **Opciones**: `{ deep: true }` para observar cambios profundos en el array
- **Trigger**: Se ejecuta cada vez que se agrega, elimina o modifica un producto
- **Persistencia**: El carrito se mantiene incluso al recargar la página

### 2. Watch del Total Final (Alerta $1000)

```javascript
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
```

- **Función**: Detecta cuando el total supera $1000
- **Condición**: Solo muestra alerta al cruzar el umbral (no en cada cambio)
- **Notificación**: Usa Quasar Notify con tipo 'warning'
- **UX**: Informa al usuario sobre compras grandes

## ✅ LocalStorage

### Guardar

```javascript
localStorage.setItem("carrito", JSON.stringify(newCart));
```

- Se ejecuta automáticamente con el watcher
- Convierte el array a JSON string

### Cargar

```javascript
onMounted(() => {
  const savedCart = localStorage.getItem("carrito");
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart);
      $q.notify({
        type: "info",
        message: "Carrito restaurado desde la sesión anterior",
        position: "top",
        timeout: 2000,
      });
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      localStorage.removeItem("carrito");
    }
  }
});
```

- Se ejecuta al montar el componente
- Restaura el carrito guardado
- Maneja errores de parsing
- Notifica al usuario

### Limpiar

```javascript
localStorage.removeItem("carrito");
```

- Se ejecuta al finalizar la compra
- Limpia el carrito guardado

## 📊 Resumen de Compra

El resumen muestra:

1. **Subtotal**: Suma de todos los productos (precio × cantidad)
2. **Impuesto (16%)**: 16% del subtotal
3. **Total Final**: Subtotal + Impuesto

Todos los valores se calculan automáticamente usando computed properties.

## 🧪 Cómo Probar

### Test 1: Computed Properties

1. Agrega productos al carrito
2. Observa cómo se actualiza automáticamente:
   - El contador de items en el título
   - El subtotal
   - El impuesto (16%)
   - El total final

### Test 2: Watch localStorage

1. Agrega productos al carrito
2. Abre las DevTools → Application → Local Storage
3. Verifica que existe la clave 'carrito' con los datos
4. Recarga la página (F5)
5. El carrito debe restaurarse automáticamente

### Test 3: Watch Total > $1000

1. Agrega productos hasta que el total sea menor a $1000
2. Agrega un producto que haga que el total supere $1000
3. Debe aparecer una notificación de advertencia
4. Si sigues agregando productos, no debe aparecer más alertas

### Test 4: Persistencia

1. Agrega varios productos
2. Cierra la pestaña del navegador
3. Abre nuevamente http://localhost:5174
4. El carrito debe estar intacto con todos los productos

### Test 5: Finalizar Compra

1. Agrega productos
2. Haz clic en "Finalizar Compra"
3. El carrito se vacía
4. El localStorage se limpia
5. Recarga la página: el carrito debe estar vacío

## 🎯 Características Implementadas

✅ Computed Properties reactivas
✅ Watchers con deep: true
✅ LocalStorage (setItem, getItem, removeItem)
✅ Persistencia del carrito
✅ Alerta cuando total > $1000
✅ Cálculo automático de impuestos
✅ Resumen de compra detallado
✅ Notificaciones de Quasar
✅ Manejo de errores
✅ Console.log para debugging
