export async function listarVendas(){
    try {
        const vendas = await window.api.listarRegistrosDeVendas();
        console.log(vendas);

        const outputTabelaRelatoriosVendas = vendas.map(
            venda => {

            return `
                <tr>
                    <td>${venda.data}</td>
                    <td>${venda.hora}</td>
                    <td>${venda.produto}</td>
                    <td>${venda.codigo}</td>
                    <td>${venda.valorUnitario.toFixed(2)}</td>
                    <td>${venda.quantidade}</td>
                    <td>${venda.total.toFixed(2)}</td>
                    <td>${venda.vendedor}</td>
                </tr>
            `;
        })
        .join(''); // Une todos os elementos do array em uma única string

    return outputTabelaRelatoriosVendas;
        
    } catch (error) {
        console.log(error);
        
    }
}