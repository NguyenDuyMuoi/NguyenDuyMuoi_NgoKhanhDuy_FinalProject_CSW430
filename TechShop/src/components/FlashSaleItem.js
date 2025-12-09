import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


const FlashSaleItem = ({ item, onAddToCart }) => {
   const navigation = useNavigation();
  // shake animation for badge
  const shake = useRef(new Animated.Value(0)).current;

  // fire progress animation
  const fireAnim = useRef(new Animated.Value(0)).current;

  const imageUrl = `http://10.0.2.2:5029/images/products/${item.imageUrl}`;

  // sold progress %
  const total = item.limitQuantity || 1;
  const sold = item.soldQuantity || 0;
  const progress = Math.min(Math.floor((sold / total) * 100), 100);

  // BADGE SHAKE
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shake, { toValue: 3, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -3, duration: 80, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // FIRE ANIMATION
  useEffect(() => {
    Animated.loop(
      Animated.timing(fireAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const fireWidth = fireAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.card}>

      {/* PRODUCT IMAGE */}
   <TouchableOpacity
  onPress={() => {
    const product = {
      id: item.productId,
      name: item.productName,
      firstImage: imageUrl,
      finalPrice: item.flashPrice,
      originalPrice: item.originalPrice ?? item.price ?? item.flashPrice,
      discountPercent: item.discountPercent,
      brand: item.brand,
      category: item.category,
      quantity: item.quantity,
      description: item.description,
    };

    navigation.navigate("ProductDetail", { product });
  }}
>
  <Image source={{ uri: imageUrl }} style={styles.productImage} />
</TouchableOpacity>


      {/* NAME */}
      <Text numberOfLines={1} style={styles.productName}>
        {item.productName}
      </Text>

      {/* PRICE */}
      <Text style={styles.salePrice}>
        {item.flashPrice.toLocaleString()}đ
      </Text>

      {/* BADGE SHAKE */}
      <Animated.View style={[styles.badge, { transform: [{ translateX: shake }] }]}>
        <Ionicons name="flame" size={16} color="#fff" />
        <Text style={styles.badgeText}>
          Còn {total - sold} suất
        </Text>
      </Animated.View>

      {/* PROGRESS BAR WITH FIRE EFFECT */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />

        <Animated.View style={[styles.fireEffect, { width: fireWidth }]} />
      </View>

      {/* ADD TO CART BUTTON */}
      <TouchableOpacity
        style={styles.btnAdd}
        onPress={onAddToCart}
      >
        <Ionicons name="cart-outline" size={16} color="#fff" />
        <Text style={styles.btnText}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlashSaleItem;

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    elevation: 3,
  },

  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
  },

  productName: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },

  salePrice: {
    color: "#ff0033",
    fontWeight: "bold",
    marginBottom: 6,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff820dff",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },

  progressBg: {
    height: 10,
    width: "100%",
    backgroundColor: "#ffd6d6",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#ff0033",
  },

  fireEffect: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,110,0,0.35)",
  },

  btnAdd: {
    flexDirection: "row",
    backgroundColor: "#ff0000ff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },

  btnText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 12,
  },
});
