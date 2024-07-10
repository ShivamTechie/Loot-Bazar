function fetchProductData() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product");

  fetchProductById(productId)
    .then((productMainData) => {
      populateProductDetails(productMainData);
      return fetchProductsByCategory(productMainData.category);
    })
    .then((products) => {
      displayRelatedProducts(products);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
}

function fetchProductById(productId) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://fakestoreapi.com/products/${productId}`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const productMainData = JSON.parse(xhr.responseText);
        resolve(productMainData);
      } else {
        reject(new Error(`Error fetching product. Status: ${xhr.status}`));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error occurred while fetching product."));
    };
    xhr.send();
  });
}

function fetchProductsByCategory(category) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://fakestoreapi.com/products/category/${category}`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const products = JSON.parse(xhr.responseText);
        resolve(products);
      } else {
        reject(new Error(`Error fetching products. Status: ${xhr.status}`));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error occurred while fetching products."));
    };
    xhr.send();
  });
}

function populateProductDetails(productMainData) {
  if (productMainData && productMainData.image) {
    document.title = `LootBazar.in: ${productMainData.title}`;
    const productImage = document.querySelector(".mb-3");

    const productDetails = document.querySelector(".product-details");
    productImage.innerHTML = `
      <img class="card-img img-fluid"
        src="${productMainData.image}"
        alt="Product Image"
        id="product-detail" style="height:96%; width:80%;margin:auto;""
        
      />
    `;
    productDetails.innerHTML = `
      <div class="card-body">
        <h1 class="h2">${productMainData.title}</h1>
        <p class="h3 py-2">$${productMainData.price.toFixed(2)}</p>
        <p class="py-2">
          ${generateStarIcons(productMainData.rating.rate)}
          <span class="list-inline-item text-dark">Rating ${
            productMainData.rating.rate
          }</span>
        </p>

        <h6>Description:</h6>
        <p>${productMainData.description}</p>

        <h6>Category: ${productMainData.category}</h6>
        <h6>Specification:</h6>
        <ul class="list-unstyled pb-3">
          <li>This product is So effective</li>
          <li>Review of this product are high</li>
          <li>you should so for this product</li>
          <li>Buy this product and enjoy</li>
          <li>You will defenitely come back</li>
          <li>again after Buy this product</li>
          <li>thankyou for purchasing this.</li>
        </ul>

        <form action="" method="GET">
          <input type="hidden" name="product-title" value="Activewear" />
          <div class="row">
            <div class="col-auto">
              <ul class="list-inline pb-3">
                <li class="list-inline-item">
                  Size :
                  <input type="hidden" name="product-size" id="product-size" value="S" />
                </li>
                <li class="list-inline-item">
                  <span class="btn btn-success btn-size">S</span>
                </li>
                <li class="list-inline-item">
                  <span class="btn btn-success btn-size">M</span>
                </li>
                <li class="list-inline-item">
                  <span class="btn btn-success btn-size">L</span>
                </li>
                <li class="list-inline-item">
                  <span class="btn btn-success btn-size">XL</span>
                </li>
              </ul>
            </div>
            <div class="col-auto">
              <ul class="list-inline pb-3">
                <li class="list-inline-item text-right">
                  Quantity
                  <input   type="hidden" name="product-quanity" id="product-quanity" value="1" />
                </li>
                <li class="list-inline-item">
                  <span class="btn btn-success" id="btn-minus" onclick="decreaseQuantity()">-</span>
                </li>
                <li class="list-inline-item">
                  <span class="badge bg-secondary  quantity" id="var-value">1</span>
                </li>
                <li class="list-inline-item">
                  <span class="btn btn-success" id="btn-plus" onclick="increaseQuantity()">+</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="row pb-3">
            <div class="col d-grid">
              <a type="submit" class="btn btn-success btn-lg" name="submit" value="buy" >
  Buy
</a>
            </div>
            <div class="col d-grid">
              <a type="submit" class="btn btn-success btn-lg" name="submit" value="addtocart" onclick="increaseCart()">
                Add To Cart
              </a>
            </div>
          </div>
        </form>
      </div>
    `;

    const carouselImages = document.querySelectorAll(".product-img");
    carouselImages.forEach((img) => {
      img.src = productMainData.image;
    });
  } else {
    console.error("Product data or image not available.");
  }
}

function displayRelatedProducts(products) {
  const relatedCardOuterDiv = document.querySelector(
    "#carousel-related-product"
  );

  products.forEach(function (product) {
    var productCard = `
      <div class="p-2 pb-3" style="width: 273px;">
        <div class="product-wap card rounded-0">
          <div class="card rounded-0" style="height: 425px;">
            <img class="card-img rounded-0 img-fluid" src="${
              product.image
            }" style="height:80%; width:80%;margin:auto;">
            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
              <ul class="list-unstyled">
                <li>
                  <a class="btn btn-success text-white" href="shop-single.html?product=${
                    product.id
                  }">
                    <i class="far fa-heart"></i>
                  </a>
                </li>
                <li>
                  <a class="btn btn-success text-white mt-2" href="shop-single.html?product=${
                    product.id
                  }">
                    <i class="far fa-eye"></i>
                  </a>
                </li>
                <li>
                  <a class="btn btn-success text-white mt-2" href="shop-single.html?product=${
                    product.id
                  }">
                    <i class="fas fa-cart-plus"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <a href="shop-single.html?product=${
              product.id
            }" class="h3 text-decoration-none related-a-tag">${
      product.title
    }</a>
            <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
              <li>M/L/X/XL</li>
              <li class="pt-2">
                <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
              </li>
            </ul>
            <ul class="list-unstyled d-flex justify-content-center mb-1">
              <li>
                ${generateStarIcons(product.rating.rate)}
              </li>
            </ul>
            <p class="text-center mb-0">$${product.price}</p>
          </div>
        </div>
      </div>`;

    var tempElem = document.createElement("div");
    tempElem.innerHTML = productCard.trim();

    relatedCardOuterDiv.appendChild(tempElem.firstChild);
  });

  $("#carousel-related-product").slick({
    infinite: true,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  console.log("Related products displayed.");
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

function increaseQuantity() {
  const value = document.querySelector(".quantity");
  const content = parseInt(value.textContent);
  value.textContent = content + 1;
}

function decreaseQuantity() {
  const value = document.querySelector(".quantity");
  const content = parseInt(value.textContent);
  if (content === 0) {
    return;
  } else {
    value.textContent = content - 1;
  }
}

function increaseCart() {
  const value = document.querySelector(".cart-no");
  const content = parseInt(value.textContent);
  value.textContent = content + 1;
}

document.addEventListener("DOMContentLoaded", function () {
  fetchProductData();
  increaseQuantity();
  decreaseQuantity();
});
