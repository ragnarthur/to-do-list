# Aplicação de Lista de Tarefas

![Screenshot da Aplicação de Lista de Tarefas](static/screenshot.png)

## Visão Geral

A Aplicação de Lista de Tarefas é uma ferramenta moderna e responsiva de gerenciamento de tarefas, construída com Flask, JavaScript e Bootstrap. Ela permite aos usuários adicionar, editar, excluir e visualizar tarefas com diferentes níveis de prioridade. Este projeto demonstra uma abordagem de desenvolvimento full-stack, integrando um backend Flask com um frontend aprimorado com Bootstrap.

## Funcionalidades

- **Adicionar Tarefas**: Crie tarefas com título, descrição, data de vencimento e nível de prioridade.
- **Editar Tarefas**: Modifique tarefas existentes.
- **Excluir Tarefas**: Remova tarefas que não são mais necessárias.
- **Destaque de Prioridade**: Diferencie visualmente as tarefas com base nos seus níveis de prioridade.
- **Design Responsivo**: Otimizado para uso em desktops, tablets e dispositivos móveis.

## Tecnologias Utilizadas

- **Backend**: Flask, SQLAlchemy, SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6), Bootstrap 5
- **Controle de Versão**: Git

## Começando

### Pré-requisitos

Certifique-se de ter instalado:
- Python 3.6+
- Git

### Instalação

1. **Clone o repositório**:
    ```sh
    git clone https://github.com/seu-usuario/nome-do-repositorio.git
    cd nome-do-repositorio
    ```

2. **Crie e ative um ambiente virtual**:
    ```sh
    python -m venv venv
    source venv/bin/activate  # No Windows, use `venv\Scripts\activate`
    ```

3. **Instale as dependências**:
    ```sh
    pip install -r requirements.txt
    ```

4. **Execute a aplicação**:
    ```sh
    python run.py
    ```

5. **Abra seu navegador e acesse**:
    ```
    http://127.0.0.1:5000/
    ```

## Uso

1. **Adicionar uma Tarefa**: Preencha os detalhes da tarefa (título, descrição, data de vencimento, prioridade) e clique em "Adicionar".
2. **Editar uma Tarefa**: Clique no ícone de lápis ao lado da tarefa, atualize os detalhes e salve.
3. **Excluir uma Tarefa**: Clique no ícone de lixeira ao lado da tarefa.

## Estrutura do Código

