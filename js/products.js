document.addEventListener('DOMContentLoaded', function () {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
    // Variáveis para estado
    let currentPage = 1;
    const itemsPerPage = 10;
    let searchTerm = '';
    let sortOption = 'name-asc';
  
    // Mensagem de boas-vindas
    const welcomeMessage = document.getElementById('current-user');
    if (currentUser) {
      welcomeMessage.textContent = `${currentUser.email} (${currentUser.role})`;
    } else {
      alert('You must log in first!');
      window.location.href = 'login.html';
    }
  
    // Logout
    document.getElementById('logout-button').addEventListener('click', function () {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  
    // Função para ordenar os produtos
    function sortProducts(productsArray) {
      const sortedProducts = [...productsArray];
      const [key, order] = sortOption.split('-');
  
      sortedProducts.sort((a, b) => {
        const fieldA = a[key].toLowerCase();
        const fieldB = b[key].toLowerCase();
  
        if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  
      return sortedProducts;
    }
  
    // Função para filtrar os produtos
    function filterProducts(productsArray) {
      if (!searchTerm) return productsArray;
  
      return productsArray.filter(product => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      });
    }
  
    // Função para renderizar os produtos com filtros e paginação
    function renderProducts() {
      const tableBody = document.getElementById('product-table-body');
      tableBody.innerHTML = '';
  
      // Filtrar e ordenar os produtos
      const filteredProducts = filterProducts(products);
      const sortedProducts = sortProducts(filteredProducts);
  
      // Verificar se há produtos para exibir
      if (sortedProducts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No products found</td></tr>`;
        document.getElementById('current-page').textContent = `Page 0 of 0`;
        return;
      }
  
      // Calcular total de páginas
      const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  
      // Ajustar currentPage se necessário
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;
  
      // Determinar os produtos da página atual
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  
      // Atualizar o indicador de página
      document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
  
      // Renderizar os produtos
      paginatedProducts.forEach((product, index) => {
        const row = document.createElement('tr');
  
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.brand}</td>
          <td>${product.category}</td>
          <td>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
          </td>
        `;
  
        tableBody.appendChild(row);
      });
    }
  
    // Event listener para busca
    document.getElementById('search-bar').addEventListener('input', function (e) {
      searchTerm = e.target.value.toLowerCase();
      currentPage = 1;
      renderProducts();
    });
  
    // Event listener para ordenação
    document.getElementById('sort-options').addEventListener('change', function (e) {
      sortOption = e.target.value;
      renderProducts();
    });
  
    // Event listener para paginação
    document.getElementById('prev-page').addEventListener('click', function () {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });
  
    document.getElementById('next-page').addEventListener('click', function () {
      const filteredProducts = filterProducts(products);
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
      }
    });
  
    // Adicionar produto
    document.getElementById('add-product-button').addEventListener('click', function () {
      const name = prompt('Enter product name:');
      const brand = prompt('Enter product brand:');
      const category = prompt('Enter product category:');
      if (name && brand && category) {
        products.push({ name, brand, category });
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
      }
    });
  
    // Editar ou deletar produto
    document.getElementById('product-table-body').addEventListener('click', function (e) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      if (e.target.classList.contains('edit-btn')) {
        const product = products[index];
        const newName = prompt('Edit product name:', product.name);
        const newBrand = prompt('Edit product brand:', product.brand);
        const newCategory = prompt('Edit product category:', product.category);
  
        if (newName && newBrand && newCategory) {
          products[index] = { name: newName, brand: newBrand, category: newCategory };
          localStorage.setItem('products', JSON.stringify(products));
          renderProducts();
        }
      }
  
      if (e.target.classList.contains('delete-btn')) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
      }
    });
  
    // Renderizar produtos inicialmente
    renderProducts();
  });
  