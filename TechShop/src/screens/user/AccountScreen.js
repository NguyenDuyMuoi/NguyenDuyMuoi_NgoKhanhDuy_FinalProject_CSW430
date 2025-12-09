import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";



const AccountScreen = ({ onLogout }) => {
  const navigation = useNavigation(); //luôn nằm đầu 
  const [user, setUser] = useState(null);

  // 🔥 Load thông tin user từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const json = await AsyncStorage.getItem("user");
      if (json) setUser(JSON.parse(json));
    };
    loadUser();
  }, []);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tài khoản</Text>

      {/* USER CARD */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.avatar}
          />
         


          <View style={{ marginLeft: 16 }}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>Gmail:</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={styles.value}>Active</Text>
          </View>
        </View>
      </View>
       <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#ed2a2aff", fontWeight: "600" }}>✏️ Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("OrderHistory")}
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Ionicons name="document-text-outline" size={20} color="#333" />
        <Text style={{ marginLeft: 5, color: "#eb0d2aff", fontWeight: "600"  }}>Lịch sử đặt hàng</Text>
      </TouchableOpacity>


      {/* CONTACT INFO */}
      <View style={styles.contactBox}>
        <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={20} color="#444" />
          <Text style={styles.rowText}>Hotline: 0909 999 888</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={20} color="#444" />
          <Text style={styles.rowText}>support@techshop.vn</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color="#444" />
          <Text style={styles.rowText}>111 Hùng Vương, Phường Bình Dương, TP. Hồ Chí Minh</Text>
        </View>

        <View style={styles.socialRow}>
          <Ionicons name="logo-facebook" size={26} color="#1877F2" />
          <Ionicons name="logo-instagram" size={26} color="#E1306C" />
          <Ionicons name="logo-tiktok" size={26} color="#000" />
          <Ionicons name="logo-youtube" size={26} color="#FF0000" />
        </View>
      </View>

      {/* LEGAL INFO */}
      <View style={styles.legalBox}>
        <Text style={styles.sectionTitle}>Thông tin pháp lý</Text>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="document-text-outline" size={20} color="#444" />
          <Text style={styles.rowText}>Chính sách bảo mật</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#444" />
          <Text style={styles.rowText}>Điều khoản sử dụng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="refresh-outline" size={20} color="#444" />
          <Text style={styles.rowText}>Chính sách đổi trả</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="construct-outline" size={20} color="#444" />
          <Text style={styles.rowText}>Chính sách bảo hành</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="card-outline" size={20} color="#444" />
          <Text style={styles.rowText}>Điều khoản thanh toán</Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff7fb", padding: 20, paddingTop: 50 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f21229ff",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffd6ec",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#f5929bff",
  },
  label: { fontWeight: "600", marginTop: 8, color: "#777" },
  value: { color: "#333", marginBottom: 4 },

  contactBox: {
    backgroundColor: "#fff",
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffd6ec",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#f31730ff",
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  rowText: { marginLeft: 10, fontSize: 15, color: "#444" },
  socialRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-around",
  },

  legalBox: {
    backgroundColor: "#fff",
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffd6ec",
  },

  logoutButton: {
    marginTop: 28,
    backgroundColor: "#e31017ff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
