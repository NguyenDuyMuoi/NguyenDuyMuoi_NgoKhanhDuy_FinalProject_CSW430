import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FooterContact = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.title}>Thông tin liên hệ</Text>

      <View style={styles.row}>
        <Ionicons name="call-outline" size={18} color="#ff6fb5" />
        <Text style={styles.text}> Hotline: 0974619342</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="mail-outline" size={18} color="#ff6fb5" />
        <Text style={styles.text}> Email: techshopsupport@gmail.com</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color="#ff6fb5" />
        <Text style={styles.text}> Địa chỉ: 111 Nam Kỳ Khởi Nghĩa, Phường Bình Dương, TP. Hồ Chí Minh</Text>
      </View>
    </View>
  );
};

export default FooterContact;

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6fb5",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginLeft: 4,
  },
});
