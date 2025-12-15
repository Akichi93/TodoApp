import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { fetchTodos, createTodo, updateTodo, deleteTodo, setFilter, setSearchQuery, setPriorityFilter, setCurrentPage } from '../store/todoSlice';
import { useAuth } from '../utils/hooks';
import { Button, Input, Select, Modal, Card, Pagination } from '../components';
import { Textarea } from '../components';
import type { Todo } from '../utils/types';
import { getPriorityColor, formatDate, isOverdue } from '../utils/helpers';
import { debounce } from '../utils/helpers';

export const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { todos, currentPage, totalPages, filter, searchQuery, priorityFilter, loading } = useSelector(
    (state: RootState) => state.todos
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Todo['priority'],
    dueDate: '',
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchTodos() as any);
    }
  }, [dispatch, user, currentPage, filter, priorityFilter]);

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      dispatch(fetchTodos() as any);
    }, 500);

    if (searchQuery !== undefined) {
      debouncedSearch();
    }

    return () => {
      // Cleanup
    };
  }, [searchQuery, dispatch]);

  const handleOpenModal = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      });
    } else {
      setEditingTodo(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingTodo) {
        await dispatch(
          updateTodo({
            id: editingTodo.id,
            updates: {
              ...formData,
              dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
            },
          }) as any
        ).unwrap();
      } else {
        await dispatch(
          createTodo({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
          }) as any
        ).unwrap();
      }

      handleCloseModal();
      dispatch(fetchTodos() as any);
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      await dispatch(deleteTodo(id) as any);
      dispatch(fetchTodos() as any);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    await dispatch(
      updateTodo({
        id: todo.id,
        updates: { completed: !todo.completed },
      }) as any
    );
    dispatch(fetchTodos() as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Tâches</h1>
          <p className="mt-2 text-gray-600">Gérez toutes vos tâches en un seul endroit</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Nouvelle tâche
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <Select
            value={filter}
            onChange={(e) => {
              dispatch(setFilter(e.target.value as any));
            }}
            options={[
              { value: 'all', label: 'Toutes' },
              { value: 'active', label: 'Actives' },
              { value: 'completed', label: 'Complétées' },
            ]}
          />
          <Select
            value={priorityFilter}
            onChange={(e) => {
              dispatch(setPriorityFilter(e.target.value as any));
            }}
            options={[
              { value: 'all', label: 'Toutes les priorités' },
              { value: 'high', label: 'Haute' },
              { value: 'medium', label: 'Moyenne' },
              { value: 'low', label: 'Basse' },
            ]}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune tâche trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 border rounded-lg ${
                  todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                } ${isOverdue(todo.dueDate) && !todo.completed ? 'border-red-300' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <h3
                        className={`text-lg font-semibold ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(todo.priority)}`}
                      >
                        {todo.priority}
                      </span>
                      {isOverdue(todo.dueDate) && !todo.completed && (
                        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded">
                          En retard
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2 ml-8">{todo.description}</p>
                    {todo.dueDate && (
                      <div className="ml-8 text-sm text-gray-500">
                        Échéance: {formatDate(todo.dueDate)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(todo)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTodo ? 'Modifier la tâche' : 'Nouvelle tâche'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priorité"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
              options={[
                { value: 'low', label: 'Basse' },
                { value: 'medium', label: 'Moyenne' },
                { value: 'high', label: 'Haute' },
              ]}
            />
            <Input
              label="Date d'échéance"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingTodo ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
