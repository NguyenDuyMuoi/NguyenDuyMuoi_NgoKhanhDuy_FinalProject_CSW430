import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { cartApi } from "../api/cartApi";
import { getActiveFlashSale } from "../api/flashSaleUserApi";
import { EventBus } from "../utils/EventBus";
import FlashSaleItem from "./FlashSaleItem";




const FlashSaleSection = () => {
  const [flashSale, setFlashSale] = useState(null);
  const [countdown, setCountdown] = useState("");
  const listRef = useRef(null);

  const handleAddToCart = async (productId) => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);

      await cartApi.addToCart(user.id, productId, 1);   
      EventBus.emit("cartChanged");

      Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");

    } catch (err) {
      console.log("Add to cart error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getActiveFlashSale();
      setFlashSale(res);
    } catch (err) {
      console.log("Flash sale error:", err);
    }
  };

  useEffect(() => {
    if (!flashSale) return;

    const timer = setInterval(() => {
      const end = new Date(flashSale.endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown("00:00:00");
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setCountdown(
        `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  useEffect(() => {
    if (!flashSale?.items?.length) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % flashSale.items.length;

      listRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [flashSale]);

  if (!flashSale || flashSale.items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⚡ Flash Sale — <Text style={{ color: "#ff0033" }}>{countdown}</Text>
      </Text>

      <FlatList
        ref={listRef}
        horizontal
        data={flashSale.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FlashSaleItem
            item={item}
            onAddToCart={() => handleAddToCart(item.productId)}  // ✅ FIXED
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10 }}
      />
    </View>
  );
};

export default FlashSaleSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffe9f2",
    paddingVertical: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ff0004ff",
    marginLeft: 10,
    marginBottom: 10,
  },
});
