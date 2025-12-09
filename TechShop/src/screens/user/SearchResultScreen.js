import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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
import { searchProducts } from "../../api/productApi";
import { EventBus } from "../../utils/EventBus";


const SearchResultScreen = ({ route, navigation }) => {
  // 🔍 Lấy keyword từ params (an toàn)
  const keyword =
    route?.params?.keyword ??
    route?.params?.searchText ??
    "";

  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState(null);

  // 📌 Lấy userId từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(parseInt(id));
    };
    loadUser();
  }, []);

  // 📌 Load danh sách tìm kiếm
  useEffect(() => {
    load();
  }, [keyword]);

  const load = async () => {
    try {
      const data = await searchProducts(keyword);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Search load error:", err.message);
    }
  };

  // ---------------------------
  // 🔥 FIX: Convert filename -> image URL
  // ---------------------------
  const getImageUrl = (img) => {
    if (!img) return null;

    // nếu backend trả về filename → convert đúng URL
    if (!img.startsWith("http")) {
      return `http://10.0.2.2:5029/images/products/${img}`;
    }

    // convert localhost cho emulator Android
    return img.replace("http://localhost", "http://10.0.2.2");
  };

  // ---------------------------
  // 🛒 Add to cart
  // ---------------------------
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
      console.log("Add cart error:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thêm được vào giỏ!");
    }
  };

  // ---------------------------
  // 🔥 Render mỗi sản phẩm
  // ---------------------------
  const renderItem = ({ item }) => {
    const uri = getImageUrl(item.firstImage);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ flexDirection: "row", flex: 1 }}
          onPress={() => navigation.navigate("ProductDetail", {
            product: {
              ...item,
              firstImage: getImageUrl(item.firstImage),
            }
          })}
        >
          <Image
            source={{ uri }}          // ❗ Không dùng require nữa
            style={styles.image}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.brand}>{item.brand}</Text>

            <Text style={styles.finalPrice}>
              {item.finalPrice.toLocaleString()} đ
            </Text>

            <View style={styles.row}>
              <Text style={styles.originalPrice}>
                {item.originalPrice.toLocaleString()} đ
              </Text>
              <Text style={styles.discount}>-{item.discountPercent}%</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleAddToCart(item.id)}
        >
          <Text style={styles.addBtnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
       <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={26} color="red"  backgroundColor="white"/>
            </TouchableOpacity>
           <Text style={styles.headerText}>Kết quả tìm kiếm: {keyword}</Text>
            <View style={{ width: 28 }} />
          </View>
  

      

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchResultScreen;

// ---------------------------
// 🎨 Styles
// ---------------------------
const styles = StyleSheet.create({
   header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
    paddingTop:45,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "red"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  finalPrice: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    marginRight: 8,
    fontSize: 13,
  },
  discount: {
    color: "#ff6600",
    fontWeight: "bold",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: "#e60e36ff",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
