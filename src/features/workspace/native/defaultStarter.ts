/**
 * App.js for React questions that have no hand-written starter-native/ yet:
 * a minimal screen to build the web prompt from React Native primitives.
 */
export function defaultNativeStarter(title: string): string {
  return `import { StyleSheet, Text, View } from 'react-native';

// Build this screen with React Native primitives: View, Text, Pressable,
// TextInput, FlatList, ScrollView and StyleSheet (no DOM elements or CSS files).
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{${JSON.stringify(title)}}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});
`;
}
