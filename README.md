# TaskFlow — Gerenciador de tarefas com SQLite

Aplicativo React Native + Expo para cadastrar, consultar, editar, concluir e excluir tarefas. Os dados são persistidos em SQLite no próprio dispositivo.

## Requisitos
- Node.js LTS
- Expo Go compatível com a versão do Expo usada pelo projeto ou emulador Android
- Conexão com a internet para instalar dependências

## Como executar
1. Extraia o ZIP.
2. Abra a pasta `TaskFlow-SQLite` no VS Code.
3. No terminal, execute:
   ```bash
   npm install
   npx expo install expo-sqlite
   npx expo start
   ```
   O comando `expo install` seleciona a versão de `expo-sqlite` compatível com o SDK do projeto. Se ele atualizar o `package.json`, mantenha a versão selecionada pelo Expo.
4. Leia o QR Code pelo Expo Go ou pressione `a` para abrir no emulador Android.

Se o Expo Go instalado no celular não for compatível com o SDK do projeto, atualize o Expo Go ou crie um development build compatível.

## Estrutura principal
- `App.js`: interface, filtros, validação visual e ações do usuário.
- `src/models/Task.js`: classe de domínio, encapsula validações e conversão dos dados.
- `src/database/database.js`: abre/cria o banco `taskflow.db` e a tabela `tasks`.
- `src/services/TaskRepository.js`: operações CRUD e consultas SQL com filtros e ordenação.
- `src/styles/colors.js`: paleta visual.

## Requisitos demonstrados
- CRUD: criar, listar, atualizar, concluir/reabrir e excluir.
- SQLite: banco local e tabela criados automaticamente.
- Validação: título, descrição, categoria e prioridade.
- SQL: busca por título/descrição/categoria, filtro de status e ordenação.
- Tratamento de erros: `try/catch`, mensagens no formulário e alertas.
- POO: classe `Task`, objetos e classe `TaskRepository`.
- Persistência: feche e reabra o app; as tarefas continuam no banco local.

## Roteiro de evidências para a entrega
1. Tela inicial sem tarefas.
2. Cadastro de uma tarefa preenchida.
3. Tentativa de salvar com campos obrigatórios vazios e mensagem de validação.
4. Lista com tarefas e prioridades.
5. Filtro de pendentes/concluídas e busca.
6. Edição e exclusão de tarefa.
7. Tarefa marcada como concluída.
8. Fechar e reabrir o app para demonstrar a persistência.

## Como explicar na apresentação
- A classe `Task` representa a tarefa e valida os dados.
- `TaskRepository` separa as regras de acesso ao banco da interface.
- SQLite guarda os registros no arquivo local `taskflow.db`.
- As consultas usam parâmetros `?`, reduzindo riscos de SQL injection.
- A lista é recarregada após cada operação para refletir o banco.

## Observação
O projeto usa SQLite local e não inclui integração com serviço em nuvem, pois esta primeira entrega tem foco no banco embarcado. A integração em nuvem pode ser adicionada numa etapa posterior, se for exigida na segunda atividade.
