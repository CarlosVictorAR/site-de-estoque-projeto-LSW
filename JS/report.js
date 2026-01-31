// Sistema de Relatórios - report.js  
    console.log('Sistema de relatórios carregado!');
    
    // Carrega dados do inventário - USA A MESMA CHAVE 'items'
    function loadInventoryData() {
        try {
            // MUDAR AQUI:
            const data = localStorage.getItem('items');
            if (!data) {
                console.log('Nenhum dado encontrado no localStorage (chave: items)');
                return [];
            }
            
            const items = JSON.parse(data);
            console.log(`${items.length} itens carregados do localStorage`);
            
            // Converte os objetos Item para um formato simples
            return items.map(item => ({
                name: item.name || 'Sem nome',
                category: item.category || 'Sem categoria',
                quantity: item.quantity || 0,
                price: item.price || 0
            }));
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return [];
        }
    }

    // Extrai produtos da tabela HTML (como fallback)
    function getProductsFromHTMLTable() {
        const products = [];
        const tableRows = document.querySelectorAll('.inventory-table tbody tr');
        
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const product = {
                    name: cells[0].textContent.trim(),
                    category: cells[1].textContent.trim(),
                    quantity: parseInt(cells[2].textContent) || 0,
                    price: parseFloat(cells[3].textContent.replace('R$', '').replace(',', '.').trim()) || 0
                };
                products.push(product);
            }
        });
        
        return products;
    }
    
    // Calcula estatísticas
    function calculateStatistics(products) {
        let totalProducts = 0;
        let totalValue = 0;
        let lowStockCount = 0;
        let criticalStockCount = 0; // Estoques críticos (≤2)
        let categoryStats = {};
        
        products.forEach(product => {
            const quantity = product.quantity || 0;
            const price = product.price || 0;
            
            // Total de produtos (soma das quantidades)
            totalProducts += quantity;
            
            // Valor total
            totalValue += quantity * price;
            
            // Produtos com estoque baixo (≤5)
            if (quantity <= 5) {
                lowStockCount++;
                
                // Estoques críticos (≤2)
                if (quantity <= 2) {
                    criticalStockCount++;
                }
            }
            
            // Estatísticas por categoria
            const category = product.category || 'Sem categoria';
            if (!categoryStats[category]) {
                categoryStats[category] = {
                    count: 0,
                    value: 0,
                    items: []
                };
            }
            categoryStats[category].count += quantity;
            categoryStats[category].value += quantity * price;
            categoryStats[category].items.push(product);
        });
        
        return {
            totalProducts,
            totalValue,
            lowStockCount,
            criticalStockCount,
            categoryStats,
            totalItems: products.length // Número de produtos diferentes
        };
    }
    
    // Atualiza os cartões de resumo
    function updateSummaryCards(stats) {
        // 1. Total de Itens (produtos diferentes)
        const totalProductsElement = document.querySelector('.reports-overview .report-card:nth-child(1) .value');
        if (totalProductsElement) {
            totalProductsElement.textContent = stats.totalItems;
            // Atualiza descrição
            const descElement = totalProductsElement.nextElementSibling;
            if (descElement && descElement.classList.contains('description')) {
                descElement.textContent = 'Produtos diferentes no inventário';
            }
        }
        
        // 2. Valor Total do Estoque
        const totalValueElement = document.querySelector('.reports-overview .report-card:nth-child(2) .value');
        if (totalValueElement) {
            totalValueElement.textContent = `R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            // Atualiza descrição
            const descElement = totalValueElement.nextElementSibling;
            if (descElement && descElement.classList.contains('description')) {
                descElement.textContent = 'Valor total do inventário';
            }
        }
        
        // 3. Itens com estoque baixo
        const lowStockElement = document.querySelector('.reports-overview .report-card:nth-child(3) .value');
        if (lowStockElement) {
            lowStockElement.textContent = stats.lowStockCount;
            // Atualiza descrição
            const descElement = lowStockElement.nextElementSibling;
            if (descElement && descElement.classList.contains('description')) {
                descElement.textContent = `Produtos com estoque baixo (≤5 unidades)
                ${stats.criticalStockCount > 0 ? ` - ${stats.criticalStockCount} CRÍTICOS (≤2)` : ''}`;
            }
        }
    }
    
    // Atualiza lista de categorias
    function updateCategoryList(stats) {
        const categoryList = document.querySelector('.category-list');
        if (!categoryList) return;
        
        // Limpa a lista
        categoryList.innerHTML = '';
        
        // Ordena categorias por quantidade
        const sortedCategories = Object.entries(stats.categoryStats)
            .sort((a, b) => b[1].count - a[1].count);
        
        // Adiciona cada categoria
        sortedCategories.forEach(([category, data]) => {
            const li = document.createElement('li');
            
            // Calcula porcentagem do total
            const percentage = ((data.count / stats.totalProducts) * 100).toFixed(1);
            
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div>
                        <strong>${category}</strong>
                        <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">
                            ${data.count} unidades • ${percentage}% do total
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: var(--primary-blue);">
                            R$ ${data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">
                            ${data.items.length} produto${data.items.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // Adiciona barra de progresso
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 4px;
                background: #e5e7eb;
                border-radius: 2px;
                margin-top: 8px;
                overflow: hidden;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.style.cssText = `
                width: ${percentage}%;
                height: 100%;
                background: ${getCategoryColor(category)};
                border-radius: 2px;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            li.appendChild(progressBar);
            
            categoryList.appendChild(li);
        });
        
        // Se não houver categorias, mostra mensagem
        if (sortedCategories.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-tertiary);">
                    <i class='bx bx-package' style="font-size: 32px; margin-bottom: 10px;"></i>
                    <br>
                    <strong>Nenhum produto cadastrado</strong>
                    <br>
                    <small>Adicione produtos pelo inventário para ver relatórios</small>
                </div>
            `;
            categoryList.appendChild(li);
        }
    }
    
    // Cor para cada categoria
    function getCategoryColor(category) {
        const colors = {
            'Electronico': '#369FFF',
            'Eletrônicos': '#369FFF',
            'Roupa': '#ef4444',
            'Roupas': '#ef4444',
            'Casa': '#10b981',
            'Casa e Jardim': '#10b981',
            'Livro': '#f59e0b',
            'Livros': '#f59e0b',
            'Brinquedo': '#8b5cf6',
            'Brinquedos': '#8b5cf6',
            'Acessórios': '#f97316'
        };
        return colors[category] || '#6b7280';
    }
    
    // Atualiza alertas de baixo estoque
    function updateLowStockAlerts(stats) {
        const tableBody = document.querySelector('.data-table tbody');
        if (!tableBody) return;
        
        // Limpa a tabela
        tableBody.innerHTML = '';
        
        // Coleta todos os produtos com estoque baixo (≤5)
        let lowStockProducts = [];
        
        Object.entries(stats.categoryStats).forEach(([category, data]) => {
            data.items.forEach(product => {
                if ((product.quantity || 0) <= 5) {
                    lowStockProducts.push({
                        ...product,
                        category: category
                    });
                }
            });
        });
        
        // Ordena por quantidade (do menor para o maior)
        lowStockProducts.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
        
        // Adiciona à tabela
        lowStockProducts.forEach(product => {
            const row = document.createElement('tr');
            
            // Calcula ponto de reposição (ideal seria 10% acima do estoque mínimo)
            const reorderPoint = Math.max(5, Math.ceil((product.quantity || 0) * 1.5));
            
            // Determina status
            let status = '';
            let statusColor = '';
            
            if (product.quantity === 0) {
                status = 'ESGOTADO';
                statusColor = 'var(--status-error)';
                row.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            } else if (product.quantity <= 2) {
                status = 'CRÍTICO';
                statusColor = 'var(--status-error)';
                row.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            } else if (product.quantity <= 5) {
                status = 'BAIXO';
                statusColor = 'var(--status-warning)';
                row.style.backgroundColor = 'rgba(245, 158, 11, 0.08)';
            }
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 4px; height: 24px; background: ${statusColor}; border-radius: 2px;"></div>
                        <div>
                            <strong>${product.name}</strong>
                            <div style="font-size: 12px; color: var(--text-tertiary);">
                                Último preço: R$ ${(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span style="display: inline-block; padding: 4px 10px; background: ${getCategoryColor(product.category)}20; color: ${getCategoryColor(product.category)}; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${product.category}
                    </span>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="font-size: 12px; color: var(--text-tertiary);">Estoque atual</span>
                                <span style="font-weight: 700; color: ${statusColor};">${product.quantity || 0} unidades</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${Math.min(100, ((product.quantity || 0) / 10) * 100)}%; height: 100%; background: ${statusColor};"></div>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <div style="font-weight: 700; font-size: 16px; color: var(--primary-blue);">
                            ${reorderPoint}
                        </div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">
                            unidades
                        </div>
                        <button onclick="reorderProduct('${product.name}')" style="margin-top: 5px; padding: 4px 10px; font-size: 11px; background: var(--primary-blue); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class='bx bx-cart'></i> Comprar
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Se não houver produtos com estoque baixo
        if (lowStockProducts.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
                    <i class='bx bx-check-circle' style="font-size: 40px; margin-bottom: 10px; color: var(--status-success);"></i>
                    <br>
                    <strong>Excelente! Estoque em dia</strong>
                    <br>
                    <small>Todos os produtos estão com estoque adequado (>5 unidades)</small>
                </td>
            `;
            tableBody.appendChild(row);
        }
    }
    
    // Função para simular compra
    window.reorderProduct = function(productName) {
        if (confirm(`Deseja reabastecer o produto "${productName}"?`)) {
            alert(`Pedido de reabastecimento para "${productName}" enviado!`);
            // Aqui você pode integrar com um sistema de pedidos real
        }
    };
    
    // Adiciona botão de atualizar relatório
    function addRefreshButton() {
        // Verifica se já existe o botão
        if (document.getElementById('refresh-report-btn')) {
            return;
        }
        
        // Encontra o container de ações
        const pageHeader = document.querySelector('.page-header');
        if (!pageHeader) return;
        
        // Cria container para botões
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.alignItems = 'center';
        
        // Botão Atualizar
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'refresh-report-btn';
        refreshBtn.className = 'btn btn-primary';
        refreshBtn.innerHTML = '<i class="bx bx-refresh"></i> Atualizar Dados';
        refreshBtn.onclick = refreshReport;
        refreshBtn.title = 'Atualizar com os dados mais recentes';
        
        // Botão Exportar
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-secondary';
        exportBtn.innerHTML = '<i class="bx bx-download"></i> Exportar';
        exportBtn.onclick = exportReport;
        exportBtn.title = 'Exportar relatório em CSV';
        
        buttonContainer.appendChild(refreshBtn);
        buttonContainer.appendChild(exportBtn);
        
        // Adiciona ao cabeçalho
        pageHeader.style.display = 'flex';
        pageHeader.style.justifyContent = 'space-between';
        pageHeader.style.alignItems = 'center';
        pageHeader.appendChild(buttonContainer);
    }
    
    // Exporta relatório para CSV
    function exportReport() {
        const products = loadInventoryData();
        const stats = calculateStatistics(products);
        
        let csv = 'Produto,Categoria,Quantidade,Preço Unitário,Valor Total,Status\n';
        
        products.forEach(product => {
            const totalValue = (product.quantity || 0) * (product.price || 0);
            let status = 'NORMAL';
            
            if (product.quantity === 0) status = 'ESGOTADO';
            else if (product.quantity <= 2) status = 'CRÍTICO';
            else if (product.quantity <= 5) status = 'BAIXO';
            
            csv += `"${product.name}","${product.category}",${product.quantity || 0},${(product.price || 0).toFixed(2)},${totalValue.toFixed(2)},"${status}"\n`;
        });
        
        // Adiciona resumo
        csv += `\nRESUMO\n`;
        csv += `Total de Produtos,${stats.totalItems}\n`;
        csv += `Total de Unidades,${stats.totalProducts}\n`;
        csv += `Valor Total do Estoque,R$ ${stats.totalValue.toFixed(2)}\n`;
        csv += `Produtos com Estoque Baixo,${stats.lowStockCount}\n`;
        csv += `Produtos Críticos,${stats.criticalStockCount}\n`;
        csv += `Data da Exportação,${new Date().toLocaleDateString('pt-BR')}\n`;
        
        // Cria e faz download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio_estoque_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Relatório exportado com sucesso!', 'success');
    }
    
    // Atualiza todo o relatório
    function refreshReport() {
        const products = loadInventoryData();
        const stats = calculateStatistics(products);
        
        updateSummaryCards(stats);
        updateCategoryList(stats);
        updateLowStockAlerts(stats);
        
        showNotification('Dados atualizados com sucesso!', 'success');
        
        // Debug no console
        console.log('=== RELATÓRIO ATUALIZADO ===');
        console.log('Total de produtos diferentes:', stats.totalItems);
        console.log('Total de unidades:', stats.totalProducts);
        console.log('Valor total:', stats.totalValue);
        console.log('Produtos com estoque baixo:', stats.lowStockCount);
        console.log('Categorias:', Object.keys(stats.categoryStats));
        console.log('===========================');
    }
    
    // Mostra notificação
    function showNotification(message, type = 'info') {
        // Remove notificações anteriores
        const oldNotification = document.querySelector('.report-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `report-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? 'var(--status-success)' : 'var(--status-warning)'};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-medium);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-info-circle'}' style="font-size: 20px;"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Adiciona animações CSS
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .data-table tbody tr {
                transition: all 0.2s ease;
            }
            
            .data-table tbody tr:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-light);
            }
            
            .category-list li {
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .category-list li:hover {
                transform: translateX(5px);
                background-color: var(--bg-input-focus) !important;
            }
            
            /* Estilo para o botão de compra */
            button:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                transition: all 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inicializa o sistema de relatórios
    function initReportSystem() {
        console.log('Inicializando sistema de relatórios...');
        
        // Adiciona estilos
        addStyles();
        
        // Adiciona botão de atualizar
        addRefreshButton();
        
        // Carrega e exibe dados
        refreshReport();

        console.log('Sistema de relatórios pronto!');
    }
    
    // Inicia quando a página carregar
    initReportSystem();