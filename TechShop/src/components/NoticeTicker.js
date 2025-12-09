import { StyleSheet, Text, View } from "react-native";
import MarqueeView from "react-native-marquee-view";

const NoticeTicker = () => {
  return (
    <View style={styles.container}>
      <MarqueeView
        style={{ width: "100%" }}
        speed={0.2}       // chỉnh tốc độ
        delay={0}         // chạy ngay lập tức
        loop={true}
      >
        <Text style={styles.text}>
          Giao nhanh  •  Miễn phí cho đơn 300k  •  Thu cũ giá ngon  •  Lên đời tiết kiệm  •  Sản phẩm chính hãng - Xuất VAT đầy đủ
        </Text>
      </MarqueeView>
    </View>
  );
};

export default NoticeTicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d32f2f",
    paddingVertical: 6,
    overflow: "hidden",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
