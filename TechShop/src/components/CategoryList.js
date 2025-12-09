import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const categories = [
  { id: "Laptop", name: "Laptop", icon: "laptop" },
  { id: "Mouse", name: "Mouse", icon: "mouse" },
  { id: "Earbuds", name: "Earbuds", icon: "earbuds" },
  { id: "Desktop", name: "Desktop", icon: "desktop-classic" },
  { id: "Case", name: "Case", icon: "desktop-tower" },
  { id: "Keyboard", name: "Keyboard", icon: "keyboard" },
];

const CategoryList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục sản phẩm</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("ProductByCategory", { category: item.id })}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={34}
              color="#e01313ff"
              style={{ marginBottom: 6 }}
            />

            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor:"#fff",
   
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
   
    padding:10,
    color: "red",
  },
  box: {
    alignItems: "center",
    backgroundColor: "#f5f2f4ff",
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    width: 90,
    elevation: 3,
    margin:10,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
  },
});
