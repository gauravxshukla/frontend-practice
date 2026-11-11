import { FlatList, StyleSheet, Text, View } from 'react-native';
import users from './users';

// React Native has no <table> or <select>: rows are Views laid out with flex,
// FlatList renders the list, and a few Pressable "chips" can pick the page size.
const COLUMNS = [
  { label: 'ID', key: 'id', flex: 0.6 },
  { label: 'Name', key: 'name', flex: 2 },
  { label: 'Age', key: 'age', flex: 0.8 },
  { label: 'Occupation', key: 'occupation', flex: 2 },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Table</Text>
      <View style={[styles.row, styles.header]}>
        {COLUMNS.map(({ label, key, flex }) => (
          <Text key={key} style={[styles.cell, styles.headerText, { flex }]}>
            {label}
          </Text>
        ))}
      </View>
      <FlatList
        data={users}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 12,
    fontSize: 24,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d4d4d8',
  },
  header: {
    backgroundColor: '#f4f4f5',
  },
  cell: {
    paddingHorizontal: 4,
    fontSize: 13,
  },
  headerText: {
    fontWeight: '700',
  },
});
