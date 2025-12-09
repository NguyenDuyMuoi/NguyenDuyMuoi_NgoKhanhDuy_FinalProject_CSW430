import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DashboardScreen = ({ navigation, onLogout }) => {

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();   // ⭐ Reset role trong RootNavigator → QUAY VỀ LOGIN
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Admin Dashboard</Text>

      {/* PRODUCTS */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("ManageProducts")}
      >
        <Ionicons name="cube" size={26} color="#e61d23ff" />
        <Text style={styles.sectionText}>Quản lý sản phẩm</Text>
      </TouchableOpacity>

      {/* ORDERS */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("AdminOrders")}
      >
        <Ionicons name="document-text" size={26} color="#f30a2dff" />
        <Text style={styles.sectionText}>Quản lý đơn hàng</Text>
      </TouchableOpacity>

      {/* USERS */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("ManageUsers")}
      >
        <Ionicons name="people" size={26} color="#ee152bff" />
        <Text style={styles.sectionText}>Quản lý người dùng</Text>
      </TouchableOpacity>
      {/* FLASH SALE */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => navigation.navigate("FlashSaleManagement")}
      >
        <Ionicons name="flash" size={26} color="#e7111fff" />
        <Text style={styles.sectionText}>Quản lý Flash Sale</Text>
      </TouchableOpacity>


      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>ĐĂNG XUẤT ADMIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeef7",
    padding: 20
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ef3b41ff",
    textAlign: "center",
    marginVertical: 20,
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#f64a4fff",
    marginBottom: 18,
    elevation: 3,
  },

  sectionText: {
    fontSize: 18,
    marginLeft: 14,
    fontWeight: "600",
    color: "#333",
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: "#df1016ff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DashboardScreen;
