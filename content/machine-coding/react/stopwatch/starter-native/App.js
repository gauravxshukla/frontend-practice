import { StyleSheet, Text, View } from 'react-native';

// Make the time display itself pressable (wrap it in Pressable) so tapping it
// toggles start/stop, like clicking it on the web.
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopwatch</Text>
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
