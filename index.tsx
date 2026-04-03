import TodoItem from '@/components/TodoItem';
import React, { useState } from 'react';
import {
  Alert, FlatList, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { addTodoToDB, deleteTodoDB, toggleTodoDB, useTodos } from '../store';

export default function HomeScreen() {
  const todos = useTodos();
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter a task!');
      return;
    }
    addTodoToDB({
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
    });
    setInput('');
  };

  const deleteTodo = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTodoDB(id) }
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
          <TodoItem
            item={item}
            onToggle={toggleTodoDB}
            onDelete={deleteTodo}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add one above!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 24,
    paddingTop: 60
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f0ede8',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24
  },
  input: {
    flex: 1,
    backgroundColor: '#151515',
    color: '#f0ede8',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#222'
  },
  addBtn: {
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addBtnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    color: '#555',
    marginTop: 60,
    fontSize: 16
  }
});