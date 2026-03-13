import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const COLORS = {
  primary: "#FF7A00",
  background: "#F4F6FA",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
};

export default function AdminDashboardScreen({ navigation }) {

  const Card = ({ title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Agro+ Admin</Text>
        <Text style={styles.subtitle}>
          Manage farmer updates & marketplace
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* CONTENT MANAGEMENT */}
        <Text style={styles.section}>Content Management</Text>

        <Card
          title="Post News"
          subtitle="Create agriculture news updates"
          onPress={() => navigation.navigate("AdminNews")}   // ✅ FIX
        />

        <Card
          title="Post Subsidy"
          subtitle="Add government subsidy schemes"
          onPress={() => navigation.navigate("AdminSubsidy")} // ✅ FIX
        />

        <Card
          title="Marketplace Offer"
          subtitle="Add crop buying price offers"
          onPress={() => navigation.navigate("AdminMarket")}  // ✅ FIX
        />

        {/* POSTS */}
        <Text style={styles.section}>Posts</Text>

        <Card
          title="View All Posts"
          subtitle="Manage all admin posts"
          onPress={() => navigation.navigate("AdminHome")}
        />

        {/* SETTINGS */}
        <Text style={styles.section}>Account</Text>

        <Card
          title="Logout"
          subtitle="Sign out from admin panel"
          onPress={() => navigation.replace("AdminLogin")}   // ✅ better
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: COLORS.background },

  header:{
    backgroundColor: COLORS.primary,
    padding:24,
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
  },

  title:{
    fontSize:26,
    fontWeight:"800",
    color:"#fff",
  },

  subtitle:{
    marginTop:6,
    fontSize:14,
    color:"#FFE7D1",
  },

  section:{
    marginTop:25,
    marginBottom:10,
    fontSize:16,
    fontWeight:"700",
    color: COLORS.text,
  },

  card:{
    backgroundColor: COLORS.card,
    padding:20,
    borderRadius:18,
    marginBottom:12,
    elevation:3,
  },

  cardTitle:{
    fontSize:16,
    fontWeight:"700",
    color: COLORS.text,
  },

  cardSubtitle:{
    fontSize:13,
    color: COLORS.subtext,
    marginTop:4,
  }
});