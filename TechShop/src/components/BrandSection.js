import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const brands = [
  { name: "Apple", logo: require("../assets/images/brands/apple.png") },
  { name: "Asus", logo: require("../assets/images/brands/asus.png") },
  { name: "Logitech", logo: require("../assets/images/brands/logitech.png") },
  { name: "HP", logo: require("../assets/images/brands/hp.png") },
  { name: "Dell", logo: require("../assets/images/brands/dell.png") },
  { name: "Lenovo", logo: require("../assets/images/brands/lenovo.png") },
];





const BrandSection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thương hiệu nổi bật</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {brands.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.brandCard}
            onPress={() =>
              navigation.navigate("ProductByBrand", { brandName: item.name })
            }
          >
            <Image source={item.logo} style={styles.logo} />

            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BrandSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 12,
    
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color:"red"
  },
  brandCard: {
    width: 85,
    height: 85,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  brandName: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color:"red"
  },
});
