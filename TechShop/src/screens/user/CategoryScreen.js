import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const brands = [
  { id: 1, name: "Apple", image: require("../../assets/images/brands/apple.png") },
  { id: 2, name: "Samsung", image: require("../../assets/images/brands/samsung.png") },
  { id: 3, name: "Lenovo", image: require("../../assets/images/brands/lenovo.png") },
  { id: 4, name: "HP", image: require("../../assets/images/brands/hp.png") },
  { id: 5, name: "LG", image: require("../../assets/images/brands/lg.png") },
  { id: 6, name: "Asus", image: require("../../assets/images/brands/asus.png") },
  { id: 7, name: "Logitech", image: require("../../assets/images/brands/logitech.png") },
  { id: 8, name: "Acer", image: require("../../assets/images/brands/acer.png") },
  { id: 9, name: "MSI", image: require("../../assets/images/brands/msi.png") },
  { id: 10, name: "Dell", image: require("../../assets/images/brands/dell.png") },
];

const CategoryScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Text style={styles.title}>Danh mục</Text>

      <View style={styles.grid}>
        {brands.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.brandCard}

            // ⭐ Gửi đúng brandName sang BrandProducts
            onPress={() =>
              navigation.navigate("ProductByBrand", {
                brandName: item.name,  // API cần brand string
              })
            }
          >
            <Image source={item.image} style={styles.brandImg} />
            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeef6",
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e92e3dff",
    marginBottom: 10,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  brandCard: {
    width: "47%",
    backgroundColor: "white",
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
  },
  brandImg: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 8,
  },
  brandName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e21e1eff",
  },
});

export default CategoryScreen;
