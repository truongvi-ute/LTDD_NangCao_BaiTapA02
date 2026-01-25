import React, { useState, useEffect } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import api from "../constants/api";

const VerifyOTPScreen = () => {
  const { email, type } = useLocalSearchParams();
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const isRegisterFlow = type === 'register';
  const isForgotFlow = type === 'forgot';

  // Countdown timer cho resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP!");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Lỗi", "Mã OTP phải có 6 số!");
      return;
    }

    // Nếu là forgot password flow, cần kiểm tra mật khẩu mới
    if (isForgotFlow) {
      if (!newPassword.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới!");
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
        return;
      }
    }

    setLoading(true);
    try {
      let successMessage;
      
      if (isRegisterFlow) {
        // Kích hoạt tài khoản
        await api.post("/auth/activate", {
          email,
          otp,
        });
        successMessage = "Tài khoản đã được kích hoạt! Bạn có thể đăng nhập ngay bây giờ.";
      } else if (isForgotFlow) {
        // Đặt lại mật khẩu
        await api.post("/auth/reset-password", {
          email,
          otp,
          newPassword,
        });
        successMessage = "Mật khẩu đã được đặt lại thành công!";
      }
      
      Alert.alert(
        "Thành công", 
        successMessage,
        [
          {
            text: "Đăng nhập",
            onPress: () => router.replace("/login")
          }
        ]
      );
    } catch (error: any) {
      console.log("Verify OTP error:", error);
      let errorMessage = "Mã OTP không hợp lệ hoặc đã hết hạn";
      
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

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      if (isRegisterFlow) {
        await api.post("/auth/resend-activation", { email });
      } else if (isForgotFlow) {
        await api.post("/auth/forgot-password", { email });
      }
      Alert.alert("Thành công", "Mã OTP mới đã được gửi!");
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể gửi lại mã OTP");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isRegisterFlow) return "Kích hoạt tài khoản";
    if (isForgotFlow) return "Đặt lại mật khẩu";
    return "Xác thực OTP";
  };

  const getSubtitle = () => {
    if (isRegisterFlow) return "Mã kích hoạt đã được gửi đến";
    if (isForgotFlow) return "Mã xác thực đã được gửi đến";
    return "Mã xác thực đã được gửi đến";
  };

  const getButtonText = () => {
    if (loading) {
      if (isRegisterFlow) return "Đang kích hoạt...";
      if (isForgotFlow) return "Đang đặt lại...";
      return "Đang xử lý...";
    }
    if (isRegisterFlow) return "Kích hoạt tài khoản";
    if (isForgotFlow) return "Đặt lại mật khẩu";
    return "Xác thực";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>
          {getSubtitle()}{"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <TextInput
          placeholder="Nhập mã OTP (6 số)"
          value={otp}
          onChangeText={setOTP}
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor="#999"
          editable={!loading}
        />

        {/* Chỉ hiển thị input mật khẩu cho forgot password flow */}
        {isForgotFlow && (
          <>
            <TextInput
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#999"
              editable={!loading}
            />

            <TextInput
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#999"
              editable={!loading}
            />
          </>
        )}

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
              <Text style={styles.resendText}>Gửi lại mã OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>
              Gửi lại sau {countdown}s
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: "bold",
    color: "#1a73e8",
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
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    color: "#1a73e8",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  countdownText: {
    color: "#999",
    fontSize: 14,
  },
  linkText: {
    color: "#1a73e8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});

export default VerifyOTPScreen;