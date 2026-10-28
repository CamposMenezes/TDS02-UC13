export class Task {
  constructor({ id = null, title, description, category, priority = 'Média', done = false, createdAt = null }) {
    this.id = id;
    this.title = String(title ?? '').trim();
    this.description = String(description ?? '').trim();
    this.category = String(category ?? '').trim();
    this.priority = priority;
    this.done = Boolean(done);
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.title) throw new Error('Informe o título da tarefa.');
    if (this.title.length > 80) throw new Error('O título deve ter no máximo 80 caracteres.');
    if (!this.description) throw new Error('Informe a descrição da tarefa.');
    if (!this.category) throw new Error('Informe a categoria da tarefa.');
    if (!['Baixa', 'Média', 'Alta'].includes(this.priority)) {
      throw new Error('Selecione uma prioridade válida.');
    }
    return true;
  }

  toDatabase() {
    this.validate();
    return {
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      done: this.done ? 1 : 0,
    };
  }

  static fromDatabase(row) {
    return new Task({ ...row, done: row.done === 1 });
  }
}
