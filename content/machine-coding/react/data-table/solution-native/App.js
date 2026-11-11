import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import users from './users';

const COLUMNS = [
  { label: 'ID', key: 'id', flex: 0.6 },
  { label: 'Name', key: 'name', flex: 2 },
  { label: 'Age', key: 'age', flex: 0.8 },
  { label: 'Occupation', key: 'occupation', flex: 2 },
];
const PAGE_SIZES = [5, 10, 20];

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}

function UsersTable({ rows }) {
  return (
    <>
      <View style={[styles.row, styles.header]}>
        {COLUMNS.map(({ label, key, flex }) => (
          <Text key={key} style={[styles.cell, styles.bold, { flex }]}>
            {label}
          </Text>
        ))}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(user) => String(user.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {COLUMNS.map(({ key, flex }) => (
              <Text key={key} style={[styles.cell, { flex }]}>
                {item[key]}
              </Text>
            ))}
          </View>
        )}
      />
    </>
  );
}

function Button({ label, disabled, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

// A row of chips stands in for the web version's <select>.
function PageSizePicker({ value, onChange }) {
  return (
    <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel="Page size">
      {PAGE_SIZES.map((size) => {
        const selected = size === value;
        return (
          <Pressable
            key={size}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(size)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={selected ? styles.chipTextSelected : undefined}>Show {size}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Table</Text>
      <PageSizePicker
        value={pageSize}
        onChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
      <UsersTable rows={paginate(users, page, pageSize)} />
      <View style={styles.pagination}>
        <Button label="Prev" disabled={page === 1} onPress={() => setPage(page - 1)} />
        <Text accessibilityLiveRegion="polite">
          Page {page} of {totalPages}
        </Text>
        <Button label="Next" disabled={page === totalPages} onPress={() => setPage(page + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { marginBottom: 12, fontSize: 24, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d4d4d8',
  },
  header: { backgroundColor: '#f4f4f5' },
  cell: { paddingHorizontal: 4, fontSize: 13 },
  bold: { fontWeight: '700' },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#d4d4d8' },
  chipSelected: { backgroundColor: '#5b5bd6', borderColor: '#5b5bd6' },
  chipTextSelected: { color: '#fff' },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 },
  button: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, backgroundColor: '#18181b' },
  buttonText: { color: '#fff', fontWeight: '600' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.35 },
});
