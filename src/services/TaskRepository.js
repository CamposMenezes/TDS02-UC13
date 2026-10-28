import { getDatabase } from '../database/database';
import { Task } from '../models/Task';

// Camada de acesso a dados: centraliza SQL e operações CRUD.
export class TaskRepository {
  async create(taskData) {
    const task = taskData instanceof Task ? taskData : new Task(taskData);
    const values = task.toDatabase();
    const db = await getDatabase();
    const result = await db.runAsync(
      'INSERT INTO tasks (title, description, category, priority, done) VALUES (?, ?, ?, ?, ?)',
      values.title, values.description, values.category, values.priority, values.done
    );
    return this.getById(result.lastInsertRowId);
  }

  async getById(id) {
    const db = await getDatabase();
    const row = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', Number(id));
    return row ? Task.fromDatabase(row) : null;
  }

  async getAll({ search = '', status = 'Todas', category = '', order = 'recentes' } = {}) {
    const db = await getDatabase();
    const conditions = [];
    const params = [];
    if (search.trim()) {
      conditions.push('(title LIKE ? OR description LIKE ? OR category LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }
    if (status === 'Pendentes') conditions.push('done = 0');
    if (status === 'Concluídas') conditions.push('done = 1');
    if (category.trim()) {
      conditions.push('category = ?');
      params.push(category.trim());
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = order === 'alfabetica' ? 'title COLLATE NOCASE ASC' : order === 'antigas' ? 'createdAt ASC, id ASC' : 'createdAt DESC, id DESC';
    const rows = await db.getAllAsync(`SELECT * FROM tasks ${where} ORDER BY ${orderBy}`, ...params);
    return rows.map(Task.fromDatabase);
  }

  async update(id, taskData) {
    const task = taskData instanceof Task ? taskData : new Task({ ...taskData, id: Number(id) });
    const values = task.toDatabase();
    const db = await getDatabase();
    const result = await db.runAsync(
      'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, done = ? WHERE id = ?',
      values.title, values.description, values.category, values.priority, values.done, Number(id)
    );
    if (!result.changes) throw new Error('A tarefa não foi encontrada.');
    return this.getById(id);
  }

  async toggleDone(id) {
    const db = await getDatabase();
    const result = await db.runAsync('UPDATE tasks SET done = CASE done WHEN 1 THEN 0 ELSE 1 END WHERE id = ?', Number(id));
    if (!result.changes) throw new Error('A tarefa não foi encontrada.');
    return this.getById(id);
  }

  async delete(id) {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM tasks WHERE id = ?', Number(id));
    if (!result.changes) throw new Error('A tarefa não foi encontrada.');
    return true;
  }

  async getCategories() {
    const db = await getDatabase();
    const rows = await db.getAllAsync('SELECT DISTINCT category FROM tasks ORDER BY category COLLATE NOCASE');
    return rows.map(row => row.category);
  }
}
