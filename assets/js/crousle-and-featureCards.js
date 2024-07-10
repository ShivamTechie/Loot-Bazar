function fetchProducts() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const products = JSON.parse(xhr.responseText);
        resolve(products);
      } else {
        console.error(`Error fetching products. Status: ${xhr.status}`);
        reject(new Error(`Failed to fetch products. Status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      console.error("Network error occurred fetching products.");
      reject(new Error("Network error occurred."));
    };

    xhr.send();
  });
}

function populateCarousel() {
  const carouselItems = document.querySelectorAll(".carousel-item");
  const anchor = document.querySelectorAll(".link-c");

  fetchProducts()
    .then((products) => {
      const randomProducts = getRandomProducts(products, 3);

      carouselItems.forEach((item, index) => {
        const product = randomProducts[index];
        const img = item.querySelector("img");
        const title = item.querySelector("h2");
        const description = item.querySelector("p");

        anchor[index].href = `shop-single.html?product=${product.id}`;
        img.src = product.image;
        img.classList.add("crosule");
        title.textContent = product.title;
        description.textContent = product.description;
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function populateFeaturedProducts() {
  const featuredSection = document.querySelector(".bg-light .container");

  fetchProducts()
    .then((products) => {
      const productsRandom = getRandomProducts(products, 3);

      productsRandom.forEach((product) => {
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.style.textAlign = "left";

        const starsHtml = generateStarIcons(product.rating.rate);

        cardBody.innerHTML = `
          <ul class="list-unstyled d-flex justify-content-between">
            <li>${starsHtml}</li>
            <li class="text-muted text-right">$${product.price}</li>
          </ul>
          <a href="shop-single.html?product=${product.id}" class="h2 text-decoration-none text-dark title-hover">${product.title}</a>
          <p class="card-text" style="max-height: 3rem; overflow: hidden;">${product.description}</p>
          <p class="text-muted">Reviews (${product.rating.count})</p>
        `;

        const card = document.createElement("div");
        card.style.height = "100%";
        card.classList.add("card");

        const cardLink = document.createElement("a");
        cardLink.href = `shop-single.html?product=${product.id}`;
        cardLink.classList.add("card-link");
        cardLink.style.height = "287px";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;
        img.classList.add("card-img-top");
        img.style.height = "100%";
        img.style.width = "60%";
        img.style.padding = "12px 0px";

        cardLink.appendChild(img);
        card.appendChild(cardLink);
        card.appendChild(cardBody);

        const col = document.createElement("div");
        col.style.height = "517px";
        col.classList.add("col-12", "col-md-4", "mb-4");
        col.appendChild(card);

        featuredSection.querySelector(".row").appendChild(col);
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function getRandomProducts(products, count) {
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

populateCarousel();
populateFeaturedProducts();
