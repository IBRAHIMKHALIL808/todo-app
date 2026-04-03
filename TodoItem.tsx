import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Props {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ item, onToggle, onDelete }: Props) {
  return (
    <View style={styles.todoItem}>
      <TouchableOpacity style={styles.todoLeft} onPress={() => onToggle(item.id)}>
        <View style={[styles.checkbox, item.completed && styles.checked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.todoText, item.completed && styles.done]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteBtn}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});