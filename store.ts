import { useEffect, useState } from 'react';
import { clearCompletedSQL, deleteTodoSQL, initDatabase, loadTodosSQL, saveTodoSQL } from './database';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Initialize database
initDatabase();

let todos: Todo[] = loadTodosSQL();
let listeners: (() => void)[] = [];

export function getTodos() {
  return todos;
}

export function setTodos(newTodos: Todo[]) {
  todos = newTodos;
  listeners.forEach(l => l());
}

export function addTodoToDB(todo: Todo) {
  saveTodoSQL(todo.id, todo.text, todo.completed);
  todos = [todo, ...todos];
  listeners.forEach(l => l());
}

export function toggleTodoDB(id: string) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  const updated = todos.find(t => t.id === id);
  if (updated) saveTodoSQL(updated.id, updated.text, updated.completed);
  listeners.forEach(l => l());
}

export function deleteTodoDB(id: string) {
  deleteTodoSQL(id);
  todos = todos.filter(t => t.id !== id);
  listeners.forEach(l => l());
}

export function clearCompletedDB() {
  clearCompletedSQL();
  todos = todos.filter(t => !t.completed);
  listeners.forEach(l => l());
}

export function useTodos() {
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    const listener = () => forceUpdate(n => n + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return todos;
}