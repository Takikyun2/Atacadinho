export async function categoriasMaisVendidasDia(){
    
    try {
        const valorTotalCategoria = await window.api.listarESomarCategoriasVendidasNoPeriodo({ 
            tipoPeriodo: "mes",
            mes: 12,
            ano: 2024
           });
        
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}