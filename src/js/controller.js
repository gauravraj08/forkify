import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0 update results view to mark selected search
    resultView.update(model.getSearchResultsPage());

    bookmarkView.update(model.state.bookMarks);

    //1 loading recipe

    await model.loadRecipe(id);
    // const { recipe } = model.state;

    //2 rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1 Get search query
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    //2 load search result
    await model.loadSearchResult(query);

    //3 render result
    // console.log(model.state.search.result);
    // resultView.render(model.state.search.result);
    resultView.render(model.getSearchResultsPage());
    console.log(model.getSearchResultsPage());

    //4 render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //1 render NEW result
  resultView.render(model.getSearchResultsPage(goToPage));

  //2 render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  //update recipe servings in state
  model.updateServings(servings);

  //update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  //update
  recipeView.update(model.state.recipe);

  //render bookmark
  bookmarkView.render(model.state.bookMarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //render success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarkView.render(model.state.bookMarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

// showRecipe();
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
