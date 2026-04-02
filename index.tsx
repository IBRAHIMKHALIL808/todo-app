import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadTodos();
    }, [])
  );

  const loadTodos = async () => {
    try {
      const saved = await AsyncStorage.getItem('todos');
      if (saved) setTodos(JSON.parse(saved));
    } catch (e) {}
  };

  const saveTodos = async (newTodos: Todo[]) => {
    await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const addTodo = () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter a task!');
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
    };
    const updated = [newTodo, ...todos];
    setTodos(updated);
    saveTodos(updated);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          const updated = todos.filter(t => t.id !== id);
          setTodos(updated);
          saveTodos(updated);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>
      <Text style={styles.subtitle}>
        {todos.filter(t => !t.completed).length} tasks remaining
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={styles.todoLeft}
              onPress={() => toggleTodo(item.id)}
            >
              <View style={[styles.checkbox, item.completed && styles.checked]}>
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.todoText, item.completed && styles.done]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add one above!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '800', color: '#f0ede8', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  input: {
    flex: 1, backgroundColor: '#151515', color: '#f0ede8',
    borderRadius: 10, padding: 14, fontSize: 16,
    borderWidth: 1, borderColor: '#222',
  },
  addBtn: {
    backgroundColor: '#ff6b35', borderRadius: 10,
    width: 50, justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 28, fontWeight: '600' },
  todoItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#151515', borderRadius: 12, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#222',
  },
  todoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: '#ff6b35',
    marginRight: 12, justifyContent: 'center', alignItems: 'center',
  },
  checked: { backgroundColor: '#ff6b35' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '800' },
  todoText: { fontSize: 16, color: '#f0ede8', flex: 1 },
  done: { textDecorationLine: 'line-through', color: '#555' },
  deleteBtn: { fontSize: 20, marginLeft: 10 },
  empty: { textAlign: 'center', color: '#555', marginTop: 60, fontSize: 16 },
});