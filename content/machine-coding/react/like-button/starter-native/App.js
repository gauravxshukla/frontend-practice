import { StyleSheet, Text, View } from 'react-native';

// React Native has no :hover or CSS. Pressable's style callback receives
// { pressed, hovered } for the interactive states, and ActivityIndicator is the
// built-in spinner.
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Like Button</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});
