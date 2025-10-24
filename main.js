const API_URL =
  "https://68fa6a99ef8b2e621e7feb11.mockapi.io/kamronbek/products";

const form = document.getElementById("productForm");
const list = document.getElementById("productList");

// Yangi yoki tahrirlangan productni saqlash
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    color: form.color.value,
    year: form.year.value,
    price: form.price.value,
    image: form.image.value,
  };

  const id = form.productId.value;

  try {
    if (id) {
      // Tahrirlash
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // Yangi product qo‘shish
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    form.reset();
    form.productId.value = "";
    loadProducts();
  } catch (error) {
    console.error("Xatolik:", error);
  }
});

// Productlar ro‘yxatini yuklash
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    list.innerHTML = products
      .map(
        (p) => `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">
              ID: ${p.id}<br>
              Rang: ${p.color}<br>
              Yil: ${p.year}<br>
              Narx: $${p.price}
            </p>
            <button class="btn btn-success btn-sm" onclick="editProduct('${p.id}')"><i class="fas fa-edit"></i> Tahrirlash</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i> O‘chirish</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Yuklashda xatolik:", error);
  }
}

window.editProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();
    form.productId.value = p.id;
    form.name.value = p.name;
    form.color.value = p.color;
    form.year.value = p.year;
    form.price.value = p.price;
    form.image.value = p.image;
  } catch (error) {
    console.error("Tahrirlashda xatolik:", error);
  }
};

// O‘chirish
window.deleteProduct = async (id) => {
  if (confirm("Haqiqatan o‘chirmoqchimisiz?")) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      loadProducts();
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  }
};

loadProducts();
