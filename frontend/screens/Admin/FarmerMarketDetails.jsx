import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";

export default function FarmerMarketDetails({ route }) {

  const { post } = route.params;

  return (
    <ScrollView style={styles.container}>

      {post.image !== "" &&
        <Image source={{ uri: post.image }} style={styles.image}/>
      }

      <View style={styles.card}>
        <Text style={styles.crop}>{post.crop}</Text>
        <Text style={styles.price}>₹ {post.price} / Quintal</Text>

        <Text style={styles.info}>🏢 {post.org}</Text>
        <Text style={styles.info}>📍 {post.location}</Text>
        <Text style={styles.info}>Required Qty: {post.qty} </Text>

        <Text style={styles.desc}>{post.desc}</Text>

        {post.phone !== "" &&
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${post.phone}`)}
          >
            <Text style={{color:"#fff"}}>Call Buyer</Text>
          </TouchableOpacity>
        }
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
container:{ flex:1, backgroundColor:"#F4F6FA" },
image:{ width:"100%", height:260 },
card:{ backgroundColor:"#fff", margin:16, padding:18, borderRadius:18, elevation:4 },
crop:{ fontSize:22, fontWeight:"800" },
price:{ fontSize:20, color:"#2E7D32", fontWeight:"800", marginVertical:6 },
info:{ fontSize:14, color:"#555", marginTop:4 },
desc:{ marginTop:10, color:"#666" },
callBtn:{ backgroundColor:"#FF7A00", padding:14, borderRadius:14, alignItems:"center", marginTop:14 }
});