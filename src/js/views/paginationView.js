import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    //page 1 and there r other pages
    if (currPage === 1 && numPage > 1) {
      return this._generateMarkupNext(currPage);
    }

    //last page
    if (currPage === numPage && numPage > 1) {
      return this._generateMarkupPrev(currPage);
    }

    //other page
    if (currPage < numPage) {
      return `
        ${this._generateMarkupPrev(currPage)}
        ${this._generateMarkupNext(currPage)}
      `;
    }

    return '';
  }

  _generateMarkupPrev(currPage) {
    return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
      </button>
    `;
  }

  _generateMarkupNext(currPage) {
    return `
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
    `;
  }
}

export default new PaginationView();
