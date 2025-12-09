import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { cartApi } from "../../api/cartApi";
import BrandSection from "../../components/BrandSection";
import CategoryList from "../../components/CategoryList";
import FlashSaleSection from "../../components/FlashSaleSection";
import NoticeTicker from "../../components/NoticeTicker";

import { EventBus } from "../../utils/EventBus";

const { width: screenWidth } = Dimensions.get("window");

const banners = [
  require("../../assets/images/banner1.png"),
  require("../../assets/images/banner2.png"),
  require("../../assets/images/banner3.png"),
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const carouselRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  const [cartCount, setCartCount] = useState(0);

  // ⭐ Load giỏ hàng
  const loadCartCount = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const count = await cartApi.getCartCount(userId);

      setCartCount(count);
    } catch (err) {
      console.log("Load cart count error:", err);
    }
  };

  // ⭐ Reload khi quay lại Home
  useEffect(() => {
    if (isFocused) loadCartCount();
  }, [isFocused]);

  // ⭐ Lắng nghe EventBus (thêm giỏ -> cập nhật realtime)
  useEffect(() => {
    const sub = EventBus.on("cartChanged", () => {
      loadCartCount();
    });

    return () => sub.remove();
  }, []);

  // ⭐ Auto-carousel banner
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % banners.length;
      carouselRef.current?.scrollToIndex({ index, animated: true });
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  // ⭐ Badge hiển thị số lượng
  const renderBadge = () => {
    if (cartCount <= 0) return null;

    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {cartCount > 99 ? "99+" : cartCount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🔥 BANNER CHẠY DÒNG */}
        <NoticeTicker />

        {/* 🔥 HEADER SEARCH + CART */}
        <View style={styles.header}>
          {/*logo*/}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* SEARCH BOX */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#aaa" />
            <TextInput
              placeholder="Tìm kiếm sản phẩm..."
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() =>
                navigation.navigate("SearchResult", { keyword: searchText })
              }
              style={styles.searchInput}
            />

          </View>

          {/* CART ICON */}
          <TouchableOpacity
            style={styles.cartIconWrapper}
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="cart-outline" size={26} color="#ff3344ff" />
            {renderBadge()}
          </TouchableOpacity>
        </View>
         {/* 🔥 CategoryList */}
         <CategoryList navigation={navigation} />

        {/* 🔥 BANNER SLIDER */}
        <FlatList
          ref={carouselRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.bannerImage} />
          )}
        />
        
        {/* 🔥 FLASH SALE */}
        <FlashSaleSection />
        {/* brands section */}
        <BrandSection navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffeef7", paddingTop: 50 },

  // ⭐ HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },


  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    marginLeft: 5,
  },

  searchPlaceholder: {
    marginLeft: 8,
    color: "#aaa",
    fontSize: 14,
  },

  cartIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // ⭐ BADGE GIỎ HÀNG
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "red",
    paddingHorizontal: 5,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  bannerImage: {
    width: screenWidth,
    height: 180,
    resizeMode: "cover",
    borderRadius: 6,
  },
});
