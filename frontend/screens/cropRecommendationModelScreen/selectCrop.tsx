import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SelectCropScreen = ({ route, navigation }) => {
  // ✅ Get data from previous screen
  const result = route?.params?.result;
  const crops = result?.crops || [];
  const cropDetails = result?.details || {};

  const handleSelectCrop = (cropName) => {
    navigation.navigate("cropsDetails", {
      crop: cropName.toLowerCase().trim(),
    });
  };

  const renderCropCard = ({ item }) => {
    const details = cropDetails[item]?.profit;
    const isProfitable = details?.profit >= 0;

    return (
      <View style={styles.cropCard}>
        {/* TOP BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.mainButton}
          onPress={() => handleSelectCrop(item)}
        >
          <Text style={styles.buttonText}>{item.toUpperCase()}</Text>
        </TouchableOpacity>

        {/* DETAILS SECTION */}
        {details ? (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>💸 Cost: </Text>
              <Text style={styles.valueText}>₹{details.cost}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>🌾 Yield: </Text>
              <Text style={styles.valueText}>{details.yield}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>💰 Price: </Text>
              <Text style={styles.valueText}>₹{details.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>⚠ Risk: </Text>
              <Text style={styles.valueText}>{details.risk}</Text>
            </View>

            <View style={styles.divider} />

            <Text
              style={[
                styles.profitText,
                { color: isProfitable ? '#00e676' : '#ff5252' }
              ]}
            >
              Profit: ₹{details.profit}
               -/per Acre
            </Text>
          </View>
        ) : (
          <Text style={styles.noData}>No details available</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.flex1}>
      {/* Set StatusBar to match Orange Header */}
      <StatusBar barStyle="light-content" backgroundColor="#ff9100" translucent={false} />

      {/* 1. BRANDED TOP HEADER */}
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.logoRow}>
              <Text style={styles.headerLogo}>AGROX</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <LinearGradient
        colors={['#1b2735', '#090a0f']}
        style={styles.background}
      >
        <View style={styles.flex1}>
          <Text style={styles.sectionTitle}>🌾 Recommended Crops</Text>

          {crops.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.noDataCenter}>
                No crops found. Try different values.
              </Text>
            </View>
          ) : (
            <FlatList
              data={crops}
              renderItem={renderCropCard}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={styles.listPadding}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* BACK BUTTON */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>⬅ Back to Prediction</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  background: { flex: 1 },

  // Header Styles
  headerWrapper: {
    backgroundColor: '#ff9100',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Add extra padding for Android devices with notches
    paddingTop: Platform.OS === 'android' ? 5 : 0, 
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.5,
  },

  // Content Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00e676',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  listPadding: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cropCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mainButton: {
    backgroundColor: '#00c853',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    paddingHorizontal: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailText: {
    color: '#aaa',
    fontSize: 11,
  },
  valueText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
  },
  profitText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataCenter: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  backBtn: {
    alignSelf: 'center',
    marginBottom: Platform.OS === 'ios' ? 40 : 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SelectCropScreen;