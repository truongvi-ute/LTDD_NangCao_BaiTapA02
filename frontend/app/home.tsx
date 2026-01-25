import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { TokenManager } from "../utils/tokenManager";

const HomeScreen = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await TokenManager.getUser();
    setUser(userData);
  };

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            await TokenManager.removeToken(); // Xóa user info
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Xin chào{user ? `, ${user.fullName}` : ""}!
        </Text>
        <Text style={styles.subtitle}>Chào mừng bạn đến với MAPIC</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>Email: {user.email}</Text>
            <Text style={styles.userInfoText}>
              Trạng thái: {user.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 50,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
});

export default HomeScreen;