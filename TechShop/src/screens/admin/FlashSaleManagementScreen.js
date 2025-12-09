import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { deleteFlashSale, getFlashSales } from "../../api/flashSaleApi";

const FlashSaleManagementScreen = ({ navigation }) => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashSales();
  }, []);

  const loadFlashSales = async () => {
    try {
      setLoading(true);
      const res = await getFlashSales();   // ✅ ĐÃ FIX ĐÚNG API
      console.log("FLASH SALES:", res);
      setFlashSales(res);
    } catch (err) {
      console.log("❌ ERROR LOAD:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlashSale(id);
      loadFlashSales();
    } catch (err) {
      console.log("❌ ERROR DELETE:", err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("FlashSaleDetail", { id: item.id })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Start: {item.startTime}</Text>
        <Text style={styles.cardText}>End: {item.endTime}</Text>
        <Text style={styles.cardStatus}>Status: {item.status}</Text>
      </View>

      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Quản lý Flash Sale</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* BUTTON CREATE */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate("AddFlashSale")}
      >
        <Text style={styles.createBtnText}>+ Tạo Flash Sale</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff4da6" />
        </View>
      ) : flashSales.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: "#777" }}>Chưa có Flash Sale nào</Text>
        </View>
      ) : (
        <FlatList
          data={flashSales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default FlashSaleManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c91625ff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingTop:40,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  createBtn: {
    backgroundColor: "#e7252bff",
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  card: {
    flexDirection: "row",
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },

  cardText: {
    color: "#555",
    fontSize: 13,
  },

  cardStatus: {
    color: "#d80125ff",
    fontWeight: "bold",
    marginTop: 3,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
