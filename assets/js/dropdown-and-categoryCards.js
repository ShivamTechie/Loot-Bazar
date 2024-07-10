function fetchCategories() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products/categories", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const categories = JSON.parse(xhr.responseText);
        resolve(categories);
      } else {
        console.error(`Error fetching categories. Status: ${xhr.status}`);
        reject(new Error(`Failed to fetch categories. Status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      console.error("Network error occurred fetching categories.");
      reject(new Error("Network error occurred."));
    };

    xhr.send();
  });
}

function fetchProducts(category) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const apiUrl =
      category === "all"
        ? "https://fakestoreapi.com/products/"
        : `https://fakestoreapi.com/products/category/${category}`;

    xhr.open("GET", apiUrl, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const products = JSON.parse(xhr.responseText);
        resolve(products);
      } else {
        console.error(
          `Error fetching products for category "${category}". Status: ${xhr.status}`
        );
        reject(
          new Error(
            `Failed to fetch products for category "${category}". Status: ${xhr.status}`
          )
        );
      }
    };

    xhr.onerror = function () {
      console.error(
        `Network error occurred fetching products for category "${category}".`
      );
      reject(new Error(`Network error occurred.`));
    };

    xhr.send();
  });
}

function populateDropdown(categories) {
  const categoryDropdown = document.getElementById("categoryDropdown");

  categories.forEach((category) => {
    const anchor = document.createElement("a");
    anchor.classList.add("dropdown-item");
    anchor.href = `shop.html?category=${category}`;
    anchor.textContent = category[0].toUpperCase() + category.slice(1);

    categoryDropdown.appendChild(anchor);
  });
}

function populateCategoryProducts(category) {
  fetchProducts(category)
    .then((products) => {
      const rowOfShop = document.querySelector(".category-cards");
      const heading = document.querySelector(".headline");

      if (category === "all") {
        document.title = "All category";
        heading.textContent = `All category`;
      } else {
        heading.textContent = `All ${category}`;
      }

      rowOfShop.innerHTML = "";

      products.forEach((product) => {
        const categoryCard = `
          <div class="col-md-4">
            <div class="card mb-4 product-wap rounded-0">
              <div class="card rounded-0" style="height:400px;">
                <img class="card-img rounded-0 img-fluid" src="${
                  product.image
                }" style="height:80%; width:80%;margin:auto;"/>
                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                  <ul class="list-unstyled">
                    <li><a class="btn btn-success text-white" href="shop-single.html?product=${
                      product.id
                    }"><i class="far fa-heart"></i></a></li>
                    <li><a class="btn btn-success text-white mt-2" href="shop-single.html?product=${
                      product.id
                    }"><i class="far fa-eye"></i></a></li>
                    <li><a class="btn btn-success text-white mt-2" href="shop-single.html?product=${
                      product.id
                    }"><i class="fas fa-cart-plus"></i></a></li>
                  </ul>
                </div>
              </div>
              <div class="card-body">
                <a href="shop-single.html?product=${
                  product.id
                }" class="h3 text-decoration-none card-size title-hover">${
          product.title
        }</a>
                <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                  <!-- Add additional list items here if needed -->
                </ul>
                <ul class="list-unstyled d-flex justify-content-center mb-1">
                  ${generateStarIcons(product.rating.rate)}
                </ul>
                <p class="text-center mb-0">$${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        `;
        rowOfShop.insertAdjacentHTML("beforeend", categoryCard);
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function generateStarIcons(rating) {
  const starIcons = [];
  const yellowStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < yellowStars) {
      starIcons.push('<i class="text-warning fa fa-star"></i>');
    } else if (hasHalfStar && i === yellowStars) {
      starIcons.push('<i class="text-warning fa fa-star-half-alt"></i>');
    } else {
      starIcons.push('<i class="text-muted fa fa-star"></i>');
    }
  }

  return starIcons.join("");
}

function initializePage() {
  document.addEventListener("DOMContentLoaded", function () {
    fetchCategories()
      .then((categories) => {
        populateDropdown(categories);

        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get("category");

        if (categoryParam) {
          populateCategoryProducts(categoryParam);
        }
      })
      .catch((error) => {
        console.error("Failed to initialize page. " + error.message);
      });
  });
}

initializePage();
