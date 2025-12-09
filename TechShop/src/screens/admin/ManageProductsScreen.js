import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteProduct, getAllProducts } from "../../api/productApi";

const ManageProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://10.0.2.2:5029";

  // --------------------------
  // LOAD PRODUCTS
  // --------------------------
  const loadData = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res || []);
    } catch (err) {
      console.log("❌ API ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation]);

  // --------------------------
  // DELETE PRODUCT
  // --------------------------
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      console.log("❌ Delete error:", err);
    }
  };

  // --------------------------
  // RENDER ITEM
  // --------------------------
 const renderItem = ({ item }) => {
  let imageUrl = null;

  if (item.firstImage) {
    imageUrl = item.firstImage.startsWith("http")
      ? item.firstImage
      : `${BASE_URL}/images/products/${item.firstImage}`;
  }

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: imageUrl || "https://via.placeholder.com/120",
        }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.brand}>{item.brand} • {item.category}</Text>

        <Text style={styles.price}>
          {item.finalPrice.toLocaleString()} đ
        </Text>

        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate("AddProduct", { editData: item })
          }
        >
          <Ionicons name="create-outline" size={22} color="#e21029ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#dd1a1aff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


  // --------------------------
  // UI RENDER
  // --------------------------
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#e91818ff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
      </View>

      {/* BUTTON ADD */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Thêm sản phẩm</Text>
      </TouchableOpacity>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#f30f0fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Không có sản phẩm nào</Text>
          }
        />
      )}
    </View>
  );
};

export default ManageProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeaf4",
    paddingHorizontal: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#d41228ff",
    marginRight: 26,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f51f31ff",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    backgroundColor: "#ffd6e6",
    marginRight: 12,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },

  brand: {
    fontSize: 14,
    color: "#777",
  },

  price: {
    color: "#fe1111ff",
    fontWeight: "bold",
    marginTop: 4,
  },

  quantity: {
    color: "#fb1b44ff",
    marginTop: 2,
  },

  actions: {
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 14,
  },

  iconBtn: {
    padding: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});
