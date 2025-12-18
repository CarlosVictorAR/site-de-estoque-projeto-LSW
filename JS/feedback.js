document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const trigger = document.querySelector('.feedback-trigger');
    const popup = document.querySelector('.feedback-popup');
    const closeBtn = document.querySelector('.close-popup');
    const cancelBtn = document.querySelector('.btn-cancel');
    const form = document.querySelector('.feedback-form');
    const textarea = form?.querySelector('textarea');
    
    if (!trigger || !popup) {
        console.log('Elementos de feedback não encontrados');
        return;
    }
    
    // Configuração
    const FORMSPREE_URL = 'https://formspree.io/f/mdkqqbeb'; 
    
    // Abrir popup
    trigger.addEventListener('click', () => {
        popup.classList.add('show');
        if (textarea) textarea.focus();
    });
    
    // Fechar popup
    function closePopup() {
        popup.classList.remove('show');
        if (form) form.reset();
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (cancelBtn) cancelBtn.addEventListener('click', closePopup);
    
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && !trigger.contains(e.target)) {
            closePopup();
        }
    });
    
    // Envio do formulário
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const message = textarea?.value.trim();
            if (!message) {
                showMessage('Por favor, escreva algo', 'error');
                return;
            }
            
            // Dados para enviar
            const data = {
                mensagem: message,
                pagina: window.location.pathname,
                data: new Date().toLocaleString('pt-BR')
            };
            
            // Mostrar status
            showMessage('Enviando...');
            
            try {
                // Tentar Formspree
                const response = await fetch(FORMSPREE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showMessage('Feedback enviado! Obrigado!', 'success');
                    form.reset();
                    setTimeout(closePopup, 1500);
                } else {
                    throw new Error();
                }
            } catch {
                // Fallback: salvar localmente
                try {
                    saveLocal(data);
                    showMessage('Salvo localmente! Obrigado!', 'success');
                    form.reset();
                    setTimeout(closePopup, 1500);
                } catch {
                    showMessage('Erro. Tente novamente.', 'error');
                }
            }
        });
    }
    
    // Funções auxiliares
    function showMessage(text, type = 'success') {
        // Remove mensagem anterior
        let msg = document.querySelector('.status-message');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'status-message';
            document.body.appendChild(msg);
        }
        
        msg.textContent = text;
        msg.className = `status-message ${type} show`;
        
        setTimeout(() => {
            msg.classList.remove('show');
        }, 3000);
    }
    
    function saveLocal(data) {
        const feedbacks = JSON.parse(localStorage.getItem('simple_feedbacks') || '[]');
        feedbacks.push({ ...data, id: Date.now() });
        
        // Limitar a 50
        if (feedbacks.length > 50) feedbacks.shift();
        
        localStorage.setItem('simple_feedbacks', JSON.stringify(feedbacks));
    }
});