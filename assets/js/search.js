document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("q");

  if (searchTerm) {
    fetchProducts(searchTerm)
      .then((matchedProducts) => {
        displayProducts(matchedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  } else {
    console.log("No search term provided.");
  }
});

function fetchProducts(searchTerm) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const products = JSON.parse(xhr.responseText);
          const matchedProducts = products.filter((product) =>
            matchProduct(product, searchTerm)
          );
          resolve(matchedProducts);
        } else {
          reject(new Error(`Error fetching products. Status: ${xhr.status}`));
        }
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error occurred while fetching products."));
    };
    xhr.send();
  });
}

function matchProduct(product, searchTerm) {
  return (
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.price.toString().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.rating.rate.toString().includes(searchTerm)
  );
}

function displayProducts(products) {
  const rowOfShop = document.querySelector(".category-cards");
  const heading = document.querySelector(".headline");
  heading.textContent = "Search Result";

  const status = document.querySelector(".result-status");

  rowOfShop.innerHTML = "";
  rowOfShop.appendChild(status);

  if (products.length > 0) {
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
              }" class="h3 text-decoration-none card-size">${product.title}</a>
              <ul class="w-100 list-unstyled d-flex justify-content-between mb-0"></ul>
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
    status.textContent = "";
  } else {
    status.textContent = "No product found. Try searching for a valid product.";
  }
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
