import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, FlatList, Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Task } from './src/models/Task';
import { TaskRepository } from './src/services/TaskRepository';
import { colors } from './src/styles/colors';

const repository = new TaskRepository();
const emptyForm = { title: '', description: '', category: '', priority: 'Média' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todas');
  const [order, setOrder] = useState('Recentes');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const result = await repository.getAll({ search, status, order });
      setTasks(result);
      setError('');
    } catch (e) {
      setError('Não foi possível carregar as tarefas. Feche e abra o app ou tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [search, status, order]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const counts = useMemo(() => ({
    pending: tasks.filter(t => !t.done).length,
    done: tasks.filter(t => t.done).length,
  }), [tasks]);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setModalVisible(true);
  }

  function openEdit(task) {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, category: task.category, priority: task.priority });
    setError('');
    setModalVisible(true);
  }

  async function saveTask() {
    try {
      setBusy(true);
      setError('');
      const task = new Task({ ...form, done: editingId ? (tasks.find(t => t.id === editingId)?.done ?? false) : false });
      task.validate();
      if (editingId) await repository.update(editingId, task);
      else await repository.create(task);
      setModalVisible(false);
      setForm(emptyForm);
      await loadTasks();
    } catch (e) {
      setError(e.message || 'Não foi possível salvar a tarefa.');
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete(task) {
    Alert.alert('Excluir tarefa', `Deseja excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await repository.delete(task.id); await loadTasks(); }
        catch { Alert.alert('Erro', 'Não foi possível excluir a tarefa.'); }
      }}
    ]);
  }

  async function toggleTask(task) {
    try { await repository.toggleDone(task.id); await loadTasks(); }
    catch { Alert.alert('Erro', 'Não foi possível alterar o status da tarefa.'); }
  }

  function updateForm(key, value) { setForm(current => ({ ...current, [key]: value })); }

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskTop}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={[styles.priority, item.priority === 'Alta' && styles.highPriority]}>{item.priority}</Text>
      </View>
      <Text style={[styles.taskTitle, item.done && styles.completedTitle]}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.taskActions}>
        <Pressable style={[styles.smallButton, item.done ? styles.neutralButton : styles.doneButton]} onPress={() => toggleTask(item)}>
          <Text style={styles.smallButtonText}>{item.done ? 'Reabrir' : 'Concluir'}</Text>
        </Pressable>
        <Pressable style={styles.smallButton} onPress={() => openEdit(item)}><Text style={styles.smallButtonText}>Editar</Text></Pressable>
        <Pressable style={[styles.smallButton, styles.deleteButton]} onPress={() => confirmDelete(item)}><Text style={styles.deleteText}>Excluir</Text></Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Task</Text>
          <Text style={styles.subtitle}>Organize suas prioridades</Text>
        </View>
        <Pressable style={styles.addButton} onPress={openNew}><Text style={styles.addButtonText}>+ Nova</Text></Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><Text style={styles.summaryNumber}>{counts.pending}</Text><Text style={styles.summaryLabel}>Pendentes</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryNumber}>{counts.done}</Text><Text style={styles.summaryLabel}>Concluídas</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryNumber}>{tasks.length}</Text><Text style={styles.summaryLabel}>Exibidas</Text></View>
      </View>

      <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Buscar título, descrição ou categoria..." placeholderTextColor={colors.textMuted} />
      <View style={styles.filters}>
        {['Todas', 'Pendentes', 'Concluídas'].map(value => (
          <Pressable key={value} onPress={() => setStatus(value)} style={[styles.filter, status === value && styles.activeFilter]}>
            <Text style={[styles.filterText, status === value && styles.activeFilterText]}>{value}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Ordenar:</Text>
        {[
          { value: 'recentes', label: 'Recentes' },
          { value: 'antigas', label: 'Antigas' },
          { value: 'alfabetica', label: 'A–Z' },
        ].map(item => <Pressable key={item.value} onPress={() => setOrder(item.value)}><Text style={[styles.sortOption, order === item.value && styles.selectedSort]}>{item.label}</Text></Pressable>)}
      </View>

      {error && !modalVisible ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? <ActivityIndicator style={{ marginTop: 30 }} size="large" color={colors.primary} /> :
        <FlatList
          data={tasks}
          keyExtractor={item => String(item.id)}
          renderItem={renderTask}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadTasks}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Nenhuma tarefa encontrada</Text><Text style={styles.emptyText}>Adicione uma tarefa ou altere os filtros.</Text></View>}
        />
      }

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>{editingId ? 'Editar tarefa' : 'Nova tarefa'}</Text>
              <Text style={styles.label}>Título *</Text>
              <TextInput style={styles.input} value={form.title} onChangeText={v => updateForm('title', v)} maxLength={80} placeholder="Ex.: Estudar JavaScript" placeholderTextColor={colors.textMuted} />
              <Text style={styles.label}>Descrição *</Text>
              <TextInput style={[styles.input, styles.multiline]} value={form.description} onChangeText={v => updateForm('description', v)} multiline placeholder="O que precisa ser feito?" placeholderTextColor={colors.textMuted} />
              <Text style={styles.label}>Categoria *</Text>
              <TextInput style={styles.input} value={form.category} onChangeText={v => updateForm('category', v)} placeholder="Ex.: Estudos, Trabalho, Casa" placeholderTextColor={colors.textMuted} />
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.filters}>
                {['Baixa', 'Média', 'Alta'].map(value => <Pressable key={value} onPress={() => updateForm('priority', value)} style={[styles.filter, form.priority === value && styles.activeFilter]}><Text style={[styles.filterText, form.priority === value && styles.activeFilterText]}>{value}</Text></Pressable>)}
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Pressable disabled={busy} style={[styles.saveButton, busy && { opacity: 0.6 }]} onPress={saveTask}>
                <Text style={styles.saveButtonText}>{busy ? 'Salvando...' : 'Salvar tarefa'}</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => { setModalVisible(false); setError(''); }}><Text style={styles.cancelText}>Cancelar</Text></Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: StatusBar.currentHeight || 0,
  },

  // Cabeçalho
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: {
    color: colors.surface,
    fontWeight: '800',
  },

  // Resumo das tarefas
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryNumber: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.primary,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },

  // Pesquisa
  search: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
  },

  // Filtros
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 12,
  },
  activeFilterText: {
    color: colors.surface,
  },

  // Ordenação
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 5,
  },
  sortLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  sortOption: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  selectedSort: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // Lista de tarefas
  list: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 12,
    flexGrow: 1,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 9,
  },
  taskTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  priority: {
    backgroundColor: colors.secondary,
    color: colors.primaryDark,
    borderRadius: 15,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '800',
  },
  highPriority: {
    backgroundColor: '#FCE7E7',
    color: '#A61B1B',
  },
  taskTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 20,
  },

  // Ações das tarefas
  taskActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  smallButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },
  smallButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  doneButton: {
    backgroundColor: '#DDF7E7',
  },
  neutralButton: {
    backgroundColor: '#E9EDF3',
  },
  deleteButton: {
    backgroundColor: '#FCE7E7',
  },
  deleteText: {
    color: '#A61B1B',
    fontSize: 12,
    fontWeight: '800',
  },

  // Estado vazio
  empty: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },

  // Modal de cadastro e edição
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 22,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 18,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: colors.text,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#B42318',
    marginHorizontal: 20,
    marginTop: 12,
    lineHeight: 19,
  },

  // Botões do modal
  saveButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  saveButtonText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 15,
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
});