/**
 * utils.js - Camada Axiomática de Persistência Local e Comunicação Inter-Módulos
 *
 * Objetivo: Centralizar as funções de localStorage e feedback visual (Toast)
 * para garantir a integridade dos dados e eliminar a dependência de serviços externos (Firebase).
 */

// --- 1. PERSISTÊNCIA LOCAL (CRITICAL FIX: ELIMINA FIREBASE) ---

/**
 * Salva dados no localStorage com uma chave específica.
 * @param {string} key A chave para o item no localStorage.
 * @param {any} data Os dados a serem salvos (serão convertidos para JSON).
 */
export function saveLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Erro ao salvar '${key}' no localStorage:`, e);
    }
}

/**
 * Carrega dados do localStorage com uma chave específica.
 * @param {string} key A chave do item no localStorage.
 * @param {any} defaultValue Valor a ser retornado se a chave não for encontrada.
 * @returns {any} Os dados carregados ou o valor padrão.
 */
export function loadLocalData(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.error(`Erro ao carregar '${key}' do localStorage. Retornando valor padrão.`, e);
        return defaultValue;
    }
}

// --- 2. COMUNICAÇÃO INTER-MÓDULOS ---

/**
 * Carrega o Índice de Proficiência Subjetiva de Inglês para adaptar o fluxo.
 * @returns {number} Índice de 0 a 10.
 */
export function getProficiencyIndex() {
    return loadLocalData('english_proficiency_index', 5.0);
}

/**
 * Carrega a Categoria Crítica da Reflexão Diária para o Fluxo Adaptativo.
 * @returns {string} Categoria Crítica ('Foco', 'Fadiga', 'Emoção' ou 'Normal').
 */
export function getCriticalCategory() {
    const dailyLog = loadLocalData('daily_reflection_log', {});
    const today = new Date().toISOString().split('T')[0];
    
    // Assume a categoria crítica é a última salva no log de hoje.
    const logKey = Object.keys(dailyLog).sort().pop();
    if (logKey && logKey.startsWith(today)) {
        return dailyLog[logKey].critical_category || 'Normal';
    }

    return 'Normal'; 
}


// --- 3. FEEDBACK VISUAL (TOAST) ---

/**
 * Exibe uma notificação Toast customizada.
 * @param {string} message A mensagem a ser exibida.
 * @param {boolean} isDanger Se é uma mensagem de alerta/retrocesso (usa cor diferente).
 */
export function showToast(message, isDanger = false) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.className = 'fixed bottom-5 right-5 z-50 p-4 rounded-lg shadow-xl transition-opacity duration-300 opacity-0 min-w-[200px] text-center';
        document.body.appendChild(toast);
    }

    toast.innerHTML = message;
    toast.style.backgroundColor = isDanger ? '#cf6679' : '#03DAC6';
    toast.style.color = isDanger ? '#121212' : '#121212'; // Cor de texto consistente
    
    // Exibe o Toast
    toast.style.opacity = '1';
    
    // Oculta o Toast após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}