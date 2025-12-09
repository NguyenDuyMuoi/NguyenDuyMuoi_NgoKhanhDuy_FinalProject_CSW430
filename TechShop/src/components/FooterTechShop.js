import { Image, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FooterTechShop = () => {
  return (
    <View style={styles.container}>
      {/* --- SOCIAL MEDIA --- */}
      <Text style={styles.sectionTitle}>KẾT NỐI VỚI TECHSHOP</Text>

      <View style={styles.socialRow}>
        <Ionicons name="logo-facebook" size={28} color="#3b5998" />
        <Image
          source={require("../assets/icons/zalo.png")}
          style={styles.socialIcon}
        />
        <Ionicons name="logo-youtube" size={28} color="#FF0000" />
        <Ionicons name="logo-tiktok" size={28} color="#000" />
      </View>

      {/* --- HOTLINE --- */}
      <Text style={styles.sectionTitle}>TỔNG ĐÀI MIỄN PHÍ</Text>

      <Text style={styles.text}>Tư vấn mua hàng</Text>
      <Text style={styles.hotline}>1800.6601 (Nhánh 1)</Text>

      <Text style={[styles.text, { marginTop: 4 }]}>Hỗ trợ kỹ thuật</Text>
      <Text style={styles.hotline}>1800.6601 (Nhánh 2)</Text>

      <Text style={[styles.text, { marginTop: 4 }]}>
        Góp ý – Khiếu nại – Báo vi phạm
      </Text>
      <Text style={styles.hotline}>1800.6616 (8:00 - 22:00)</Text>

      {/* --- POLICIES --- */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>CHÍNH SÁCH</Text>

      <View style={styles.listCol}>
        <Text style={styles.listItem}>• Chính sách bảo hành</Text>
        <Text style={styles.listItem}>• Chính sách đổi trả</Text>
        <Text style={styles.listItem}>• Chính sách bảo mật</Text>
        <Text style={styles.listItem}>• Chính sách giao hàng</Text>
        <Text style={styles.listItem}>• Trả góp – Hoá đơn điện tử</Text>
      </View>

      {/* --- PAYMENT SUPPORT --- */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
        HỖ TRỢ THANH TOÁN
      </Text>

      <View style={styles.paymentGrid}>
        <Image
          source={require("../assets/payments/visa.png")}
          style={styles.payIcon}
        />
        <Image
          source={require("../assets/payments/mastercard.png")}
          style={styles.payIcon}
        />
        <Image
          source={require("../assets/payments/momo.png")}
          style={styles.payIcon}
        />
        <Image
          source={require("../assets/payments/zalopay.png")}
          style={styles.payIcon}
        />
      </View>

      {/* --- CERTIFICATION --- */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>CHỨNG NHẬN</Text>

      <View style={styles.certRow}>
        <Image
          source={require("../assets/cert/dmca.png")}
          style={styles.certIcon}
        />
        <Image
          source={require("../assets/cert/bo-cong-thuong.png")}
          style={styles.certIcon}
        />
      </View>

      <Text style={styles.copyright}>
        © 2025 TechShop – All rights reserved.
      </Text>
    </View>
  );
};

export default FooterTechShop;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#111", // dark footer
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    color: "#ddd",
    fontSize: 14,
  },
  hotline: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  listCol: {
    marginLeft: 10,
  },
  listItem: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  payIcon: {
    width: 50,
    height: 32,
    resizeMode: "contain",
  },
  certRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  certIcon: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  copyright: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 12,
  },
});
