import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import api from "../constants/api";
import { TokenManager } from "../utils/tokenManager";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Backend trả về JWT token và user info
      const { token, user } = response.data;
      
      // Lưu JWT token và user info
      await TokenManager.saveToken(token);
      await TokenManager.saveUser(user);
      
      Alert.alert("Thành công", `Chào mừng ${user.fullName} trở lại!`, [
        {
          text: "OK",
          onPress: () => router.replace("/home")
        }
      ]);
    } catch (error: any) {
      console.log("Login error:", error);
      let errorMessage = "Sai email hoặc mật khẩu";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>MAPIC Login</Text>

        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Màu nền đồng bộ với Register
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a73e8",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#1a73e8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  forgotText: {
    color: "#1a73e8",
    textAlign: "right",
    marginBottom: 15,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});

export default LoginScreen;
