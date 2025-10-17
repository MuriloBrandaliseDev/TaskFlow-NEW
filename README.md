# Task Flow - Gerenciador de Tarefas Moderno

Um aplicativo web moderno e responsivo para gerenciamento de tarefas com notificações inteligentes, desenvolvido com Next.js 14 e TypeScript.

## 🚀 Características

- **Interface Moderna**: Design elegante com cores pretas, azul e cinza escuro
- **PWA Completo**: Funciona offline e pode ser instalado como app nativo
- **Notificações Inteligentes**: Alertas automáticos antes do vencimento das tarefas
- **Responsivo**: Layout otimizado para mobile e desktop
- **Armazenamento Local**: Todas as tarefas são salvas localmente no dispositivo
- **Identificação por Dispositivo**: Sistema único por dispositivo (sem login)
- **Animações Fluidas**: Transições e animações modernas com Framer Motion
- **Categorização**: Organize tarefas por categoria e prioridade
- **Estatísticas**: Dashboard com métricas de produtividade

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Framer Motion** - Animações fluidas
- **Zustand** - Gerenciamento de estado
- **Date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos
- **Next-PWA** - Configuração PWA

## 📱 Funcionalidades

### Gerenciamento de Tarefas
- ✅ Criar, editar e excluir tarefas
- 📅 Definir data e horário de vencimento
- 🏷️ Categorizar tarefas
- ⭐ Definir prioridades (Alta, Média, Baixa)
- 📝 Adicionar descrições detalhadas

### Notificações
- 🔔 Alertas 30, 15 e 5 minutos antes do vencimento
- 🚨 Notificação no momento exato do vencimento
- 📱 Notificações push nativas
- ⚙️ Configurações personalizáveis

### Interface
- 📱 Layout responsivo (mobile-first)
- 🖥️ Sidebar para desktop
- 🎨 Tema escuro moderno
- ✨ Animações de entrada suaves
- 📊 Dashboard com estatísticas

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd task-flow
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse o aplicativo**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Build para Produção

```bash
npm run build
npm run start
```

## 📦 Deploy no Netlify

1. **Conecte seu repositório Git ao Netlify**
2. **Configure as seguintes configurações de build:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`

3. **Deploy automático**
O Netlify fará o deploy automaticamente a cada push para a branch principal.

## 🎯 Como Usar

### Primeira Vez
1. Abra o aplicativo no seu navegador
2. O sistema criará automaticamente um perfil baseado no seu dispositivo
3. Comece criando sua primeira tarefa

### Criando Tarefas
1. Clique em "Nova Tarefa"
2. Preencha o nome (obrigatório)
3. Defina data e horário de vencimento
4. Escolha a prioridade e categoria
5. Adicione uma descrição (opcional)
6. Clique em "Criar Tarefa"

### Notificações
- As notificações são solicitadas automaticamente
- Você receberá alertas 30, 15 e 5 minutos antes do vencimento
- Uma notificação final será enviada no momento exato

### Instalação como App
- No mobile: Use "Adicionar à tela inicial"
- No desktop: Use o ícone de instalação na barra de endereços

## 🔧 Configurações

### Personalização
- O app se adapta automaticamente ao dispositivo
- Todas as configurações são salvas localmente
- Não requer login ou cadastro

### Armazenamento
- Todas as tarefas são salvas no localStorage do navegador
- Os dados persistem entre sessões
- Backup automático local

## 📱 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móveis (iOS/Android)
- ✅ Desktop (Windows/Mac/Linux)

## 🎨 Design System

### Cores
- **Primária**: Azul (#3b82f6)
- **Secundária**: Roxo (#8b5cf6)
- **Fundo**: Preto/Cinza escuro (#0f0f0f, #1a1a1a)
- **Texto**: Branco/Cinza claro

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver sugestões:

1. Verifique se está usando uma versão recente do navegador
2. Limpe o cache do navegador
3. Verifique se as notificações estão habilitadas
4. Abra uma issue no GitHub

---

**Task Flow** - Organize sua vida, uma tarefa por vez! 🚀
