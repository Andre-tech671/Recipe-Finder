// TheMealDB's public API does not require an API key for these endpoints.
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchMeals();
});
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", closeMealDetails);

async function searchMeals() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    showError("Enter a meal or ingredient to search.");
    searchInput.focus();
    return;
  }

  closeMealDetails();
  clearError();
  mealsContainer.replaceChildren();
  resultHeading.textContent = `Searching for “${searchTerm}”…`;
  searchBtn.disabled = true;

  try {
    const response = await fetch(`${BASE_URL}search.php?s=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const data = await response.json();
    const meals = data.meals || [];

    if (meals.length === 0) {
      resultHeading.textContent = "";
      showError(`No recipes found for “${searchTerm}”. Try another search term.`);
      return;
    }

    resultHeading.textContent = `Search results for “${searchTerm}” (${meals.length})`;
    displayMeals(meals);
    searchInput.value = "";
  } catch (error) {
    resultHeading.textContent = "";
    showError("Could not load recipes. Check your internet connection and try again.");
  } finally {
    searchBtn.disabled = false;
  }
}

function displayMeals(meals) {
  const fragment = document.createDocumentFragment();
  meals.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "meal";
    card.dataset.mealId = meal.idMeal;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View recipe for ${meal.strMeal}`);

    const image = document.createElement("img");
    image.src = meal.strMealThumb;
    image.alt = meal.strMeal;
    image.loading = "lazy";
    const info = document.createElement("div");
    info.className = "meal-info";
    const title = document.createElement("h3");
    title.className = "meal-title";
    title.textContent = meal.strMeal;
    info.append(title);
    if (meal.strCategory) {
      const category = document.createElement("span");
      category.className = "meal-category";
      category.textContent = meal.strCategory;
      info.append(category);
    }
    card.append(image, info);
    fragment.append(card);
  });
  mealsContainer.replaceChildren(fragment);
}

async function handleMealClick(event) {
  const card = event.target.closest(".meal");
  if (!card || !mealsContainer.contains(card)) return;
  await showMealDetails(card.dataset.mealId);
}

mealsContainer.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".meal")) {
    event.preventDefault();
    showMealDetails(event.target.dataset.mealId);
  }
});

async function showMealDetails(mealId) {
  clearError();
  resultHeading.textContent = "Loading recipe…";
  mealDetailsContent.textContent = "Loading recipe…";
  mealDetails.classList.remove("hidden");
  mealDetails.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const response = await fetch(`${BASE_URL}lookup.php?i=${encodeURIComponent(mealId)}`);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const data = await response.json();
    const meal = data.meals?.[0];
    if (!meal) throw new Error("Recipe not found");
    renderMealDetails(meal);
    resultHeading.textContent = "";
  } catch (error) {
    mealDetails.classList.add("hidden");
    resultHeading.textContent = "";
    showError("Could not load this recipe. Please try again.");
  }
}

function renderMealDetails(meal) {
  const wrapper = document.createElement("div");
  wrapper.className = "recipe-content";

  const image = document.createElement("img");
  image.className = "meal-details-img";
  image.src = meal.strMealThumb;
  image.alt = meal.strMeal;
  const title = document.createElement("h2");
  title.className = "meal-details-title";
  title.textContent = meal.strMeal;

  const meta = document.createElement("p");
  meta.className = "meal-details-category";
  meta.textContent = [meal.strCategory, meal.strArea].filter(Boolean).join(" · ");

  const ingredients = document.createElement("ul");
  ingredients.className = "ingredients-list";
  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim();
    const measure = meal[`strMeasure${index}`]?.trim();
    if (!ingredient) continue;
    const item = document.createElement("li");
    const icon = document.createElement("i");
    icon.className = "fas fa-check";
    icon.setAttribute("aria-hidden", "true");
    item.append(icon, document.createTextNode(`${measure ? `${measure} ` : ""}${ingredient}`));
    ingredients.append(item);
  }

  const instructions = document.createElement("section");
  instructions.className = "meal-details-instructions";
  const instructionsTitle = document.createElement("h3");
  instructionsTitle.textContent = "Instructions";
  const instructionsText = document.createElement("p");
  instructionsText.textContent = meal.strInstructions || "Instructions are not available for this recipe.";
  instructions.append(instructionsTitle, instructionsText);

  wrapper.append(image, title);
  if (meta.textContent) wrapper.append(meta);
  const ingredientsTitle = document.createElement("h3");
  ingredientsTitle.textContent = "Ingredients";
  wrapper.append(ingredientsTitle, ingredients, instructions);

  if (meal.strYoutube) {
    const videoLink = document.createElement("a");
    videoLink.className = "youtube-link";
    videoLink.href = meal.strYoutube;
    videoLink.target = "_blank";
    videoLink.rel = "noopener noreferrer";
    videoLink.innerHTML = '<i class="fab fa-youtube" aria-hidden="true"></i> Watch on YouTube';
    wrapper.append(videoLink);
  }
  mealDetailsContent.replaceChildren(wrapper);
}

function closeMealDetails() {
  mealDetails.classList.add("hidden");
  mealDetailsContent.replaceChildren();
}

function showError(message) {
  errorContainer.textContent = message;
  errorContainer.classList.remove("hidden");
}

function clearError() {
  errorContainer.classList.add("hidden");
  errorContainer.textContent = "";
}
