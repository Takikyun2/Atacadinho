export async function listarRegistrosCaixaAnteriores() {
    try {
        const response = await window.api.listarRegistrosCaixa();

        function formatarData(dataString) {
            const data = new Date(dataString); // Converte a string do banco em um objeto Date
            return new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(data);
        }

        const logins = await window.api.listarLogins();
        console.log(logins);

        const outputTabelaRelatoriosCaixas = response
            .filter(caixa => caixa.valor_final && caixa.data_fechamento) // Filtra apenas os caixas fechados
            .map(caixa => {
                const loginAbertura = logins.find(login => login.id_login === caixa.login_id_abertura); // Encontra o login que abriu o caixa
                const loginFechamento = logins.find(login => login.id_login === caixa.login_id_fechamento); // Encontra o login que fechou o caixa

                const nomeUsuarioAbriu = loginAbertura ? loginAbertura.nomecompleto : 'Usuário não encontrado';
                const nomeUsuarioFechou = loginFechamento ? loginFechamento.nomecompleto : 'Usuário não encontrado';

                return `
                    <tr>
                        <td>${caixa.id_caixa}</td>
                        <td>${formatarData(caixa.data_abertura)}</td>
                        <td>${formatarData(caixa.data_fechamento)}</td>
                        <td>${caixa.valor_inicial.toFixed(2)}</td>
                        <td>${caixa.valor_final.toFixed(2)}</td>
                        <td>${caixa.valor_final.toFixed(2)}</td>
                        <td>${nomeUsuarioAbriu}</td>
                        <td>${nomeUsuarioFechou}</td>
                    </tr>
                `;
            })
            .join(''); // Une todos os elementos do array em uma única string

        return outputTabelaRelatoriosCaixas;

    } catch (error) {
        alert("Erro ao listar registros do caixa: " + error);
    }
}