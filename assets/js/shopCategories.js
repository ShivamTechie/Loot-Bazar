document.addEventListener("DOMContentLoaded", function () {
  fetchCategoriesAndPopulateList()
    .then((categories) => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get("category");
      const searchTerm = urlParams.get("q");

      if (categoryParam === "all") {
        document.title = `All Categories`;
      } else if (categoryParam) {
        document.title = `${categoryParam}`;
      } else if (searchTerm) {
        document.title = `Search Results for ${searchTerm}`;
      }
    })
    .catch((error) => {
      console.error("Error fetching and populating categories:", error);
    });
});

function fetchCategoriesAndPopulateList() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products/categories");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const categories = JSON.parse(xhr.responseText);
          populateCategoriesList(categories);
          resolve(categories);
        } else {
          reject(`Error fetching categories. Status: ${xhr.status}`);
        }
      }
    };
    xhr.onerror = function () {
      reject("Network error occurred while fetching categories.");
    };
    xhr.send();
  });
}

function populateCategoriesList(categories) {
  const outer = document.querySelector(".list-unstyled");

  const allCategoriesLink = document.createElement("li");
  allCategoriesLink.classList.add("pb-3");
  allCategoriesLink.innerHTML = `
    <a class="collapsed d-flex justify-content-between h3 text-decoration-none" href="shop.html?category=all" onclick="handleAllCategoriesClick(event)">
      All categories
    </a>
  `;
  outer.appendChild(allCategoriesLink);

  categories.forEach((category) => {
    const categoryDiv = document.createElement("li");
    categoryDiv.classList.add("pb-3");

    const listItem = `
      <a class="collapsed d-flex justify-content-between h3 text-decoration-none" href="shop.html?category=${category}">
        ${category[0].toUpperCase() + category.slice(1)}
      </a>
    `;

    categoryDiv.innerHTML = listItem;
    outer.appendChild(categoryDiv);
  });
}

function handleAllCategoriesClick(event) {
  event.preventDefault();
  const url = new URL(event.target.href);
  url.searchParams.set("category", "all");
  history.pushState(null, "", url);
  populateCategoryProducts("all");
}
