import { StyleSheet, Text, View } from 'react-native';

// Draw each light as a View with equal width/height and borderRadius set to half
// of it to make a circle.
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traffic Light</Text>
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
