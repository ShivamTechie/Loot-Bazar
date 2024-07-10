function populateCategoriesSection() {
  const categoriesSection = document.querySelector(".month-row");
  const categoryImages = {
    electronics: "assets/img/electronic.jpg",
    jewelery: "assets/img/jewelery.jpg",
    "men's clothing": "assets/img/mens-clothing.jpg",
    "women's clothing": "assets/img/womens-clothing.jpg",
  };

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products/categories");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const categories = JSON.parse(xhr.responseText);
          const randomCategories = shuffleArray(categories).slice(0, 3);

          categoriesSection.innerHTML = "";

          randomCategories.forEach((category) => {
            const imgSrc = categoryImages[category.toLowerCase()];

            const categoryHTML = `
              <div class="col-12 col-md-4 p-5 mt-3">
                <a href="shop.html?category=${category}"><img src="${imgSrc}" class="rounded-circle img-fluid border"></a>
                <h5 class="text-center mt-3 mb-3">${category}</h5>
                <p class="text-center"><a href="shop.html?category=${category}" class="btn btn-success">Go Shop</a></p>
              </div>
            `;
            categoriesSection.insertAdjacentHTML("beforeend", categoryHTML);
          });

          resolve();
        } else {
          reject(
            new Error(`Error fetching random categories. Status: ${xhr.status}`)
          );
        }
      }
    };
    xhr.onerror = function () {
      reject(
        new Error("Network error occurred while fetching random categories.")
      );
    };
    xhr.send();
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

populateCategoriesSection()
  .then(() => {
    console.log("Categories populated successfully.");
  })
  .catch((error) => {
    console.error("Error populating categories:", error);
  });
