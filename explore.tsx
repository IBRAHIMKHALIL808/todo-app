import React from 'react';
import {
  FlatList, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import { getTodos, setTodos, useTodos } from '../store';

export default function CompletedScreen() {
  const todos = useTodos();
  const completed = todos.filter(t => t.completed);

  const clearCompleted = () => {
    setTodos(getTodos().filter(t => !t.completed));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <Text style={styles.subtitle}>{completed.length} tasks completed</Text>

      <FlatList
        data={completed}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No completed tasks yet!</Text>
        }
      />

      {completed.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearCompleted}>
          <Text style={styles.clearText}>Clear All Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '800', color: '#f0ede8', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#151515', borderRadius: 12, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#222',
  },
  check: { color: '#06d6a0', fontSize: 18, marginRight: 12, fontWeight: '800' },
  text: { fontSize: 16, color: '#555', textDecorationLine: 'line-through', flex: 1 },
  empty: { textAlign: 'center', color: '#555', marginTop: 60, fontSize: 16 },
  clearBtn: {
    backgroundColor: '#ef476f', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 16,
  },
  clearText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});