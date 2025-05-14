interface Product {
  nome: string;
  quantidade: number;
}

interface CacheStructure {
  [date: string]: {
    [id: string]: Product[];
  };
}

let productCache: CacheStructure = {};

export function updateProductCache(
  id: string,
  date: string,
  products: Product[]
): void {
  console.log("=== Iniciando atualização do cache ===");
  console.log("ID recebido:", id);
  console.log("Data recebida:", date);
  console.log("Produtos recebidos:", products);

  // Validação dos dados
  if (!id || !date || !products || !Array.isArray(products)) {
    console.error("Dados inválidos recebidos");
    return;
  }

  // Initialize the date structure if it doesn't exist
  if (!productCache[date]) {
    console.log("Criando nova entrada para a data:", date);
    productCache[date] = {};
  }

  // Update or add the products for the given ID
  const previousProducts = productCache[date][id];
  if (previousProducts) {
    console.log("Atualizando produtos existentes para o ID:", id);
  } else {
    console.log("Adicionando novos produtos para o ID:", id);
  }

  productCache[date][id] = products;

  console.log("Cache atualizado com sucesso");
  console.log("Estado atual do cache:", JSON.stringify(productCache, null, 2));
  console.log("=== Fim da atualização do cache ===");
}

// Function to get the current cache (for testing/debugging)
export function getProductCache(): CacheStructure {
  console.log("=== Obtendo estado atual do cache ===");
  console.log("Cache atual:", JSON.stringify(productCache, null, 2));
  return productCache;
}

// Function to clear the cache (if needed)
export function clearProductCache(): void {
  console.log("=== Limpando cache ===");
  productCache = {};
  console.log("Cache limpo com sucesso");
}

// Exemplo de uso para teste
export function testCache(): void {
  console.log("=== Iniciando teste do cache ===");

  // Primeira inserção
  updateProductCache("51", "21/03/2024", [
    { nome: "nomedoproduto", quantidade: 40 },
    { nome: "produto2", quantidade: 31 },
  ]);

  // Segunda inserção (deve atualizar)
  updateProductCache("51", "21/03/2024", [
    { nome: "produto3", quantidade: 25 },
  ]);

  // Inserção em outra data
  updateProductCache("52", "22/03/2024", [
    { nome: "produto4", quantidade: 10 },
  ]);

  console.log("=== Fim do teste do cache ===");
}
