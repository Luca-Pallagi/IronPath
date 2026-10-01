import { Text, View, StyleSheet, Pressable } from "react-native";

export default function Index() {
  return (

    <View style={styles.container}>
      <Pressable style={styles.card}>
        <Text>Trainingsplan</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text>Übungen</Text>
      </Pressable>
      <Pressable style={styles.card}>
        <Text>Skill-Tree</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card:{
    backgroundColor: "lightgrey",
    width: "90%",
    padding: 50,
    margin: 15,
    borderRadius: 10,


    alignItems: "center",
    

    //Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});
