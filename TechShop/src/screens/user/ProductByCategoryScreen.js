import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { cartApi } from "../../api/cartApi";
import { getProductsByCategory } from "../../api/productApi";
import { EventBus } from "../../utils/EventBus";

const ProductByCategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load userId
  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(parseInt(id));
    };
    loadUser();
  }, []);

  // Load product data
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProductsByCategory(category);
      setProducts(res);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  // Convert filename -> URL
  const getImageUrl = (img) => {
    if (!img) return null;

    if (!img.startsWith("http")) {
      return `http://10.0.2.2:5029/images/products/${img}`;
    }

    return img.replace("http://localhost", "http://10.0.2.2");
  };

  // ADD TO CART
  const handleAddToCart = async (productId) => {
    try {
      if (!userId) {
        Alert.alert("Thông báo", "Bạn cần đăng nhập trước!");
        return;
      }

      await cartApi.addToCart(userId, productId, 1);
      EventBus.emit("cartChanged");

      Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
    } catch (err) {
      Alert.alert("Lỗi", "Không thêm được vào giỏ hàng!");
    }
  };

  const renderItem = ({ item }) => {
    const imageURL = getImageUrl(item.firstImage);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetail", {
              product: { ...item, firstImage: imageURL },
            })
          }
        >
          <Image source={{ uri: imageURL }} style={styles.img} />

          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.priceNew}>
            {item.finalPrice.toLocaleString()}đ
          </Text>

          <View style={{ flexDirection: "row", gap: 6 }}>
            <Text style={styles.oldPrice}>
              {item.originalPrice.toLocaleString()}đ
            </Text>
            <Text style={styles.discount}>-{item.discountPercent}%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddToCart(item.id)}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
      />
    </View>
  );
};

export default ProductByCategoryScreen;


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 12,
    padding: 10,
    elevation: 3,
     
  },
  img: {
    width: "100%",
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceNew: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e91e1eff",
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#777",
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#f31932ff",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "600",
  },
});
