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

import {
  deleteFlashSaleItem,
  getFlashSaleDetail,
} from "../../api/flashSaleApi";

const FlashSaleDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const [flashSale, setFlashSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await getFlashSaleDetail(id);

      console.log("📌 FLASH SALE DETAIL:", data);

      setFlashSale(data);
    } catch (err) {
      console.log("❌ LOAD DETAIL ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteFlashSaleItem(itemId);
      loadDetail(); // reload after delete
    } catch (err) {
      console.log("❌ DELETE ITEM ERROR:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff4da6" />
      </View>
    );
  }

  if (!flashSale) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>Không tìm thấy Flash Sale!</Text>
      </View>
    );
  }

  // ---- RENDER ITEM ----
 const renderItem = ({ item }) => {
  const imageUrl = item.imageUrl
    ? `http://10.0.2.2:5029/images/products/${item.imageUrl}`
    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  return (
    <View style={styles.itemCard}>
      
      {/* IMAGE */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.productImage}
      />

      {/* INFO */}
      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.productName}</Text>

        <Text style={styles.infoText}>Giá Flash Sale: {item.flashPrice}đ</Text>
        <Text style={styles.infoText}>Giới hạn: {item.limitQuantity}</Text>
        <Text style={styles.infoText}>Đã bán: {item.soldQuantity}</Text>
      </View>

      {/* DELETE */}
      <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
        <Ionicons name="trash" size={22} color="red" />
      </TouchableOpacity>

    </View>
  );
};



  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết Flash Sale</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* FLASH SALE INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{flashSale.name}</Text>
        <Text style={styles.infoText}>Bắt đầu: {flashSale.startTime}</Text>
        <Text style={styles.infoText}>Kết thúc: {flashSale.endTime}</Text>
        <Text style={styles.status}>Trạng thái: {flashSale.status}</Text>
      </View>

      {/* ADD ITEM */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          navigation.navigate("AddFlashSaleItem", { flashSaleId: id })
        }
      >
        <Text style={styles.addBtnText}>+ Thêm sản phẩm</Text>
      </TouchableOpacity>

      {/* LIST ITEMS */}
      <FlatList
        data={flashSale.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: "#777" }}>Chưa có sản phẩm nào</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </View>
  );
};

export default FlashSaleDetailScreen;

// ---- STYLES ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#da232dff",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  productName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },

  brandText: {
    color: "#666",
    marginBottom: 6,
  },

  infoBox: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },

  title: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },

  infoText: { color: "#444", marginBottom: 2 },

  status: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#dd2121ff",
  },

  addBtn: {
    backgroundColor: "#f93535ff",
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },

  productImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#e5e5e5",
  },

  productName: {
    fontSize: 15,
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
