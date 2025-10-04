// Abrir/fechar popup do assistente
const btnAssistant = document.getElementById('btnAssistant');
const popup = document.getElementById('assistantPopup');
const closeBtn = document.getElementById('assistantClose');

btnAssistant?.addEventListener('click', () => {
  popup?.classList.toggle('hidden');
});

closeBtn?.addEventListener('click', () => popup?.classList.add('hidden'));

// Enviar mensagem (simulada)
const form = document.getElementById('assistantForm');
const input = document.getElementById('assistantText');
const body = document.querySelector('.assistant-body');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const bubble = document.createElement('div');
  bubble.className = 'msg user';
  bubble.textContent = text;
  body.appendChild(bubble);
  input.value = '';
  body.scrollTop = body.scrollHeight;

  // resposta simulada
  setTimeout(() => {
    const bot = document.createElement('div');
    bot.className = 'msg bot';
    bot.textContent = 'Anotado! Posso calcular um novo ranking baseado nessa camada.';
    body.appendChild(bot);
    body.scrollTop = body.scrollHeight;
  }, 600);
});
