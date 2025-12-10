document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#productsTable tbody');
    const addProductBtn = document.getElementById('addProductBtn');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const importJsonInput = document.getElementById('importJsonInput');

    let currentProducts = [];

    // Tenta carregar os produtos do `data.js` (variável `produtos`)
    if (typeof produtos !== 'undefined') {
        currentProducts = JSON.parse(JSON.stringify(produtos)); // Clona para evitar mutação direta
    }

    const renderTable = () => {
        tableBody.innerHTML = '';
        currentProducts.forEach((product, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;

            row.innerHTML = `
                <td><input type="text" value="${product.imagem || ''}" data-field="imagem"></td>
                <td><input type="text" value="${product.nome || ''}" data-field="nome"></td>
                <td><textarea data-field="descricao">${product.descricao || ''}</textarea></td>
                <td><input type="text" value="${product.categoria || ''}" data-field="categoria"></td>
                <td><input type="number" value="${product.preco || 0}" data-field="preco"></td>
                <td><input type="text" value="${(product.campanhas || []).join(',')}" data-field="campanhas" placeholder="ex: natal,promocao"></td>
                <td><input type="number" value="${product.estoque || 0}" data-field="estoque"></td>
                <td><input type="text" value="${product.googleDriveLink || ''}" data-field="googleDriveLink"></td>
                <td><input type="text" value="${product.phone || ''}" data-field="phone"></td>
                <td><textarea data-field="message">${product.message || ''}</textarea></td>
                <td><button class="delete-btn">Excluir</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Adiciona listeners para os botões de exclusão
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rowIndex = e.target.closest('tr').dataset.index;
                currentProducts.splice(rowIndex, 1);
                renderTable();
            });
        });
    };

    const saveChanges = () => {
        const newProducts = [];
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const product = {};
            row.querySelectorAll('input, textarea').forEach(input => {
                const field = input.dataset.field;
                if (field) {
                    if (input.type === 'number') {
                        product[field] = parseFloat(input.value) || 0;
                    } else if (field === 'campanhas') {
                        product[field] = input.value ? input.value.split(',').map(s => s.trim()) : [];
                    } else {
                        product[field] = input.value;
                    }
                }
            });
            newProducts.push(product);
        });
        currentProducts = newProducts;
        alert('Alterações salvas na visualização! Exporte para salvar o arquivo.');
        renderTable(); // Re-renderiza para limpar e normalizar
    };

    const addProduct = () => {
        currentProducts.push({
            nome: "Novo Produto",
            descricao: "",
            categoria: "",
            preco: 0,
            imagem: "imagem.jpg",
            campanhas: [],
            estoque: 1,
            googleDriveLink: "",
            phone: "",
            message: ""
        });
        renderTable();
    };

    const exportJson = () => {
        saveChanges(); // Garante que os dados mais recentes sejam exportados
        const fileContent = `const produtos = ${JSON.stringify(currentProducts, null, 2)};`;
        const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.js';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importJson = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let content = e.target.result;
                // Remove `const produtos = ` e o ponto e vírgula final se for um arquivo .js
                if (content.includes('const produtos =')) {
                    content = content.replace('const produtos =', '').replace(/;$/, '').trim();
                } else if (content.includes('const produtosJSON =')) { // Compatibilidade com o formato do catálogo
                     content = content.replace('const produtosJSON =', '').split('const campanhasJSON')[0].replace(/;$/, '').trim();
                }
                
                const importedData = JSON.parse(content);

                if (Array.isArray(importedData)) {
                    // Mapeia os campos do formato do catálogo para o formato do mini-site, se necessário
                    currentProducts = importedData.map(p => ({
                        nome: p.nome || '',
                        descricao: p.descricao || '',
                        categoria: p.categoria || '',
                        preco: p.preco || 0,
                        imagem: p.imagem || '',
                        campanhas: p.campanhas || [],
                        estoque: p.estoque !== undefined ? p.estoque : 1,
                        googleDriveLink: p.googleDriveLink || '',
                        // Adiciona campos faltantes com valores padrão
                        phone: p.phone || '',
                        message: p.message || `Olá! Tenho interesse no produto ${p.nome}.`
                    }));
                    alert(`${currentProducts.length} produtos importados com sucesso!`);
                    renderTable();
                } else {
                    alert('O arquivo JSON não contém um array de produtos válido.');
                }
            } catch (error) {
                console.error('Erro ao importar o arquivo:', error);
                alert('Erro ao processar o arquivo. Verifique se é um JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    // Adiciona os listeners aos botões
    addProductBtn.addEventListener('click', addProduct);
    saveChangesBtn.addEventListener('click', saveChanges);
    exportJsonBtn.addEventListener('click', exportJson);
    importJsonInput.addEventListener('change', importJson);

    // Renderiza a tabela inicial
    renderTable();
});